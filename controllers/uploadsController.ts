/**
 * Required External Modules
 */

import uploadMiddleware from "../middleware/upload"
import { Request, Response } from "express"

export const multipleUpload = async (req: Request, res: Response) => {
    try {
        await uploadMiddleware(req, res)
        if (req.files) { 
            if (req.files.length <= 0) {
                res.status(400).send({
                    message: "You should have at least 1 file."
                })
            }
            res.status(200).send({
                message: "Files have been uploaded."
            })
        }
    } catch (e: any) {
        if (e.code === "LIMIT_UNEXPECTED_FILE") {
            res.status(400).send({
                message: "Too many files to upload."
            })
        }
    }
}