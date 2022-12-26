import { IsDate, IsIn, IsInt, isString, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

enum ReservationTypeEnum {
  manual = 'manual',
  automatic = 'automatic'
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

  @Column({ name: 'max_reservation', })
  @IsInt()
  maxReservations: number;

  @Column()
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

  @Column({ name: 'reservation_untill' })
  @IsString()
  reservationUntill: Date;
}