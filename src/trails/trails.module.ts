import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trail } from './entity/trail.entity';
import { TrailsController } from './trails.controller';
import { TrailsService } from './trails.service';

@Module({
    imports: [TypeOrmModule.forFeature([Trail])],
    providers: [TrailsService],
    controllers: [TrailsController],
    exports: [TypeOrmModule],
})

export class TrailModule { }