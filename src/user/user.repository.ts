import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
  ) { }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepo.save(userData);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepo.delete({ id });
  }

  async findOneBy(data: Partial<UserEntity>) {
    return await this.userRepo.findOneBy(data);
  }

  async update(id: string, data: Partial<UserEntity>) {
    return await this.userRepo.save({ id, ...data });
  }
}

// export interface IUserRepository {
//   create(): Promise<UserEntity>;
//   delete(): boolean;
//   update(): boolean;
//   login(): Record<string, unknown>;
// }