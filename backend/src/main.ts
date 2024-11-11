import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8082;
  await app.listen(port);

  console.log(`Backend running on port: ${port}`);
  
  return app; // Add this line to export the app instance
}

export default bootstrap(); // Ensure you export the function call as the default
