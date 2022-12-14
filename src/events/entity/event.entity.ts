import { IsDate, IsIn, IsInt } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum ReservationTypeEnum {
  manual = 'manual',
  auto = 'auto'
}

type ReservationType = keyof typeof ReservationTypeEnum;
const ReservationTypes = Object.keys(ReservationTypeEnum);

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'trail_id' })
  trailId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'max_persons' })
  @IsInt()
  maxPersons: number;

  @Column()
  @IsDate()
  date: Date;

  @Column()
  description: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'reservation_type' })
  @IsIn(ReservationTypes)
  reservationType: ReservationType;

  @Column({ name: 'reservation_untill' })
  @IsDate()
  reservationUntill: Date;
}