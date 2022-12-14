import { IsIn, IsInt, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

enum difficultyTypeEnum {
    easiest = 'easiest',    //하
    moderate = 'moderate',  //중
    strenous = 'strenous',  //상
}

type difficultyType = keyof typeof difficultyTypeEnum;
const difficultyTypes = Object.keys(difficultyTypeEnum);

@Entity()
export class Trail {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: 'trail_name' })
    @IsString()
    trailName: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ nullable: true })
    @IsInt()
    duration: number;

    @Column()
    @IsString()
    @IsIn(difficultyTypes)
    difficulty: difficultyType;

    @Column({ name: 'start_point' })
    @IsString()
    startPoint: string;

    @Column({ name: 'end_point' })
    @IsString()
    endPoint: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ nullable: true, name: 'updated_at' })
    updatedAt: Date;

}

