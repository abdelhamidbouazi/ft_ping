import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class messageDto {
    @IsNumber()
    @IsNotEmpty()
    messageId: number
    
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number
}

export class MessageDto {
    @MaxLength(1000000)
    @MinLength(1)
    @IsString()
    @IsNotEmpty()
    channelId: string;

    @MaxLength(300)
    @MinLength(1)
    @IsString()
    @IsNotEmpty()
    message: string;
  }