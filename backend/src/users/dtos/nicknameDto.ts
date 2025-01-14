
import { IsNotEmpty, Length, NotContains, IsAscii, IsAlphanumeric } from 'class-validator';
export class nickname_dto {

@IsNotEmpty()
  @Length(2, 20)
  @IsAlphanumeric()
  nickname: string;
}
export class displayName_dto {
  @IsNotEmpty()
  @IsAscii()
  @NotContains("@")
  @NotContains("1")
  @NotContains("2")
  @NotContains("3")
  @NotContains("4")
  @NotContains("5")
  @NotContains("6")
  @NotContains("7")
  @NotContains("8")
  @NotContains("9")
  @NotContains("0")
  @NotContains("  ")
  @Length(3, 35)
  displayname: string;
}