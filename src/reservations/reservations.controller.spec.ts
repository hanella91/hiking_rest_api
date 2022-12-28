import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsModule } from '../events/events.module';
import { DEFAULT_USER_UUID, JwtAuthGuardMock } from '../test/utils/JwtAuthGuardMock';
import { Reservation } from './entity/reservation.entity';
import { ReservationsModule } from './reservations.module';
import { Event } from '../events/entity/event.entity';
import * as uuid from 'uuid';
import request from 'supertest';
import { UpdateReservationDto } from './dto/update-reservation.dto';

describe('Reservation module', () => {
  let app: INestApplication;
  let reservationRepository: Repository<Reservation>;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, EventsModule, ReservationsModule, TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'test',
        entities: [Event, Reservation],
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
  });

  afterEach(async () => {
    await reservationRepository.clear();
    await eventRepository.clear();
    await app.close();
  });

  describe('POST /events/:id/reservations', () => {
    it('should create new reservation for givien event id and return created status code',
      async () => {
        const newEvent: Event = {
          id: uuid.v4(),
          trailId: uuid.v4(),
          userId: DEFAULT_USER_UUID,
          description: 'test test',
          date: new Date('2023-01-01'),
          maxReservations: 10,
          reservationType: 'automatic',
          reservationUntill: new Date('2022-12-30'),
          createdAt: new Date('2022-12-26'),
          updatedAt: new Date('2022-12-26')
        };

        const createdEvent: Event = await eventRepository.save(newEvent);

        await request(app.getHttpServer())
          .post(`/events/${createdEvent.id}/reservations`)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual({
              eventId: expect.toSatisfy(uuid.validate),
              userId: expect.toSatisfy(uuid.validate),
              updatedAt: expect.any(String),
              queue: null,
              id: expect.toSatisfy(uuid.validate),
              createdAt: expect.any(String),
              status: expect.any(String)
            });
          });
      });
  });

  describe('PATCH /events/:eventId/reservations/:reservationId', () => {
    it('should change status of resrvation and return 200 status code when user is the creator of Event.',
      async () => {
        const newEvent: Event = {
          id: uuid.v4(),
          trailId: uuid.v4(),
          userId: DEFAULT_USER_UUID,
          description: 'test test',
          date: new Date('2023-01-01'),
          maxReservations: 10,
          reservationType: 'automatic',
          reservationUntill: new Date('2022-12-30'),
          createdAt: new Date('2022-12-26'),
          updatedAt: new Date('2022-12-26')
        };

        const createdEvent: Event = await eventRepository.save(newEvent);
        const newReservation: Reservation = {
          id: uuid.v4(),
          eventId: createdEvent.id,
          userId: DEFAULT_USER_UUID,
          createdAt: new Date('2022-12-27'),
          updatedAt: new Date('2022-12-27'),
          status: 'requested',
          queue: null
        }

        const createdReservation = await reservationRepository.save(newReservation)

        const updatedReservation: UpdateReservationDto = {
          status: 'accepted'
        };

        await request(app.getHttpServer())
          .patch(`/events/${createdEvent.id}/reservations/${createdReservation.id}`)
          .send(updatedReservation)
          .expect(200)
      });

      //should write test about bad reqeust / forbidden error response status.





  });





})