import { IsIn } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

enum StatusTypeEnum {
  requested = 'requested',
  accepted = 'accepted',
  denied = 'denied',
  canceled = 'canceled'
}

type StatusType = keyof typeof StatusTypeEnum;
const StatusTypes = Object.keys(StatusTypeEnum);

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  updatedAt: Date | null;

  @Column({ default: "requested" })
  @IsIn(StatusTypes)
  status: StatusType;

  @Column({ nullable: true, default: null })
  queue: number | null;
}