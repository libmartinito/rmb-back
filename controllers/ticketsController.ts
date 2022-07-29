/**
 * Required External Modules
 */
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { PayloadTicket, Ticket, GetClientPayload } from "../types"
import { createTicket } from "../services/createTicket"
import { getClientTickets } from "../services/getClientTickets"
import { getAllTickets } from "../services/getAllTickets"
import { getTicket } from "../services/getTicket"
import { updateTicket } from "../services/updateTicket"
import { updateHardcopy } from "../services/updateHardcopy"

const prisma = new PrismaClient()

export const create = async (req: Request, res: Response) => {
    try {
        const payload: PayloadTicket = req.body
        const ticket: Ticket | undefined = await createTicket(payload)
        res.status(200).send(ticket)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

export const getClient = async (req: Request, res: Response) => {
    try {
        const { id, role, status } = req.params
        const payload: GetClientPayload = {
            id: parseInt(id),
            role: role, 
            status: status
        }
        const clientTickets = await getClientTickets(payload)
        res.status(200).send(clientTickets)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const tickets = await getAllTickets()
        res.status(200).send(tickets)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { ticketcrf } = req.params
        const payload: number = parseInt(ticketcrf) 
        const ticket = await getTicket(payload)
        res.status(200).send(ticket)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

export const updateOne = async (req: Request, res: Response) => {
    try {
        const payload = req.body
        const ticket = await updateTicket(payload)
        res.status(200).send(ticket)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

export const updateCopy = async (req: Request, res: Response) => {
    try {
        const payload = req.body
        const ticket = await updateHardcopy(payload)
        res.status(200).send(ticket)
    } catch(e: any) {
        res.status(500).send(e.message)
    } finally {
        await prisma.$disconnect()
    }
}
