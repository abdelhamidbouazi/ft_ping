/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.controller.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:24:19 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/26 14:25:13 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { BadRequestException, Body, Controller, ForbiddenException, Get, NotFoundException, Post, Query, Req, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib'
import { UserService } from '../users/users.service';
import { PongGuaard } from './auth_guard_pong';
import { twofacode_dto } from './dto/twofadto';
import axios from 'axios';
import Cryptr from 'cryptr'

@Controller('auth')
export class AuthController {
	private cryptr: Cryptr;
	constructor(private  userService: UserService, private jwtService: JwtService) {
		this.cryptr = new Cryptr(process.env.cryptr_secret_key);	
	}
	
/*************************************************************** Redirect the resource owner (a 42 user) to 42 *************************************/
	@Get('auth_first')
	auth_first(@Res() res) 
	{
		res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.client_id}&redirect_uri=${process.env.redirect_uri}&response_type=code`)
	}
/***************************************************************  Auth Callback  : ******************************************************************
**** redirected back to the web application and an authorization code is included in the URL as the code query parameter ****************************
*****************************************************************************************************************************************************/

	@Get('oauth_callback')
	async OAuth_Callback(@Req() req, @Res() res, @Query('code') authorization_Code: string) {
		try {
			const exchange_code_for_access_token = await axios.post('https://api.intra.42.fr/oauth/token',
				{
					grant_type: 'authorization_code',
					client_id: process.env.client_id,
					client_secret: process.env.client_secret,
					code: authorization_Code,
					redirect_uri: process.env.redirect_uri,
				}
			);

	//exchange_code_for_access_token.data.access_token  , " token")
			const profile = await axios.get('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: `Bearer ${exchange_code_for_access_token.data.access_token}`,
				},
			});
			
			// //profile.data, " profile")
			
			const user = await this.userService.findbyusername(profile.data.login);
			if (!user) //New User
			{
				await this.userService.createUserFromFortyTwoProfile(profile.data)
				const jwt = await this.jwtService.signAsync({ payload: profile.data.login });
				await res.cookie('jwt_token_mine', jwt, { httpOnly: true });
				/*Using the HttpOnly flag when generating a cookie helps mitigate the risk of client side script accessing the protected cookie */
				return res.redirect(`${process.env.IP_FRONT}/setup`);

			}
			else //Old User
			{
				const jwt = await this.jwtService.signAsync({ payload: profile.data.login });
				/*
						to test it use console : document.cookie it will not show  the cookie
				*/
				await res.cookie('jwt_token_mine', jwt, { httpOnly: true });
				const userToUpdate = await this.userService.findbyusername(user.username);
				if (userToUpdate) {
					if (userToUpdate.isTwoFactorEnable == true) {
						return res.redirect(`${process.env.IP_FRONT}/2fa`);
					}
					userToUpdate.is_looged = true;
					await this.userService.userRepository.save(userToUpdate);
					return res.redirect(`${process.env.IP_FRONT}/dashboard`);
				} else {
					throw new NotFoundException('BackEND-atabiti: No such User!');
				}
			}
		} catch (err) {
			// http://10.12.2.1:3000/auth/oauth_callback?code=0215ssf8349ca8a7679437aa02sa
			throw new BadRequestException
				("backend-atabiti: You did not clicked On authorise button Or  The code is Wrong Or The provided authorization grant is invalid, expired, revoked,  does not match the redirection URI used in the authorization request, or was issued to another client")
		}
	}

/***************************************************************  Logout *********************************************************************************************/
@UseGuards(PongGuaard)
@Post('logout') 
	async logout(@Req() req, @Res() res) {
		try {
			const userTologout =req.user_data
				userTologout.is_looged = false;
				userTologout.status = 'offline';
				userTologout.sockets_for_status =[];
				await this.userService.userRepository.save(userTologout);
				res.clearCookie('jwt_token_mine');
				return res.status(200).json({ success: true });
		} catch {
			throw new UnauthorizedException('Logout failed');
		}
	}
/********************************** 1- 2fa generate******************************************************/
	@UseGuards(PongGuaard)
	@Post('2fa_generate')
	async two_fa_generate(@Req() req) :Promise<{secret: string}>
	 {
		try {

			const userToupdate =req.user_data
			const secret = authenticator.generateSecret();
			const encryptedString = this.cryptr.encrypt(secret);
			await this.userService.update_two_fa(userToupdate, encryptedString);
			return { secret };
		} catch {
			throw new BadRequestException('2fa generation has failed!!')
		}
	}

	/**********************************2- 2fa activate ******************************************************/
	@UseGuards(PongGuaard)
	@Post('2fa_activate')  // done
	async two_activate(@Res() res, @Req() req, @Body(new ValidationPipe()) twoFaCode: twofacode_dto) {
		try {
			const userToUpdate =  req.user_data
			let secret = await this.userService.get_two_fa_secret(userToUpdate.username);

			if (secret) {
				const decryptedString = this.cryptr.decrypt(secret);

				const bool = authenticator.verify({ token: twoFaCode.two_fa_code, secret:decryptedString });
				if (bool == true) {
					if (userToUpdate) {
						userToUpdate.isTwoFactorEnable = true;
						await this.userService.userRepository.update(userToUpdate.id, userToUpdate);
					}
					return res.status(200).json({ success: true });

				} else {
					throw new ForbiddenException('2FA failed');
				}
			}
			else {
				throw new ForbiddenException(
					'activate 2fa First by generating new code');
			}
		} catch {
			throw new ForbiddenException('activate 2fa First by generating new code');
		}
	}

	/**********************************	3-  2fa deactivate ******************************************************/
	@UseGuards(PongGuaard)
	@Post('2fa_deactivate')
	async twofa_deactivate(@Res() res, @Req() req, @Body(new ValidationPipe) twoFaCode: twofacode_dto) {
		try {
			const userToUpdate= req.user_data
			let secret = await this.userService.get_two_fa_secret(userToUpdate.username);
			const decryptedString = this.cryptr.decrypt(secret);
			const bool = authenticator.verify({ token: twoFaCode.two_fa_code, secret:decryptedString});
			if (bool == true) {
				if (userToUpdate) {
					userToUpdate.isTwoFactorEnable = false;
					userToUpdate.twoFactorAuthSecret = null;
					await this.userService.userRepository.save(userToUpdate);
					return res.status(200).json({ success: true });
				}
			}
			throw UnauthorizedException
		} catch {
			throw new UnauthorizedException('2fa  deactivation has  Failed/Or it is not turned ON')
		}
	}


	/************************************************************* 4- 2fa auth ******************************************************/
	@Post('2fa_auth')
	async two_fa_auth(@Req() req, @Res() res, @Body(new ValidationPipe) twoFaCode: twofacode_dto) {
		try {
			
			const username = await this.userService.http_decoder(req.headers.cookie);
			//username, " usrname  ")
			const userToUpdate = await this.userService.findbyusername(username)
			let secret = await this.userService.get_two_fa_secret(userToUpdate.username);
			const decryptedString = this.cryptr.decrypt(secret);
			const bool = authenticator.verify({ token: twoFaCode.two_fa_code, secret:decryptedString });
			if (bool == true) {
				if (userToUpdate) {
					userToUpdate.is_looged = true;
					// res.redirect(`${process.env.IP_FRONT}/dashboard`);
					 await this.userService.userRepository.save(userToUpdate);
					 return res.status(200).json({ success: true });
				} else {
					throw new UnauthorizedException('Unauthorized !')
				}
			} else {
				throw new UnauthorizedException('Incorrect 2fa code , try again!');
			}
		} catch (error) {
			throw new UnauthorizedException(error)
		}
	}
}
