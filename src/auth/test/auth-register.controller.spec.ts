import { getRepositoryToken } from '@mikro-orm/nestjs';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { mockedUser } from './__mocks__/user.mock';

describe('AuthController: Register', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(mockedUser),
            findOne: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  test('GIVEN valid data THEN it responds with correct body and statusCode', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: mockedUser.email,
        username: mockedUser.username,
        password: 'strongPassword',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          status: 'OK',
          message: 'Account has been created.',
          user: {
            displayName: mockedUser.displayName,
            username: mockedUser.username,
            userId: expect.stringMatching(/[\w-]{10}/g),
            token: expect.any(String),
            email: mockedUser.email,
          },
        });
    }));

  test('GIVEN only username THEN it responds with 400', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: mockedUser.username })
      .expect(400));

  test('GIVEN only email THEN it responds with 400', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: mockedUser.email })
      .expect(400));

  test('GIVEN only password THEN it responds with 400', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ password: mockedUser.password })
      .expect(400));

  test('GIVEN incomplete data THEN it responds with 400', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: mockedUser.email, password: mockedUser.password })
      .expect(400));

  test('GIVEN invalid data THEN it responds with 400 and errors', async () =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'FORBID UPPERCASE and spaces',
        email: 'invalid.email.com',
        password: 'short',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'username must be a lowercase string',
          'username must contain only letters and numbers',
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      }));
});