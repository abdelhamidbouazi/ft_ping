import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class adminDto {
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}

export class durationDto {
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;

    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    duration: number;
}

export class deleteChannelDto {
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}

export class updateTitleDto {
    @MaxLength(20, { message: 'title is too large', })
    @MinLength(1, { message: 'title is too small', })
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}


export class UpdateTypeDto {    
    @IsString()
    @IsNotEmpty()
    type: string;

    password: string;

    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}

export class UpdatePasswrdDto {
    @IsString()
    @IsNotEmpty()
    password: string;

    @Max(1000000, { message: 'Number is too large', })
    @Min(1, { message: 'Number is too small', })
    @IsNumber()
    @IsNotEmpty()
    channelId: number;
}