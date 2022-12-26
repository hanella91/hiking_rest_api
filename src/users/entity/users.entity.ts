import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}