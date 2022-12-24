import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DEFAULT_USER_UUID, JwtAuthGuardMock } from '../test/utils/JwtAuthGuardMock';
import * as uuid from 'uuid';
import request from 'supertest';
import { Reservation } from './entity/reservation.entity';
import { ReservationsModule } from './reservations.module';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { Event } from '../events/entity/event.entity';

describe('Reservation module', () => {
  let app: INestApplication;
  let reservationRepository: Repository<Reservation>;
  let eventRepository: Repository<Event>;
  let originEvent: Event = null;
  let testEvent: Event = null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ReservationsModule, TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'test',
        entities: [Reservation, Event],
        synchronize: true,
        
      }),]
    }).overrideProvider(JwtAuthGuard)
      .useClass(JwtAuthGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    reservationRepository = app.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    eventRepository = app.get<Repository<Event>>(getRepositoryToken(Event));

    testEvent = {
      id: 'bfd15ce0-75da-4602-a31f-79e64dbbde65',
      userId: uuid.v4(),
      trailId: uuid.v4(),
      date: new Date('2023-01-01'),
      description: 'Test Event',
      maxPersons: 8,
      reservationType: 'manual',
      reservationUntill: new Date('2023-01-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await eventRepository.save(testEvent);
  });

  afterEach(async () => {
    await reservationRepository.clear();
    await eventRepository.clear();
    await app.close();
  });

  describe('POST /events/:id/reservations', () => {
    it(`should post new reservation on the eventId`, async () => {
      const id = 'bfd15ce0-75da-4602-a31f-79e64dbbde65';
      const event: Event = await eventRepository.findOneBy({ id });
      console.log(event);
      await request(app.getHttpServer)
        .post(`/events/${event.id}/reservations`)
        .send(event);
    });
  })
})
