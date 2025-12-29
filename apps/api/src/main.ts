import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Project Manager API')
    .setDescription('API para gestión de proyectos de agencias')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación')
    .addTag('users', 'Usuarios')
    .addTag('clients', 'Clientes')
    .addTag('projects', 'Proyectos')
    .addTag('subscriptions', 'Suscripciones')
    .addTag('payments', 'Pagos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Application is running on: http://localhost:4000`);
  console.log(`Swagger docs available at: http://localhost:4000/api/docs`);
}
bootstrap();
