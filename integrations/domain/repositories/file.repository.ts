import { FileEntity } from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

/**
 * ファイル・リポジトリ
 */
export abstract class FileRepository {
  /**
   * @param input
   * @returns
   */
  abstract find(id: Id): Promise<FileEntity | null>

  /**
   * @param input
   */
  abstract upsert(fileEntity: FileEntity): Promise<null>
}
