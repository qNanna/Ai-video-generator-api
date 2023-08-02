import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { VideoEntity } from '../../videos/entities/video.entity';

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column({ type: "varchar", length: 300 })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  stripeId: string;

  @Column({ nullable: true })
  paidSeconds: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  // RELATIONS
  @OneToMany(() => VideoEntity, (table) => table.user)
  video: VideoEntity[];
}

export interface IUserEntity {
  id?: string;
  userName: string;
  password: string;
  isActive?: boolean;
  stripeId?: string;
  paidSeconds?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // RELATIONS
  video?: VideoEntity[];
}