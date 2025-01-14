import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class channelDto {
    @Max(1000000, { message: 'Number is too large', })
    @Min(-1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number

    @IsString()
    @IsNotEmpty()
    userId: number
}

export class joinChanDto {
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number

    @IsString()
    @IsNotEmpty()
    Password: string
}
