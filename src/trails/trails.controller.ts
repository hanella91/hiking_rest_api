import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Trail } from './entity/trail.entity';
import { TrailsService } from './trails.service';

@Controller('trails')
export class TrailsController {
    constructor(private trailsService: TrailsService) { }

    @Post()
    async create(@Body() trail: Trail) {
        this.trailsService.create(trail);
    }

    @Get()
    async findAll(): Promise<Trail[]> {
        return this.trailsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Trail> {
        return this.trailsService.findOne(id);
    }

    @Put

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        this.trailsService.remove(id);
    }
}

