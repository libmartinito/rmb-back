/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { UserUpdatePayload } from "../types"
import nodemailer from "nodemailer"
import * as dotenv from "dotenv"

dotenv.config()
/**
 * Definte the service
 */

const prisma = new PrismaClient()

// Send an email
const sendEmail = (crf: number) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW
        }
    })

    const message = {
        body: "This is to let you know that a new ticket with the crf number shown above requires your attention."
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: "feu.finac@gmail.com",
        subject: `Reimbursement ${crf} Update`,
        html: message.body
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

export const updateHardcopy = async(payload: UserUpdatePayload) => {
    const ticketId = payload.ticketId
    const hasHardcopy = payload.hasHardcopy 
    const actionBy = payload.actionBy
    const status = payload.status

    // Update hasHardcopy
    await prisma.ticket.update({
        where: {
            id: parseInt(ticketId)
        },
        data: {
            actionBy: actionBy,
            status: status,
            hasHardcopy: hasHardcopy
        }
    })

    const ticket = await prisma.ticket.findUnique({
        where: {
            id: parseInt(ticketId)
        },
        include: {
            remarks: true,
            reimbursements: true
        }
    })

    if (ticket) {
        sendEmail(ticket.crf)
    }
    prisma.$disconnect()
    return ticket
}