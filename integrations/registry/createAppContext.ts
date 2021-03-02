import { NestFactory } from "@nestjs/core"
import { AppModule } from "integrations/registry/application.module"

export const createAppContext = () => {
  return NestFactory.createApplicationContext(AppModule, {
    logger: false,
  })
}
