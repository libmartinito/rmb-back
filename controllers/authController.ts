/**
 * Required External Modules
 */
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";

dotenv.config()

const prisma = new PrismaClient();

/**
 * Controllers for Authentication
 */

// A controller that registers a new user
export const register = async (req: Request, res: Response) => {
    const payload = req.body
    const secret = process.env.JWT_SECRET

    // Check if user already exists
    const oldUser = await prisma.user.findUnique({
        where: {
            email: payload.email,
        }
    })

    if (oldUser) {
        res.status(400).send({
            message: "User already exists. Please login." 
        })
    }
    
    // Hash password
    payload.password = await bcrypt.hash(payload.password,8)
    
    // Try creating user and providing an authentication token 
    try {
        // Create user
        const user = await prisma.user.create({ data: payload })

        // Provide token
        const token = jwt.sign({ id: user.id }, secret as string)
        
        // Save token
        await prisma.token.create({
            data: {
                userId: user.id,
                token: token,
            }
        }) 
        
        // If ok, send created user and token
        res.status(200).send({
            user: {
                id: user.id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                department: user.department,
                balance: user.balance
            },
            token: token,
        })
    } catch(e: any) {
        // If error is thrown, send error message
        res.status(500).send({
            message: e.message
        })
    } finally {
        // Close database connection
        prisma.$disconnect()
    }
}

// A controller that logins an existing user
export const login = async (req: Request, res: Response) => {
    const payload = req.body
    const secret = process.env.JWT_SECRET
    
    // Try logging in and providing an authentication token
    try {
        // Check if email exists in database
        const user = await prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        })
        
        if (!user) {
            // Return an error message if no email found
            res.status(400).send({
                message: "User does not exist. Please register."
            })
        }
        
        // Check if password matches email
        let isMatch = false

        if (user) {
            const password = payload.password
            const userPassword = user.password
            isMatch = await bcrypt.compare(password, userPassword)
        }

        if (isMatch) {
            if (user) {
                // Provide a token if password matches
                const token = jwt.sign({ id: user.id }, secret as string)

                // Save token
                await prisma.token.create({
                    data: {
                        userId: user.id,
                        token: token
                    }
                })

                // Respond with user and token 
                res.status(200).send({
                    user: {
                        id: user.id,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        department: user.department,
                        balance: user.balance
                    },
                    token: token,
                })
            }
        } else {
            // Send an error message if no password found
            res.status(400).send({
                message: "Password does not match email." 
            })
        }
    } catch(e: any) {
        // If error is thrown, send error message
        res.status(500).send({
            message: e.message
        })
    } finally {
        // Close database connection
        prisma.$disconnect()
    } 
}

export const logout = async (req: Request, res: Response) => {
    try {
        const bearerToken = req.header("Authorization")

        if (bearerToken) {
            const token = bearerToken.replace("Bearer ", "")
        
            await prisma.token.deleteMany({
                where: {
                    token: token,
                }
            })
        }
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        prisma.$disconnect()
    }
}
