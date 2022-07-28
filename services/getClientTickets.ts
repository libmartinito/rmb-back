
/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { Ticket, UpdatedTicket, GetClientPayload } from "../types"
import { getUpdatedTickets } from "./getUpdatedTickets"
/**
 * Define Service
 */

const prisma = new PrismaClient()

const getPendingClientTickets = async (id: number) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            id: "asc"
        },        
        where: {
            creatorId: id,
            AND: [
                { status: { not: "completed" } },
                { status: { not: "rejected" } }
            ]
        },
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    })

    const updatedTickets: UpdatedTicket[] = await getUpdatedTickets(tickets)
    return updatedTickets
}

const getCompletedClientTickets = async (id: number) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            id: "asc"
        },
        where: {
            creatorId: id,
            OR: [
                { status: { equals: "completed" } },
                { status: { equals: "rejected" } }
            ]
        },
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    })

    const updatedTickets: UpdatedTicket[] = await getUpdatedTickets(tickets)
    return updatedTickets
}

const getPendingAdminTickets = async (role: string) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            id: "asc"
        },
        where: {
            actionBy: role,
        },
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    })

    const updatedTickets: UpdatedTicket[] = await getUpdatedTickets(tickets)
    return updatedTickets
}

const getCompletedAdminTickets = async (role: string) => {
    const roles = ["director", "sdirector", "hsu", "hr", "sdas", "user", "finance", "none"]
    const roleIndex = roles.indexOf(role)
    roles.splice(0, roleIndex + 1)

    const completedTickets: Ticket[] = []
            
    for (let i = 0; i < roles.length; i++) {
        const tickets = await prisma.ticket.findMany({
            orderBy: {
                id: "asc"
            },
            where: {
                actionBy: roles[i],
            },
            include: {
                reimbursements: true,
                remarks: true,
                images: true,
                balance: true
            }
        })    
  
        tickets.forEach(ticket => {
            completedTickets.push(ticket)
        })
    }

    completedTickets.sort(function (a, b) {
        if (a.crf > b.crf) {
            return 1
        } else {
            return -1
        }
    })

    const updatedTickets: UpdatedTicket[] = await getUpdatedTickets(completedTickets)

    return updatedTickets
}

export const getClientTickets = async (payload: GetClientPayload) => {
    const { id, role, status } = payload
    
    if (role === "user") {
        // Get tickets that are pending for the user
        if (status === "pending") {
            const tickets = await getPendingClientTickets(id)
            prisma.$disconnect()
            return tickets
        } else {
            // Get tickets that are completed for the user
            const tickets = await getCompletedClientTickets(id)
            prisma.$disconnect()
            return tickets
        }
    } else {
        // Get tickets that are pending for the admin
        if (status === "pending") {
            const tickets = await getPendingAdminTickets(role)
            prisma.$disconnect()
            return tickets
        } else {
            // Get tickets that are completed for the admin
            const tickets = await getCompletedAdminTickets(role)
            prisma.$disconnect()
            return tickets 
        }
    }
}
