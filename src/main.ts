// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFirebase } from './shared/libs/firebase-auth';
import { swaggerLoader } from './shared/swagger';
import { PrismaService } from './shared/modules/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  swaggerLoader(app);

  app.enableCors({
    origin: configService.get('*'),
    credentials: true,
  });

  initFirebase();

  await app.listen(4000);
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${process.env.PORT ?? 4000}/api/`);
}
bootstrap();
