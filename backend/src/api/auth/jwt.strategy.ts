import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Use a real secret stored in `.env`
    });
  }

  async validate(payload: { email: string; sub: string }) {
    // Find the user in the database
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      console.log(`user not found in validate in jwt.strategy.ts`);
      console.log(payload.sub);
      throw new UnauthorizedException();
    }
    return user; // Attach the user object to the request
  }
}
