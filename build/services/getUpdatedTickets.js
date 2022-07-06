"use strict";
/**
 * Required External Modules
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdatedTickets = void 0;
const client_1 = require("@prisma/client");
/**
 * Define Service
 */
const prisma = new client_1.PrismaClient();
const getUpdatedTickets = (tickets) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedTickets = [];
    // Loop over the tickets, add creator info to each one, and push to arr
    for (let i = 0; i < tickets.length; i++) {
        const creatorInfo = yield prisma.user.findUnique({
            where: {
                id: tickets[i].creatorId
            },
            select: {
                firstName: true,
                lastName: true
            }
        });
        if (creatorInfo) {
            const updatedTicket = {
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
            };
            updatedTickets.push(updatedTicket);
        }
    }
    return updatedTickets;
});
exports.getUpdatedTickets = getUpdatedTickets;
