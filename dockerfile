# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: atabiti <atabiti@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/10/18 09:23:38 by atabiti           #+#    #+#              #
#    Updated: 2023/10/18 09:23:38 by atabiti          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:latest
WORKDIR /app
# COPY package*.json ./
COPY   . .
# Install dependencies
RUN npm install && npm run build
CMD ["npm", "run","start"] 
