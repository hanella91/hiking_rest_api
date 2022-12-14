import { IsIn } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'updated_at' })
  updatedAt: Date | null;

  @Column({ default: "requested" })
  @IsIn(StatusTypes)
  status: StatusType;

  @Column({ nullable: true })
  queue: number | null;
}