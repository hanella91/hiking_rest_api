import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { Trail } from './entity/trail.entity';


@Injectable()
export class TrailsService {

    constructor(
        @InjectRepository(Trail)
        private trailsRepository: Repository<Trail>,
    ) { }

    async create(userId: string, trail: CreateTrailDto): Promise<Trail> {
        return await this.trailsRepository.save({
            ...trail,
            userId,
        });
    }

    async findAll(): Promise<Trail[]> {
        return await this.trailsRepository.find();
    }

    async findOneById(trailId: string): Promise<Trail | undefined> {
        return await this.trailsRepository.findOneBy({ id: trailId });
    }

    async update(userId: string, id: string, updateTrail: UpdateTrailDto): Promise<Trail> {
        const existingTrail = await this.trailsRepository.findOneBy({ id });

        if (null === existingTrail) {
            throw new HttpException(`trail not found for id : ${id}`, HttpStatus.NOT_FOUND);
        }

        if (existingTrail.userId !== userId) {
            throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
        }

        return await this.trailsRepository.save({
            ...existingTrail,
            ...updateTrail,
            id,
        });
    }

    async remove(userId: string, id: string): Promise<DeleteResult> {
        const existingTrail: Trail = await this.trailsRepository.findOneBy({ id });
        if (null === existingTrail) {
            throw new HttpException(`trail not found for id : ${id}`, HttpStatus.NOT_FOUND);
        }

        if (existingTrail.userId !== userId) {
            throw new HttpException(`You don't have permission to access this resource.`, HttpStatus.FORBIDDEN);
        }
        return await this.trailsRepository.delete(id);
    }
}
