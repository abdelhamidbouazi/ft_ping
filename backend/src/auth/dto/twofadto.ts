
import { IsNotEmpty, IsString } from "class-validator"
export class twofacode_dto {
    @IsNotEmpty()
     @IsString() two_fa_code: string;
  }
  