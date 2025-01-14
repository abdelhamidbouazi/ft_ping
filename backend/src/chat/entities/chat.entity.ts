/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   chat.entity.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:14 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 13:37:32 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
Entity,Column,PrimaryGeneratedColumn,CreateDateColumn,} from 'typeorm';
    
   @Entity()
   export class Chat {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    sender: string;
    
    @Column()
    receiver: string;
    
    @Column( {nullable :false})
    text: string;
    
    @CreateDateColumn()
    createdAttime: Date;
   }