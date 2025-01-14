/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth_guard_pong.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:24:17 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/28 02:52:49 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


//ExecutionContext :These utilities provide information about the current execution context which can be used to build generic guards,...
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { UserService } from 'src/users/users.service';

const secret = `${process.env.MY_JWT_SECRET}`
@Injectable()
export class PongGuaard {
  constructor(private jwtService: JwtService, private UserService: UserService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() == "ws") {
      const Client = context.switchToWs().getClient();
      
      try {
        
        const token = await this.extractTokenFromWS(Client.handshake.headers.cookie);
        const username_ = await this.jwtService.verifyAsync(token,
          {
            secret: secret
          });
          const USER = await this.UserService.findbyusername(username_.payload);
          
          if (!USER) {
            throw new WsException("invalid or Expired JWT Token")
          }
          // context.switchToWs().getData().user_mlogi = USER; //
          context.switchToHttp().getRequest().user_data = USER
          
        if (USER.is_looged == false && USER.isTwoFactorEnable == true) {
          throw new WsException("Please complete 2fa authentication")
        }
        if (USER.is_looged == false && USER.isTwoFactorEnable == false) {
          throw new WsException("NOT LOGGED")
        }
        return true;
      }
      catch (error) {
        Client.emit('error_message', error);
        throw new WsException("invalid or Expired JWT Token")

      }
    }
    if (context.getType() == "http") {
      const request = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      try {
        if(!request.headers.cookie)
        throw new UnauthorizedException("Login Failed: No Cookies")
        
        const token = await this.extractTokenFromHeader(request);
        const username_ = await this.jwtService.verifyAsync(token,
          {
            secret: secret
          });

        const USER = await this.UserService.findbyusername(username_.payload);
                if(!USER)
          throw new UnauthorizedException("Login Failed: No such user")
        
        request.user_data = USER;
        if (USER.is_looged == false && USER.isTwoFactorEnable == true) {
          throw new UnauthorizedException("Please complete 2fa authentication")
        }
        if (USER.is_looged == false && USER.isTwoFactorEnable == false) {
          throw new UnauthorizedException("NOT LOGGED")
        }
        return true;//is logged
      } catch (error) {
        // //error)
        throw new UnauthorizedException(error.message);
      }
    }
  }


  async extractTokenFromHeader(request: Request): Promise<string> {
    const splitted_cookies = request.headers.cookie.split(";") //jwt_token_minedd=eyJhbGRZ9tQM; cookie2=ddsdf2
    if (!splitted_cookies)
      throw new UnauthorizedException("NO cookie No LOIN !");
    for (let cookie__ of splitted_cookies) {
      let [name, value]: string[] = cookie__.split('=');
      let nowhitespaces = name.trim()
      if (nowhitespaces == "jwt_token_mine") {
        return value;
      }
    }
    throw new UnauthorizedException("HTTP: LOGIN FAILED:invalid cookie !");
  }

  async extractTokenFromWS(cookies: string): Promise<string> {
    const splitted_cookies = cookies.split(";")
    if (!splitted_cookies)
      throw new UnauthorizedException("NO cookie No LOIN !");
    for (let cookie__ of splitted_cookies) {
      let [name, value]: string[] = cookie__.split('=');
      let nowhitespaces = name.trim()
      if (nowhitespaces == "jwt_token_mine") {
        return value;
      }
    }
    throw new WsException("WS:LOGIN FAILED:invalid cookie !");
  }
}
