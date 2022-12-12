import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trail } from './trails/entity/trail.entity';
import { TrailModule } from './trails/trails.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'hikers',
      entities: [Trail],
      synchronize: true,
    }), TrailModule
  ],

})

export class AppModule { }
