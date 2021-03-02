import { Module } from "@nestjs/common"
import * as servicesModule from "integrations/domain/services"

@Module({
  providers: Object.values(servicesModule),
  exports: Object.values(servicesModule),
})
export class DomainModule {}
