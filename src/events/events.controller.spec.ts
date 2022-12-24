import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DEFAULT_USER_UUID, JwtAuthGuardMock } from '../test/utils/JwtAuthGuardMock';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsModule } from './events.module';
import * as uuid from 'uuid';
import request from 'supertest';
import { Event } from './entity/event.entity';
import { UpdateEventDto } from './dto/update-event.dto';


describe('Events module', () => {
  let app: INestApplication;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, EventsModule, TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'test',
        entities: [Event],
        synchronize: true,
      }),]
    }).overrideProvider(JwtAuthGuard)
      .useClass(JwtAuthGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    eventRepository = app.get<Repository<Event>>(getRepositoryToken(Event));
  });


  afterEach(async () => {
    await eventRepository.clear();
    await app.close();
  });

  describe('POST /events', () => {
    it('should create new event then return new event and created status code',
      async () => {
        const newEvent: CreateEventDto = {
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2022-12-30'),
        }

        await request(app.getHttpServer())
          .post('/events')
          .send(newEvent)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual({
              ...newEvent,
              userId: expect.toSatisfy(uuid.validate),
              id: expect.toSatisfy(uuid.validate),
              date: expect.any(String),
              reservationUntill: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            });
            expect(new Date(body.createdAt)).toBeValidDate()
            expect(new Date(body.updatedAt)).toBeValidDate()
          });
      });

    it('should return bad request status code when creating new event', async () => {
      const testData = [
        {
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2022-12-31'),
        }, {
          trailId: uuid.v4(),
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2022-12-31'),
        }, {
          trailId: 1234,
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 0,
          reservationType: 'auto',
          reservationUntill: '2022-12-31',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: '2022-12-31',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          reservationType: 'auto',
          reservationUntill: '2022-12-31',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationUntill: '2022-12-31',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'zzdfgsdafg',
          reservationUntill: '2022-12-31',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
        }, {
          trailId: uuid.v4(),
          description: 'test test',
          date: '2023-01-01',
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: null,
        }, {
          trailId: uuid.v4(),
          description: 1234,
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: '2022-12-31',
        },
        {
          trailId: uuid.v4(),
          description: '1234',
          date: '2023-01-01',
          maxPersons: 0,
          reservationType: 'auto',
          reservationUntill: '2022-12-31',
        },
      ]

      for (let payload of testData) {
        await request(app.getHttpServer())
          .post('/events')
          .send(payload)
          .expect(400)
      }
    });
  });

  describe('GET /events', () => {
    it('should return all events',
      async () => {
        const expectedEvents: Event[] = [];
        expectedEvents.push(await eventRepository.save({
          userId: uuid.v4(),
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2023-01-01'),
        }));

        expectedEvents.push(await eventRepository.save({
          userId: uuid.v4(),
          trailId: uuid.v4(),
          description: 'test2222',
          date: new Date('2023-01-01'),
          maxPersons: 5,
          reservationType: 'auto',
          reservationUntill: new Date('2023-01-01'),
        }));

        const compareFunction = (a: Event, b: Event) => {
          return a.id.localeCompare(b.id);
        };

        expectedEvents.sort(compareFunction);

        await request(app.getHttpServer())
          .get('/events')
          .expect(200)
          .expect(({ body }) => {
            body.sort(compareFunction);
            expect(body).toEqual(expectedEvents.map(event => ({
              ...event,
              createdAt: event.createdAt.toISOString(),
              updatedAt: event.updatedAt.toISOString(),
              date: event.date.toISOString(),
              reservationUntill: event.reservationUntill.toISOString()
            })));
          });
      });

    describe('GET /events/:id', () => {
      it(`should return a event info of given event id.`, async () => {
        const expectedEvent = await eventRepository.save({
          userId: uuid.v4(),
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2023-01-01'),
        });

        await request(app.getHttpServer())
          .get(`/events/${expectedEvent.id}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toEqual({
              ...expectedEvent,
              createdAt: expectedEvent.createdAt.toISOString(),
              updatedAt: expectedEvent.updatedAt.toISOString(),
              date: expectedEvent.date.toISOString(),
              reservationUntill: expectedEvent.reservationUntill.toISOString()
            });
          })
      });

      it(`not found status code if event id doesnt exist`, async () => {
        await request(app.getHttpServer())
          .get('/events/hhhh')
          .expect(404)
      });
    });

    describe('PATCH /events/:id', () => {
      const eventIdForTest = uuid.v4();
      it(`should update event if myself created this event.`, async () => {
        const event: Event = await eventRepository.save({
          id: eventIdForTest,
          userId: DEFAULT_USER_UUID,
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2023-01-01'),
        });
        const updateEvent: UpdateEventDto = {
          trailId: uuid.v4(),
          description: 'test test',
          maxPersons: 3,
          reservationType: 'manual',
          reservationUntill: new Date('2022-12-25')
        };

        await request(app.getHttpServer())
          .patch(`/events/${eventIdForTest}`)
          .send(updateEvent)
          .expect(200)
          .expect(({ body }) => {
            expect(body).toEqual({
              ...event,
              ...updateEvent,
              createdAt: event.createdAt.toISOString(),
              updatedAt: expect.any(String),
              date: event.date.toISOString(),
              reservationUntill: updateEvent.reservationUntill.toISOString(),
            });
            expect(new Date(body.createdAt)).toBeValidDate()
            expect(new Date(body.updatedAt)).toBeValidDate()
          });
      });

      it('should return forbidden status code if not myself when update', async () => {
        const newEvent: Event = await eventRepository.save({
          userId: uuid.v4(),
          trailId: uuid.v4(),
          description: 'test test',
          date: new Date('2023-01-01'),
          maxPersons: 10,
          reservationType: 'auto',
          reservationUntill: new Date('2023-01-01')
        })
        await request(app.getHttpServer())
          .patch(`/events/${newEvent.id}`)
          .expect(403)
      })
    });
  });

  describe('DELETE /events/:id', () => {

    it(`should delete event if myself created the event`, async () => {
      const eventIdForTest = uuid.v4();
      const event: Event = await eventRepository.save({
        id: eventIdForTest,
        userId: DEFAULT_USER_UUID,
        trailId: uuid.v4(),
        description: 'test test',
        date: new Date('2023-01-01'),
        maxPersons: 10,
        reservationType: 'auto',
        reservationUntill: new Date('2023-01-01')
      });

      await request(app.getHttpServer())
        .delete(`/events/${event.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.affected).toEqual(1)
        })
    });

    it(`should return forbidden status if myself created the event`, async () => {
      const event: Event = await eventRepository.save({
        userId: uuid.v4(),
        trailId: uuid.v4(),
        description: 'test test',
        date: new Date('2023-01-01'),
        maxPersons: 10,
        reservationType: 'auto',
        reservationUntill: new Date('2023-01-01')
      });

      await request(app.getHttpServer())
        .delete(`/events/${event.id}`)
        .expect(403)
    });

    it(`should return not found status if event id doesn't exist when delete`, async () => {
      await eventRepository.save({
        userId: uuid.v4(),
        trailId: uuid.v4(),
        description: 'test test',
        date: new Date('2023-01-01'),
        maxPersons: 10,
        reservationType: 'auto',
        reservationUntill: new Date('2023-01-01')
      });

      await request(app.getHttpServer())
        .delete(`/trails/adsfasdf`)
        .expect(404)
    });
  });
});