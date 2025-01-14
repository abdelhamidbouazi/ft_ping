/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendrequest.entity.ts                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:26:30 by atabiti           #+#    #+#             */
/*   Updated: 2024/01/12 13:43:23 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';


@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    sender: string;
    @Column()
    receiver: string;
    @Column()
    status: string;
}