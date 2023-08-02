import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserRepository } from '../../user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) { }

  async canActivate(
    context: ExecutionContext & { contextType: string },
  ): Promise<any> {
    const ctx = context.switchToHttp().getRequest();
    const authorization = ctx.headers['authorization'];

    if (!authorization) throw new UnauthorizedException();

    try {
      const [, token] = authorization.split(' ');
      const payload = this.jwtService.verify(token);

      const user = await this.userRepository.findOneBy({ id: payload.id });
      if (!user || !user.isActive) return false;

      ctx.user = user;

      // if (!user.stripeId) await this.setupStripe(user);

      return true;
    } catch {
      return false;
    }
  }
}