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

// Respond with the full ticket
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
        
        await prisma.$disconnect()
        return responseTicket
    }
}
