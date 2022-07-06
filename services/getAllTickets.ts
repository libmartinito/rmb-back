/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { Ticket, UpdatedTicket } from "../types"
import { getUpdatedTickets } from "./getUpdatedTickets"

const prisma = new PrismaClient()

/**
 * Define the service
 */

export const getAllTickets = async () => {
    // Get all the tickets in the database
    const tickets: Ticket[] = await prisma.ticket.findMany({
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    })

    const updatedTickets: UpdatedTicket[] = await getUpdatedTickets(tickets) 
    
    prisma.$disconnect()
    return updatedTickets 
}
