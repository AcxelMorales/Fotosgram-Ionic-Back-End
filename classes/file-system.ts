import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

import { IFileUpload } from '../interfaces/file';

export default class FileSystem {

  constructor() { }

  saveImageTemp(file: IFileUpload, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // crear carpeta
      const path: string = this.createUserFolder(userId);
      
      // generar un nombre único
      const fileName: string = this.generateUniqueFileName(file.name);
  
      // mover el archivo a la carpeta temp
      file.mv(`${path}/${fileName}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private createUserFolder(userId: string): string {
    const pathUser: string     = path.resolve(__dirname, '../uploads/', userId);
    const pathUserTemp: string = pathUser + '/temp';

    if (!fs.existsSync(pathUser)) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  private generateUniqueFileName(originalName: string): string {
    const nameArr : string[] = originalName.split('.');
    const ext     : string = nameArr[nameArr.length - 1];
    const uniqueId: string = uniqid();

    return `${uniqueId}.${ext}`;
  }

  public imagesTempPost(userId: string): any[] {
    const pathTemp: string = path.resolve(__dirname, '../uploads/', userId, 'temp');
    const pathPost: string = path.resolve(__dirname, '../uploads/', userId, 'posts');

    if (!fs.existsSync(pathTemp)) return [];

    if (!fs.existsSync(pathPost)) fs.mkdirSync(pathPost);

    const imagesTemp = this.getImagesInTemp(userId);
    imagesTemp.forEach(img => fs.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`));

    return imagesTemp
  }

  private getImagesInTemp(userId: string): any[] {
    const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
    return fs.readdirSync(pathTemp) || [];
  }

  public getPhotoUrl(userId: string, img: any): string {
    const pathPhoto: string = path.resolve(__dirname, '../uploads/', userId, 'posts', img);

    if (!fs.existsSync(pathPhoto)) {
      return path.resolve(__dirname, '../assets/400x250.jpg');      
    }

    return pathPhoto;
  }

}