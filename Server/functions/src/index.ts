import "reflect-metadata";
import * as functions from "firebase-functions";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import express from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

const expressApp = express();
let nestApp: any;

async function createNestApp() {
  if (nestApp) return nestApp;

  nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Global exception filter
  nestApp.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor
  nestApp.useGlobalInterceptors(new ResponseInterceptor());

  // Global validation pipe
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle("LeagueMatch API")
    .setDescription("League of Legends matching game API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      "firebaseAuth",
    )
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  document.servers = [
    {
      url: "/league-match-app/us-central1/api",
      description: "Firebase Functions Emulator",
    },
  ];
  SwaggerModule.setup("docs", nestApp, document);

  await nestApp.init();
  return nestApp;
}

export const api = functions.https.onRequest(async (req, res) => {
  if (!nestApp) {
    await createNestApp();
  }
  expressApp(req, res);
});
