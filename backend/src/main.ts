import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function bootstrap(): Promise<INestApplication> {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await app.init(); // Ensure app is initialized but not listening directly
    cachedApp = app;
  }
  return cachedApp;
}

export default bootstrap;
