/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { UpdatePayload } from "../types"

/**
 * Definte the service
 */

const prisma = new PrismaClient()

export const updateTicket = async (payload: UpdatePayload) => {
    const ticketId = payload.ticketId
    const actionBy = payload.actionBy
    const status = payload.status
    const reimbursements = payload.reimbursements
    const remarks = payload.remarks
    const balance = payload.balance
    
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
                balance: balance.balance,
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
