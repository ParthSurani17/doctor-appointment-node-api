import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from './swagger-config-data';

export const swaggerLoader = function (app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const swaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document, swaggerCustomOptions);
};
