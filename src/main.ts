import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const envMode = process.env.NODE_ENV;

  const config = new DocumentBuilder()
    .setTitle('Fun App API')
    .setDescription('FunApp is an Egyptian app that has a simple sign up process. FunApp only accepts sign ups from phones located in Egypt.')
    .addServer(`http://localhost:${port}`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(`Server running on ${envMode} mode`);
  Logger.log(`Server listening on http://localhost:${port} `);
}
bootstrap();
