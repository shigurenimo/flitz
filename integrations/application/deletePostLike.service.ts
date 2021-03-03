import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import { Id, LikeRepository } from "integrations/domain"

@Injectable()
export class DeletePostLikeService {
  constructor(private likeRepository: LikeRepository) {}

  async call(input: { userId: Id; postId: Id }) {
    const likeEntity = await this.likeRepository.find(
      input.userId,
      input.postId
    )

    if (likeEntity === null) {
      throw new NotFoundError()
    }

    await this.likeRepository.delete(likeEntity)
  }
}
