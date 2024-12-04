import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('LiftLog', {
              prettyPrint: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: 'combined.log',
          level: 'info',
        }),
      ],
    }),
  });
  const port = process.env.PORT || 8082;

  app.enableCors({
    origin: 'https://liftlog-app.vercel.app/',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-type, Authorization',
    credentials: true,
  });

  await app.listen(port, () => console.log(`Backend running on port: ${port}`));
}

bootstrap();
