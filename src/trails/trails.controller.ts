import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { throws } from 'assert';
import { DeleteResult } from 'typeorm';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { Trail } from './entity/trail.entity';
import { TrailsService } from './trails.service';

@Controller('trails')
export class TrailsController {
    constructor(private trailsService: TrailsService) { }

    @Post()
    async create(@Request() req: any, @Body() trail: CreateTrailDto): Promise<Trail> {
        const userId = req.user.userId
        if (!userId) {
            throw new HttpException(`Please Log in First.`, HttpStatus.UNAUTHORIZED);
        }
        return await this.trailsService.create(userId, trail);


    }

    @Public()
    @Get()
    async findAll(): Promise<Trail[]> {
        return this.trailsService.findAll();
    }

    @Public()
    @Get(':id')
    async findOneById(@Param('id') trailId: string): Promise<Trail | undefined> {
        const existedTrail = await this.trailsService.findOneById(trailId);
        if (null === existedTrail) {
            throw new HttpException(`trail not found for id: ${trailId}.`, HttpStatus.NOT_FOUND);
        }
        
        return existedTrail
    }

    @Patch(':id')
    async update(@Request() req: any, @Param('id') trailId: string, @Body() trail: UpdateTrailDto): Promise<Trail> {
        return await this.trailsService.update(req.user.userId, trailId, trail);
    }

    @Delete(':id')
    async remove(@Request() req: any, @Param('id') id: string): Promise<DeleteResult> {
        return await this.trailsService.remove(req.user.userId, id);

    }
}

