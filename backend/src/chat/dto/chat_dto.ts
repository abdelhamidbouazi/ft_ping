/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat_dto.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/31 10:02:47 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 10:02:50 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"


export class chat_dto
{
    @IsNotEmpty()
    @IsString()
    sender:string
    @IsNotEmpty()
    @IsString()
    receiver:string
    @MaxLength(500)
    @MinLength(1)
    @IsString()
    @IsNotEmpty()
    text:string
}