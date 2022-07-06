/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { Ticket, UpdatedTicket } from "../types"
import { getUpdatedTickets } from "./getUpdatedTickets"

const prisma = new PrismaClient()

export const getTicket = async (payload: number) => {
    const ticket: Ticket | null  = await prisma.ticket.findUnique({
        where: {
            crf: payload
        },
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    })

    if (ticket) {
        const updatedTickets: UpdatedTicket[] = await getUpdatedTickets([ticket])

        prisma.$disconnect()
        return updatedTickets[0]
    }
}
