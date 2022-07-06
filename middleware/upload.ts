/**
 * Required External Moduels
 */
import util from "util"
import multer from "multer"
import { Request } from "express"

type DestinationCallback = (error: Error | null, destination: string) => void
type FilenameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null, "uploads")
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FilenameCallback
    ): void => {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage: storage }).array("uploads", 10);
const uploadMiddleware = util.promisify(upload)

export default uploadMiddleware
