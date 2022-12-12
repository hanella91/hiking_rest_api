import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trail } from './entity/trail.entity';

@Injectable()
export class TrailsService {

    constructor(
        @InjectRepository(Trail)
        private trailsRepository: Repository<Trail>,
    ) { }

    async create(trail: Trail): Promise<void> {
        await this.trailsRepository.save(trail);
    }

    findAll(): Promise<Trail[]> {
        return this.trailsRepository.find();
    }

    findOne(id: number): Promise<Trail> {
        return this.trailsRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.trailsRepository.delete(id);
    }
}
