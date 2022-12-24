import { IsDecimal, IsIn, IsInt, IsNumber, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum DifficultyTypeEnum {
    easy = 'easy',    //하
    moderate = 'moderate',  //중
    hard = 'hard',  //상
}

type DifficultyType = keyof typeof DifficultyTypeEnum;
const difficultyTypes = Object.keys(DifficultyTypeEnum);

@Entity()
export class Trail {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'mountain_name' })
    @IsString()
    mountainName: string;

    @Column({ name: 'trail_name' })
    @IsString()
    trailName: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    @IsNumber()
    distance: number;

    @Column({ nullable: true })
    @IsNumber()
    duration: number;

    @Column()
    @IsString()
    @IsIn(difficultyTypes)
    difficulty: DifficultyType;

    @Column({ name: 'start_point' })
    @IsString()
    startPoint: string;

    @Column({ name: 'end_point' })
    @IsString()
    endPoint: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ nullable: true, name: 'updated_at' })
    updatedAt: Date;
}

