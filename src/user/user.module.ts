import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { MailerModule } from '../mailer/mailer.module';
import { StripeModule } from '../stripe/stripe.module';
import { JwtModuleAsync } from '../app.module';

// !: remove repository later from exports
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailerModule,
    forwardRef(() => JwtModuleAsync),
    forwardRef(() => StripeModule)
  ],
  controllers: [UserController],
  providers: [
    { provide: 'IUserService', useClass: UserService },
    UserRepository
  ],
  exports: [
    { provide: 'IUserService', useClass: UserService },
    UserRepository,
  ]
})
export class UserModule { }
