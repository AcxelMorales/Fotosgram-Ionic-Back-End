import jwt from 'jsonwebtoken';

/**
 * Config JsonWebTokens (JWT)
 */
export default class Token {

  private static seed: string = 'ft-seed-prv';
  private static expiration: string = '2d';

  static getJwtToken(payload: any): string {
    return jwt.sign({
      user: payload
    }, this.seed, {
      expiresIn: this.expiration
    });
  }

  static compareToken(userToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(userToken, this.seed, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
  }

}