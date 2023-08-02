import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { UserRepository } from './user.repository';
import { IUserEntity, UserEntity } from './entities/user.entity';
import { IMailerService } from '../mailer/mailer.service';
import { MailEntity } from '../mailer/entities/mail.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';

type UserEntityWithoutPass = Omit<UserEntity, 'password'>;

@Injectable()
export class UserService implements IUserService {
  private readonly jwtExpiresIn: string;
  private readonly freeSecond: number;
  private readonly apiEmail: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('IMailerService') private readonly mailerService: IMailerService,
  ) {
    this.apiEmail = this.configService.get<string>('SMTP_EMAIL');
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    this.freeSecond = this.configService.get<number>('FREE_SECONDS_AT_REGISTER');
  }

  async createUser(userData: CreateUserDto) {
    const { userName, password, acceptCallbackURL } = userData;

    const user = await this.userRepository.create({
      userName: userName.toLowerCase(),
      password: password,
      paidSeconds: this.freeSecond,
      isActive: false
    });

    const token = this.jwtService.sign({ userId: user.id, isActive: user.isActive })
    const registerLink = `${acceptCallbackURL}/${token}`;

    await this.mailerService.sendMail({
      from: this.apiEmail,
      to: userName,
      subject: 'SignUp',
      html: `<p>Dear ${userName} to register account please continue next steps. If you aren't want to continue just ignore this letter.</p><p>Approve register: ${registerLink}</p>`
    })

    return 'Please check your email.';
  }

  async approveRegister(token: string) {
    const { userId, isActive } = this.jwtService.verify(token);

    if (isActive) throw new Error('User already active!');

    const user = await this.findOneBy({ id: userId });
    if (!user) throw Error('User not found!')

    const updatedUser = await this.update({ isActive: true }, user.id);
    Reflect.deleteProperty(updatedUser, 'password');

    return { 
      user: updatedUser,
      token: this.jwtService.sign({ id: user.id }, { expiresIn: this.jwtExpiresIn })
    };
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);

    return result.affected > 0
  }

  async findUserById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneBy(userData: Partial<UserEntity>) {
    return await this.userRepository.findOneBy(userData);
  }

  async signIn(userData: Partial<UserEntity>) {
    const user = await this.userRepository.findOneBy(userData);
    if (!user) throw Error('User not found!');

    Reflect.deleteProperty(user, 'password');

    return { 
      user,
      token: this.jwtService.sign({ id: user.id }, { expiresIn: this.jwtExpiresIn })
    };
  }

  async update(userData: Partial<UserEntity>, userId: string) {
    return await this.userRepository.update(userId, userData);
  }

  async resetPassword(data: ResetPasswordDto) {
    const { password, secret } = data;
    const user: UserEntityWithoutPass = this.jwtService.verify(secret);

    return await this.userRepository.update(user.id, { password });
  }

  async sendResetMail(email: string, user: UserEntity, callbackURL: string) {
    const resetJwt = this.jwtService.sign({ ...user }, { expiresIn: this.jwtExpiresIn });
    const resetLink = `${callbackURL}/${resetJwt}`;

    const mailData: MailEntity = {
      from: this.apiEmail,
      to: email,
      subject: 'Reset password',
      html: `<p>Dear ${email} for reset password please continue next steps. If you aren't reseting your password just ignore this letter.</p><p>Reset Link: ${resetLink}</p>`,
    }
    return await this.mailerService.sendMail(mailData)
  }
}

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<string>;
  approveRegister(token: string): Promise<{ user: Partial<IUserEntity>, token: string }>;
  deleteUser(id: string): Promise<boolean>;
  findUserById(id: string): Promise<IUserEntity>;
  findOneBy(data: Partial<IUserEntity>): Promise<IUserEntity>;
  signIn(userData: Partial<IUserEntity>): Promise<{ user: Partial<IUserEntity>, token: string }>
  update(userData: Partial<IUserEntity>, userId: string): Promise<Record<string, any>>;
  sendResetMail(email: string, user: IUserEntity, callbackURL: string): Promise<Record<string, unknown>>;
  resetPassword(data: ResetPasswordDto): Promise<Record<string, any>>;
}