import { Injectable } from "@nestjs/common"
import { SessionContext } from "blitz"
import { SessionAdapter } from "integrations/infrastructure"

@Injectable()
export class RevokeSessionService {
  constructor(private sessionRepository: SessionAdapter) {}

  async call(input: { session: SessionContext }) {
    try {
      await this.sessionRepository.revokeSession(input.session)

      return null
    } catch (error) {
      return Error()
    }
  }
}
