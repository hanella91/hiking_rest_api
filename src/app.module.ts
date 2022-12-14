import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trail } from './trails/entity/trail.entity';
import { TrailModule } from './trails/trails.module';
import { User } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { Event } from './events/entity/event.entity';
import { ReservationsModule } from './reservations/reservations.module';
import { Reservation } from './reservations/entity/reservation.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'hikers',
      entities: [Trail, User, Event, Reservation],
      synchronize: true,
    }), TrailModule, UsersModule, EventsModule, ReservationsModule, AuthModule
  ],
})

export class AppModule { }
