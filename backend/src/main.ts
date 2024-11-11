import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT;  // Dynamically assign the port
  await app.listen(port || 8082);

  console.log(`Backend running on port: ${port}`);  // Log the correct port
}
bootstrap();