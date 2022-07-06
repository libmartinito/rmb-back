
/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { Ticket, UpdatedTicket } from "../types"

/**
 * Define Service
 */

const prisma = new PrismaClient()

export const getUpdatedTickets = async (tickets: Ticket[]) => {
    const updatedTickets: UpdatedTicket[] = []
    
    // Loop over the tickets, add creator info to each one, and push to arr
    for (let i = 0; i < tickets.length; i++) {
        const creatorInfo = await prisma.user.findUnique({
            where: {
                id: tickets[i].creatorId
            },
            select: {
                firstName: true,
                lastName: true
            }
        })
        
        if (creatorInfo) {
            const updatedTicket: UpdatedTicket = {
                id: tickets[i].id,
                createdAt: tickets[i].createdAt,
                updatedAt: tickets[i].updatedAt,
                crf: tickets[i].crf,
                creatorId: tickets[i].creatorId,
                purpose: tickets[i].purpose,
                office: tickets[i].office,
                department: tickets[i].department,
                actionBy: tickets[i].actionBy,
                status: tickets[i].status,
                reimbursements: tickets[i].reimbursements,
                remarks: tickets[i].remarks,
                images: tickets[i].images,
                balance: tickets[i].balance,
                creatorInfo: creatorInfo
            }

            updatedTickets.push(updatedTicket) 
        }
    }

    return updatedTickets
}

