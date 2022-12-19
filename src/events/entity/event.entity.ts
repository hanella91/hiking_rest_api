import { IsDate, IsIn, IsInt, isString, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

enum ReservationTypeEnum {
  manual = 'manual',
  auto = 'auto'
}

type ReservationType = keyof typeof ReservationTypeEnum;
const ReservationTypes = Object.keys(ReservationTypeEnum);

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  id: string;

  @Column({ name: 'trail_id' })
  @IsString()
  trailId: string;

  @Column({ name: 'user_id' })
  @IsString()
  userId: string;

  @Column({ name: 'max_persons', })
  @IsInt()
  maxPersons: number;

  @Column({ type: Date })
  @IsString()
  date: Date;

  @Column()
  @IsString()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, name: 'updated_at' })
  @IsDate()
  updatedAt: Date;

  @Column({ name: 'reservation_type' })
  @IsIn(ReservationTypes)
  reservationType: ReservationType;

  @Column({ name: 'reservation_untill', type: Date })
  @IsString()
  reservationUntill: Date;
}