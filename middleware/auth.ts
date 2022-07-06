/**
 * Required External Modules
 */

import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { RequestHandler } from "express"
import { PrismaClient } from "@prisma/client"

dotenv.config()

const prisma = new PrismaClient()

export const auth: RequestHandler = async (req, res, next) => {
    const secret = process.env.JWT_SECRET
    
    interface JwtPayload {
        id: number,
    } 
    
    try {
        const bearerToken = req.header("Authorization")
        if (bearerToken) {
            const token = bearerToken.replace("Bearer ", "")
            const { id } = jwt.verify(token, secret as string) as JwtPayload
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    tokens: true,
                }
            })
            
            let tokens: string[] = []

            if (user) {
                user.tokens.forEach(item => {
                    if (item.token === token) {
                        tokens.push(item.token)
                    }
                })
            }

            if (tokens.includes(token)) {
                next()
            } else {
                throw new Error()
            }
        }
    } catch(e: any) {
        res.status(400).send({
            message: "Please authenticate."
        })
    }
}
