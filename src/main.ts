import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';
const detail = require('../package.json');

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(detail.name)
    .setDescription(detail.description)
    .setVersion(detail.version)
    .addTag(detail.tag)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('listen port:', port);
  await app.listen(port);
}
bootstrap();
