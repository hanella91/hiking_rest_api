import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DifficultyTypeEnum, Trail } from './entity/trail.entity';
import { TrailModule } from './trails.module';
import request from 'supertest';
import { JwtAuthGuardMock, JOHN_USER_UUID, DEFAULT_USER_UUID } from '../test/utils/JwtAuthGuardMock';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { CreateTrailDto } from './dto/create-trail.dto';

describe('Trails module', () => {
  let app: INestApplication;
  let trailRepository: Repository<Trail>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, TrailModule, TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'test',
        entities: [Trail],
        synchronize: true,
      }),]
    }).overrideProvider(JwtAuthGuard)
      .useClass(JwtAuthGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    trailRepository = app.get<Repository<Trail>>(getRepositoryToken(Trail));
  });

  afterEach(async () => {
    await trailRepository.clear();
    await app.close();
  });

  describe('POST /trails', () => {
    it(`should create new trail then return new trail and created statatus code`,
      async () => {
        const newTrail = {
          trailName: "테스트",
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        };

        await request(app.getHttpServer())
          .post('/trails')
          .send(newTrail)
          .expect(201)
          .expect(({ body }) => {
            expect(body).toEqual({
              ...newTrail,
              userId: expect.toSatisfy(uuid.validate),
              id: expect.toSatisfy(uuid.validate),
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            });
            expect(new Date(body.createdAt)).toBeValidDate()
            expect(new Date(body.updatedAt)).toBeValidDate()
          })
      });

    it(`should return bad request status code when creating new trail`, async () => {
      const testData = [
        {
          trailName: "테스트",
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
        },
        {
          trailName: "테스트",
          duration: 60,
          difficulty: "easiest",
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          duration: 60,
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          duration: 60,
          difficulty: "gfgfgdfg",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          duration: '60',
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          trailName: 50,
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          duration: 60,
          difficulty: "easiest",
          startPoint: 50,
          endPoint: "금정산입구"
        },
        {
          trailName: "테스트",
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: 50
        }
      ]

      for (const payload in testData) {
        await request(app.getHttpServer())
          .post('/trails')
          .send(payload)
          .expect(400)
      }
    })
  });

  describe('GET /trails', () => {
    it(`should return all trails`,
      async () => {
        const expectedTrails: Trail[] = [];

        expectedTrails.push(await trailRepository.save({
          userId: uuid.v4(),
          trailName: "테스트1",
          duration: 60,
          difficulty: "easiest",
          startPoint: "금정산입구",
          endPoint: "금정산입구",
        }));

        expectedTrails.push(await trailRepository.save({
          userId: uuid.v4(),
          trailName: "테스트2",
          duration: 100,
          difficulty: "moderate",
          startPoint: "금련산역",
          endPoint: "금련산정상",
        }));

        // sort ASC by id
        const compareFunction = (a: Trail, b: Trail) => {
          return a.id.localeCompare(b.id);
        };

        expectedTrails.sort(compareFunction);

        await request(app.getHttpServer())
          .get('/trails')
          .expect(200)
          .expect(({ body }) => {
            body.sort(compareFunction);
            expect(body).toEqual(expectedTrails.map(trail => ({
              ...trail,
              createdAt: trail.createdAt.toISOString(),
              updatedAt: trail.updatedAt.toISOString(),
            })))
          });
      })
  });

  describe('GET /trails/:id', () => {
    it(`should return a trail info of given trail id.`, async () => {
      const expectedTrail = await trailRepository.save({
        userId: uuid.v4(),
        trailName: "테스트1",
        duration: 60,
        difficulty: "easiest",
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });

      await request(app.getHttpServer())
        .get(`/trails/${expectedTrail.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...expectedTrail,
            createdAt: expectedTrail.createdAt.toISOString(),
            updatedAt: expectedTrail.updatedAt.toISOString(),
          });
        })
    });

    it(`not found status code if trail id doesnt exist`, async () => {
      await request(app.getHttpServer())
        .get('/trails/hhhh')
        .expect(404)
    });

  });

  describe('PATCH /trails/:id', () => {
    const trailIdforUpdate = uuid.v4();
    it(`should update trail if myself created this trail.`, async () => {
      const trail: Trail = await trailRepository.save({
        userId: DEFAULT_USER_UUID,
        id: trailIdforUpdate,
        trailName: "테스트1",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });
      const updateTrail: UpdateTrailDto = {
        trailName: "트레일 수정 테스트",
        difficulty: DifficultyTypeEnum.moderate,
        startPoint: "금정산등산로입구",
        endPoint: "화명역",
      };

      await request(app.getHttpServer())
        .patch(`/trails/${trailIdforUpdate}`)
        .send(updateTrail)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...trail,
            ...updateTrail,
            createdAt: trail.createdAt.toISOString(),
            updatedAt: expect.any(String)
          });
          expect(new Date(body.updatedAt)).toBeValidDate();
        });
    });

    it(` should return not found status code if trail id doesnt exist`, async () => {
      const trail: Trail = await trailRepository.save({
        userId: DEFAULT_USER_UUID,
        id: trailIdforUpdate,
        trailName: "테스트1",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });
      const updateTrail: UpdateTrailDto = {
        trailName: "트레일 수정 테스트",
        difficulty: DifficultyTypeEnum.moderate,
        startPoint: "금정산등산로입구",
        endPoint: "화명역",
      };

      await request(app.getHttpServer())
        .patch('/trails/hhhh')
        .send(updateTrail)
        .expect(404)
    });

    it(`should return forbidden status code if not myself`, async () => {
      const trail: Trail = await trailRepository.save({
        userId: uuid.v4(),
        trailName: "테스트1",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });
      await request(app.getHttpServer())
        .patch(`/trails/${trail.id}`)
        .expect(403)
    });
  });

  describe(`DELETE /users/:id`, () => {
    it(`should delete trail if myself created the trail`, async () => {
      const trailIdforDelete = uuid.v4();
      const trail: Trail = await trailRepository.save({
        userId: DEFAULT_USER_UUID,
        id: trailIdforDelete,
        trailName: "테스트",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });

      await request(app.getHttpServer())
        .delete(`/trails/${trail.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.affected).toEqual(1)
        })
    });

    it(`should return forbidden status if myself created the trail`, async () => {
      const trailIdforDelete = uuid.v4();
      const trail: Trail = await trailRepository.save({
        userId: uuid.v4(),
        id: trailIdforDelete,
        trailName: "테스트",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });

      await request(app.getHttpServer())
        .delete(`/trails/${trail.id}`)
        .expect(403)
    });

    it(`should return not found status if trail id doesn't exist.`, async () => {
      const trailIdforDelete = uuid.v4();
      await trailRepository.save({
        userId: uuid.v4(),
        id: trailIdforDelete,
        trailName: "테스트",
        duration: 60,
        difficulty: DifficultyTypeEnum.easiest,
        startPoint: "금정산입구",
        endPoint: "금정산입구",
      });

      await request(app.getHttpServer())
        .delete(`/trails/adsfasdf`)
        .expect(404)
    });


  })


});