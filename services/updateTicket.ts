/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { UpdatePayload } from "../types"
import * as dotenv from "dotenv"
import nodemailer from "nodemailer"
import { response } from "express"

dotenv.config()
/**
 * Definte the service
 */

const prisma = new PrismaClient()

const sendEmail = (toEmail: string, crf: number) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW,
        }
    })

    const message = {
        body: "This is to let you know that you have a week to submit the hardcopy of receipts/prescriptions for the ticket shown above."
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: `Reimbursement ${crf} Update`,
        html: message.body 
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
           console.log(err) 
        } else {
            response.json(info)
        }
    })
}

export const updateTicket = async (payload: UpdatePayload) => {
    const userId = payload.userId
    const ticketId = payload.ticketId
    const crf = payload.crf
    const email = payload.email
    const actionBy = payload.actionBy
    const status = payload.status
    const reimbursements = payload.reimbursements
    const remarks = payload.remarks
    const balance = payload.balance
    const updatedBalance = payload.updatedBalance
    
    // Update user balance
    if (updatedBalance) {
        await prisma.user.update({
            where: {
                id: userId 
            },
            data: {
                balance: updatedBalance
            }
        })
    }

    // Update base ticket actionby and status
    await prisma.ticket.update({
        where: {
            id: parseInt(ticketId) 
        },
        data: {
            actionBy: actionBy,
            status: status
        }
    })

    // Send email if the ticket requires action from user
    if (actionBy === 'user') {
        sendEmail(email, crf)
    }
    
    // Update changes to reimbursements
    for (let i = 0; i < reimbursements.length; i++) {
        await prisma.reimbursement.update({
            where: {
                id: reimbursements[i].id
            },
            data: {
                approved: reimbursements[i].approved
            }
        })
    }

    // Create remarks 
    for (let i = 0; i < remarks.length; i++) {
        await prisma.remark.create({
            data: {
                ticket: { connect: { id: remarks[i].ticketId}},
                type: remarks[i].type,
                role: remarks[i].role,
                content: remarks[i].content
            }
        })
    }

    // Create balance for ticket
    if (balance) {
        await prisma.balance.create({
            data: {
                ticket: { connect: { id: balance.ticketId} },
                name: balance.name,
                balanceDate: balance.balanceDate,
                amount: balance.amount,
                preparedBy: balance.preparedBy
            }
        })
    }

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: parseInt(ticketId) 
        },
        include: {
            remarks: true,
            reimbursements: true
        }
    })
    
    prisma.$disconnect()
    return ticket
}
