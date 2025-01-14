import { Injectable } from '@nestjs/common';
import ImageKit from "imagekit"
@Injectable()
export class AvatarUploadService {
  constructor() { }


  async uploadavatar(filedata:any): Promise<string> {
    const avatarKit = new ImageKit({
      publicKey: process.env.publicKey,
      privateKey: process.env.privateKey,
      urlEndpoint: process.env.urlEndpoint,
    });
    const uploadResponse = await avatarKit.upload({
      file: filedata.buffer,
      fileName: filedata.originalname,
    });
    return uploadResponse.url;
  }
}
