import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3333);
  });
  afterAll(async () => {
    await app.close();
  });

  it.todo('/ (GET)');
});
