/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/18 09:27:31 by atabiti           #+#    #+#             */
/*   Updated: 2023/10/18 09:27:31 by atabiti          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule); //The create() method returns an application object,
  app.enableCors({
    origin: process.env.IP_FRONT,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  






  
    await app.listen(3000);
}
bootstrap();
