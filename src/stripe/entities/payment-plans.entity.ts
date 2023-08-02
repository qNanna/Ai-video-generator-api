import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'payment-plan' })
export class PaymentPlanEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column('boolean', { default: false })
  root: boolean;
}