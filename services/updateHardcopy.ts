/**
 * Required External Modules
 */

import { PrismaClient } from "@prisma/client"
import { UserUpdatePayload } from "../types"

/**
 * Definte the service
 */

const prisma = new PrismaClient()

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

    prisma.$disconnect()
    return ticket
}