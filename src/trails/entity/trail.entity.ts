import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    trail_name: string;

    @Column()
    user_id: string;

    @Column({ nullable: true })
    duration: string;

    @Column()
    difficulty: string;

    @Column()
    start_point: string;

    @Column()
    end_point: string;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

}