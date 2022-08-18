/**
 * Required External Modules and Types
 */

import { PrismaClient } from "@prisma/client";
import {
    PayloadTicket,
    ResTicket,
    Ticket,
    Reimbursement,
    Image
} from "../types";
import nodemailer from "nodemailer"
import * as dotenv from "dotenv"

dotenv.config()
/**
 * Define Service
 */

const prisma = new PrismaClient()

// Create the base ticket
const createBaseTicket = async (payload: PayloadTicket) => {
    const ticket: ResTicket = await prisma.ticket.create({
        data: {
            creator: { connect: { id: payload.creatorId } },
            crf: payload.crf,
            purpose: payload.purpose,
            office: payload.office,
            department: payload.department,
            actionBy: payload.actionBy,
            status: payload.status,
            hasHardcopy: payload.hasHardcopy
        }
    })

    return ticket
}

// Create the reimbursements
const createReimbs = async (payload: PayloadTicket, ticket: ResTicket) => {
    let reimbursements: Reimbursement[] = []

    for (let i = 0; i < payload.reimbursements.length; i++) {
        const reimbursement = await prisma.reimbursement.create({
            data: {
                ticket: { connect: { id: ticket.id } },
                expenseDate: payload.reimbursements[i].expenseDate,
                expenseAmount: payload.reimbursements[i].expenseAmount,
                expenseNature: payload.reimbursements[i].expenseNature,
                orNum: payload.reimbursements[i].orNum,
                approved: payload.reimbursements[i].approved
            }
        })
        reimbursements.push(reimbursement)
    }

    return reimbursements
}

// Create the image links
const createImages = async (payload: PayloadTicket, ticket: ResTicket) => {
    let images: Image[] = []

    for (let i = 0; i < payload.images.length; i++) {
        const image = await prisma.image.create({
            data: {
                ticket: { connect: { id: ticket.id } },
                link: payload.images[i].link
            }
        })
        images.push(image)
    }

    return images
}

// Send an email
const sendEmail = (crf: number, email: string, actionBy: null | string = null, department: null | string = null, firstName: null | string = null, reimbursements: null | Reimbursement[] = null) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW,
        }
    })

    const directorEmail: {[key: string]: string} = {
        "Multimedia Arts": "feu.madirector@gmail.com",
        "Computer Science": "feu.csdirector@gmail.com",
        "Information Technology": "feu.itdirector@gmail.com",
        "Computer Engineering": "feu.cpedirector@gmail.com",
        "Mechanical Engineering": "feu.medirector@gmail.com",
        "Civil Engineering": "feu.cedirector@gmail.com",
        "Electronics and Electrical Engineering": "feu.eedirector@gmail.com",
        "Mathematics and Physical Sciences": "feu.mpsdirector@gmail.com",
        "Humanities, Social Sciences, and Communication": "feu.hscdirector@gmail.com"
    }

    let reimbursementString = ''
    reimbursements?.forEach(reimbursement => {
        reimbursementString += reimbursement.expenseNature
        reimbursementString += ' (To be reviewed)'
        reimbursementString += '<br\/>'
    })

    const message = {
        adminBody: `Good day, ${department} Director<br\/><br\/>This email is to inform you that the ticket with CRF number ${crf} is requiring your immediate action.<br\/><br\/>You can also visit and login on our <a href='http://159.223.45.163'>website</a> for more information.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.</i><br\/><br\/>Thanks,<br\/>RNV e-support`,
        clientBody: `Good day, ${firstName}<br\/><br\/>Thank you for using the Online Reimbursement System. The ${department?.toLowerCase()} director is now currently working on your ticket with CRF number ${crf}. A list of information about the progress regarding your reimbursement items will be shown below.<br\/><br\/>${reimbursementString}<br\/>You can also visit and login on our <a href='http://159.223.45.163'>website</a> for more information. Thank you for your patience.<br\/><br\/><i>Please note that this is an auto-generated email. Please do not reply.</i><br\/><br\/>Thanks,<br\/>RNV e-support`
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Reimbursement ${crf} Update`,
        html: message.clientBody
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })

    if (actionBy === 'director') {
        if (department) {
            mailOptions.to = directorEmail[department]
            mailOptions.html = message.adminBody
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })
    }
}

// Respond with the full ticket and send email update
export const createTicket = async (payload: PayloadTicket) => {
    const ticket = await createBaseTicket(payload)
    const reimbursements = await createReimbs(payload, ticket)
    const images = await createImages(payload, ticket)

    if (ticket && reimbursements) {
        const responseTicket: Ticket = {
            id: ticket.id,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            crf: ticket.crf,
            creatorId: ticket.creatorId,
            purpose: ticket.purpose,
            office: ticket.office,
            department: ticket.department,
            actionBy: ticket.actionBy,
            status: ticket.status,
            reimbursements: reimbursements,
            remarks: [],
            images: images,
            balance: null,
            hasHardcopy: ticket.hasHardcopy
        }

        const email = await prisma.user.findUnique({
            where: {
                id: ticket.creatorId
            },
            select: {
                email: true
            }
        })

        const firstName = await prisma.user.findUnique({
            where: {
                id: ticket.creatorId
            },
            select: {
                firstName: true
            }
        })

        if (email) {
            sendEmail(ticket.crf, email.email, ticket.actionBy, ticket.department, firstName?.firstName, reimbursements)
        }

        await prisma.$disconnect()
        return responseTicket
    }
}
