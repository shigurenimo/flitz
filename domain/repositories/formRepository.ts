import { File } from "formidable"
import type { NextApiRequest } from "next"

export interface IFormRepository {
  getFiles(req: NextApiRequest): Promise<File[]>
}
