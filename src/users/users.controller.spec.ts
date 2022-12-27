import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entity/users.entity';
import { UsersModule } from './users.module';
import * as uuid from 'uuid';
import { JwtAuthGuardMock, JOHN_USER_UUID, DEFAULT_USER_UUID } from '../test/utils/JwtAuthGuardMock';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

describe('User module', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let userService: UsersService;
  let user: User;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule, TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'test',
        entities: [User],
        synchronize: true,
      }),]
    }).overrideProvider(JwtAuthGuard)
      .useClass(JwtAuthGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    userService = app.get<UsersService>(UsersService)
  });

  afterEach(async () => {
    await userRepository.clear();
    await app.close();
  });

  describe('GET /users/:id', () => {
    it('should return not found status code if user doesnt exist', async () => {
      await request(app.getHttpServer())
        .get(`/users/vfgdfgdfgdfg`)
        .expect(404)
    })

    it('should return user info without email and password if not myself', async () => {
      user = await userRepository.save({
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
        createdAt: new Date()
      });
      const { password, email, ...expectedUser } = user;

      await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...expectedUser,
            createdAt: expect.any(String)
          })
        });
    });

    it('should return user info without password if myself', async () => {
      user = await userRepository.save({
        id: JOHN_USER_UUID,
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
        avatarUrl: null,
        createdAt: new Date()
      });

      const { password, ...expectedUser } = user

      await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...expectedUser,
            createdAt: expect.any(String)
          })
        });
    })
  });


  describe('POST /users', () => {
    it(`should create new user and return new user and created status code  if username doesn't exist.`, async () => {
      const newUser = {
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201)
        .expect(({ body }) => {
          const { password, ...expectedUser } = body
          expect(body).toEqual({
            ...expectedUser,
            id: expect.toSatisfy(uuid.validate),
            avatarUrl: null,
            createdAt: expect.any(String)
          })
          expect(new Date(body.createdAt)).toBeValidDate()
        })
    });

    it(`should return bad request status code if username already exist.`, async () => {
      userRepository = app.get<Repository<User>>(getRepositoryToken(User));

      user = await userRepository.save({
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
        createdAt: new Date()
      });

      const newUser = {
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400)
    });
  });


  describe('Patch /users:id', () => {
    it(`should update user if myself.`, async () => {
      const user = await userRepository.save({
        id: JOHN_USER_UUID,
        username: 'hanelle',
        password: '1234',
        name: 'Hanbyeol',
        email: 'hanella0911@gmail.com',
        createdAt: new Date()
      });

      const updateUser: UpdateUserDto = {
        password: '1111',
        email: 'hanella0911@gmail.co.kr',
        avatarUrl: 'a.jpg',
      };

      await request(app.getHttpServer())
        .patch(`/users/${JOHN_USER_UUID}`)
        .send(updateUser)
        .expect(200)
        .expect(({ body }) => {
          const { password, ...expectedUser } = body
          expect(body).toEqual({
            ...expectedUser,
            createdAt: user.createdAt.toISOString(),
          });
          expect(new Date(body.createdAt)).toBeValidDate()
          expect(body.password).not.toBe(updateUser.password)
        });
    });
  });

  it(`should return forbidden status code if not myself when user try to patch`, async () => {
    user = await userRepository.save({
      username: 'hanelle',
      password: '1234',
      name: 'Hanbyeol',
      email: 'hanella0911@gmail.com',
    });


    await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .expect(403)
  })
});