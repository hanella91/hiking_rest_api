import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTrailDto } from './dto/create-trail.dto';
import { Trail } from './entity/trail.entity';
import { TrailsService } from './trails.service';

@Controller('trails')
export class TrailsController {
    constructor(private trailsService: TrailsService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() trail: CreateTrailDto) {
        this.trailsService.create(trail);
    }

    @Get()
    async findAll(): Promise<Trail[]> {
        return this.trailsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Trail> {
        return this.trailsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() trail: CreateTrailDto) {
        const existedTrail = this.findOne(id);
        if (existedTrail) {
            this.trailsService.update(id, trail);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        this.trailsService.remove(id);
    }
}

