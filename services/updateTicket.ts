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

const sendEmail = (payload: {
    actionBy: string,
    department: string,
    roleTitle: string,
    email: string,
    status: string,
    crf: number
}) => {

    const actionBy = payload.actionBy
    const department = payload.department
    const roleTitle = payload.roleTitle
    const email = payload.email
    const status = payload.status
    const crf = payload.crf

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW,
        }
    })

    const message = {
        adminActionBody: "This is to let you know that a new ticket with the crf number shown above requires your attention.",
        clientUpdateBody: `This is to let you know that your ticket is now under review by the ${roleTitle}`,
        clientCompletedBody: "This is to let you know that your ticket has completed the review process and has been approved.",
        clientRejectedBody: "This is to let you konw that your ticket has completed the review process and has been rejected.",
        clientActionBody: "This is to let you know that you have a week to submit the hardcopy of receipts/prescriptions for the ticket shown above."
    }

    const adminEmails: {
        director: {
            'MA': string,
            'CS': string,
            'IT': string,
            'CpE': string,
            'ME': string,
            'CE': string,
            'EE': string,
            'HSC': string,
            'MPS': string
        },
        sdirector: string,
        hsu: string,
        hr: string,
        sdas: string,
        finance: string
    } = {
        director: {
            'MA': 'feu.madirector@gmail.com',
            'CS': 'feu.csdirector@gmail.com',
            'IT': 'feu.itdirector@gmail.com',
            'CpE': 'feu.cpedirector@gmail.com',
            'ME': 'feu.medirector@gmail.com',
            'CE': 'feu.cedirector@gmail.com',
            'EE': 'feu.eedirector@gmail.com',
            'HSC': 'feu.hscdirector@gmail.com',
            'MPS': 'feu.mpsdirector@gmail.com',
        },
        sdirector: 'feu.ccsseniordirector@gmail.com',
        hsu: 'feu.hsunit@gmail.com',
        hr: 'feu.hresources@gmail.com',
        sdas: 'feu.sdas@gmail.com',
        finance: 'feu.finac@gmail.com'
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: '',
        subject: `Reimbursement ${crf} Update`,
        html: ''
    }

    if (department === 'MA') {
        mailOptions.to = adminEmails.director.MA
    } else if (department === 'CS') {
        mailOptions.to = adminEmails.director.CS
    } else if (department === 'IT') {
        mailOptions.to = adminEmails.director.IT
    } else if (department === 'CpE') {
        mailOptions.to = adminEmails.director.CpE
    } else if (department === 'ME') {
        mailOptions.to = adminEmails.director.ME
    } else if (department === 'CE') {
        mailOptions.to = adminEmails.director.CE
    } else if (department === 'EE') {
        mailOptions.to = adminEmails.director.EE
    } else if (department === 'HSC') {
        mailOptions.to = adminEmails.director.HSC
    } else if (department === 'MPS') {
        mailOptions.to = adminEmails.director.MPS
    } else if (department === 'NA') {
        if (actionBy === 'sdirector') {
            mailOptions.to = adminEmails.sdirector
        } else if (actionBy === 'hsu') {
            mailOptions.to = adminEmails.hsu
        } else if (actionBy === 'hr') {
            mailOptions.to = adminEmails.hr
        } else if (actionBy === 'sdas') {
            mailOptions.to = adminEmails.sdas
        } else if (actionBy === 'user') {
            mailOptions.to = email 
        } else if (actionBy === 'finance') {
            mailOptions.to = adminEmails.finance
        } else if (actionBy === 'none') {
            mailOptions.to = email
        }
    }

    if (actionBy === 'none') {
        if (status === 'Rejected') {
            mailOptions.html = message.clientRejectedBody
        } else if (status === 'Completed') {
            mailOptions.html = message.clientCompletedBody
        }
    } else if (actionBy === 'user') {
        mailOptions.html = message.clientActionBody
    }

    if (actionBy === 'none' || actionBy === 'user') {
        transporter.sendMail(mailOptions)
    } else {
        mailOptions.html = message.adminActionBody
        transporter.sendMail(mailOptions)

        mailOptions.html = message.clientUpdateBody
        mailOptions.to = email
        transporter.sendMail(mailOptions)
    }
}

export const updateTicket = async (payload: UpdatePayload) => {
    const userId = payload.userId
    const ticketId = payload.ticketId
    const crf = payload.crf
    const department = payload.department
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

    let roleTitle = ''
    const roles = ['director', 'sdirector', 'hsu', 'hr', 'sdas', 'user', 'finance']
    const rolesTitleCase = ['Director', 'Senior Director', 'HSU', 'HR', 'SDAS', 'User', 'Finance']
    const roleIndex = roles.indexOf(actionBy)
    roleTitle = rolesTitleCase[roleIndex] 

    // Send email if the ticket requires action from user
    const emailPayload = {
        actionBy: actionBy,
        roleTitle: roleTitle,
        department: department,
        email: email,
        status: status,
        crf: crf
    }

    if (actionBy === 'user') {
        sendEmail(emailPayload)
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
                ticket: { connect: { id: remarks[i].ticketId } },
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
                ticket: { connect: { id: balance.ticketId } },
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
