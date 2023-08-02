import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: "video" })
export class VideoEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column()
  question: string;

  @Column()
  scriptText: string;

  @Column()
  accent: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ unique: true })
  videoId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  duration: string;

  @Column()
  durationFactor: number;

  @Column({ nullable: true })
  bucketKey: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  visibility: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  // FOREIGN KEYS
  @ManyToOne(() => UserEntity, (table) => table.video)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
  @Column('bigint')
  userId: string;
}

export interface IVideoEntity {
  id?: string;
  question: string;
  scriptText: string;
  accent: string;
  completed?: boolean;
  videoId: string;
  title: string;
  duration?: string;
  durationFactor: number;
  bucketKey?: string;
  description?: string;
  visibility?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserEntity;
  userId: string;
}