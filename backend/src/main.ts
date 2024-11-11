import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8082;

  app.enableCors({
    origin: 'https://liftlog-app.vercel.app/',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-type, Authorization',
    credentials: true
  });

  await app.listen(port, () => console.log(`Backend running on port: ${port}`));
}

bootstrap(); 
