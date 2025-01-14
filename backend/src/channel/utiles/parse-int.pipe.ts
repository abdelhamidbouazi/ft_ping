import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class myParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    try {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new BadRequestException('Validation failed');
      }
      if (val > 1000000)
        throw new BadRequestException('Validation failed - too big number');
      if (val < 1)
        throw new BadRequestException('Validation failed - too small number');
      if(val === undefined || val === null)
        throw new BadRequestException('Validation failed - undefined or null');
      return val;
    } catch (error) {
      throw error;
    }
  }
}

export class myParseIntPipe_WS implements PipeTransform<string, number> {
  transform(value: string): number {
    try {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        throw new WsException('Validation failed');
      }
      if (val > 1000000)
        throw new WsException('Validation failed - too big number');
      if (val < 1)
        throw new WsException('Validation failed - too small number');
      return val;
    } catch (error) {
      throw new  WsException(error);
    }
  }
}
