import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private userSERV: UserService, private GameSERV: GameService) {
    }

    @Get('history/:username')
    async get_his(@Param('username') tofind: string, @Req() req) {


        const ret = await this.GameSERV.gamehistory.find({ where: [{ player1: tofind }, { player2: tofind }] });
        const arr = []
        for (const one of ret) {
            const user = await this.userSERV.findbyusername(one.player1)
            const user2 = await this.userSERV.findbyusername(one.player2)
            if (user) {
                one.player1_avatar = user.Avatar_URL
            }
            else
                one.player1_avatar = "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png"

            if (user2) {
                one.player2_avatar = user2.Avatar_URL
            }
            else
                one.player2_avatar = "https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle-thumbnail.png"
            arr.push(one)
        }
        return arr
    }





    @Get('ranking')
    async get_ranking() {
        const result = await this.userSERV.userRepository.find()
        const ret = []

        for (const oneuser of result) {
            ret.push([oneuser.ladder_lvl, oneuser.username, oneuser.Avatar_URL])
        }

        ret.sort(function (a, b) {


            return b[0] - a[0];
        });

        return ret
    }
}
