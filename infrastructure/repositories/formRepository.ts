import { IFormRepository } from "domain/repositories"
import { File, IncomingForm } from "formidable"
import { NextApiRequest } from "next"
import { tmpdir } from "os"

export class FormRepository implements IFormRepository {
  getFiles(req: NextApiRequest) {
    return new Promise<File[]>((resolve, reject) => {
      const form = new IncomingForm()
      form.uploadDir = tmpdir()
      form.keepExtensions = true
      form.parse(req, (err, _, files) => {
        if (err) {
          return reject(err)
        }
        const names = Object.keys(files)
        if (names.length === 0) {
          return reject(new Error("no files"))
        }
        const [name] = names
        const fileOrFiles = files[name]
        if (Array.isArray(fileOrFiles)) {
          return resolve(fileOrFiles)
        }
        resolve([fileOrFiles])
      })
    })
  }
}
