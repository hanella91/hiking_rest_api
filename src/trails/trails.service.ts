import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { Trail } from './entity/trail.entity';
import * as uuid from 'uuid';

@Injectable()
export class TrailsService {

    constructor(
        @InjectRepository(Trail)
        private trailsRepository: Repository<Trail>,
    ) { }

    async create(trail: CreateTrailDto): Promise<void> {
        await this.trailsRepository.save({
            ...trail,
            userId: uuid.v4(),
            createdAt: new Date()
        });
    }

    findAll(): Promise<Trail[]> {
        return this.trailsRepository.find();
    }

    findOne(id: string): Promise<Trail> {
        return this.trailsRepository.findOneBy({ id });
    }

    async update(id: string, trail: UpdateTrailDto): Promise<void> {
        await
            this.trailsRepository
                .createQueryBuilder()
                .update(UpdateTrailDto)
                .set({
                    trailName: trail.trailName,
                    duration: trail.duration,
                    difficulty: trail.difficulty,
                    startPoint: trail.startPoint,
                    endPoint: trail.endPoint
                })
                .where("id = :id", { id })
                .execute();
    }

    async remove(id: number): Promise<void> {
        await this.trailsRepository.delete(id);
    }
}
