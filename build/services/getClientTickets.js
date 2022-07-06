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
exports.getClientTickets = void 0;
const client_1 = require("@prisma/client");
const getUpdatedTickets_1 = require("./getUpdatedTickets");
/**
 * Define Service
 */
const prisma = new client_1.PrismaClient();
const getPendingClientTickets = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield prisma.ticket.findMany({
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
    });
    const updatedTickets = yield (0, getUpdatedTickets_1.getUpdatedTickets)(tickets);
    return updatedTickets;
});
const getCompletedClientTickets = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield prisma.ticket.findMany({
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
    });
    const updatedTickets = yield (0, getUpdatedTickets_1.getUpdatedTickets)(tickets);
    return updatedTickets;
});
const getPendingAdminTickets = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield prisma.ticket.findMany({
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
    });
    const updatedTickets = yield (0, getUpdatedTickets_1.getUpdatedTickets)(tickets);
    return updatedTickets;
});
const getCompletedAdminTickets = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = ["director", "hsu", "hr", "sdas", "finance", "none"];
    const roleIndex = roles.indexOf(role);
    roles.splice(0, roleIndex + 1);
    const completedTickets = [];
    for (let i = 0; i < roles.length; i++) {
        const tickets = yield prisma.ticket.findMany({
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
        });
        tickets.forEach(ticket => {
            completedTickets.push(ticket);
        });
    }
    completedTickets.sort(function (a, b) {
        if (a.crf > b.crf) {
            return 1;
        }
        else {
            return -1;
        }
    });
    const updatedTickets = yield (0, getUpdatedTickets_1.getUpdatedTickets)(completedTickets);
    return updatedTickets;
});
const getClientTickets = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role, status } = payload;
    if (role === "user") {
        // Get tickets that are pending for the user
        if (status === "pending") {
            const tickets = yield getPendingClientTickets(id);
            prisma.$disconnect();
            return tickets;
        }
        else {
            // Get tickets that are completed for the user
            const tickets = yield getCompletedClientTickets(id);
            prisma.$disconnect();
            return tickets;
        }
    }
    else {
        // Get tickets that are pending for the admin
        if (status === "pending") {
            const tickets = yield getPendingAdminTickets(role);
            prisma.$disconnect();
            return tickets;
        }
        else {
            // Get tickets that are completed for the admin
            const tickets = yield getCompletedAdminTickets(role);
            prisma.$disconnect();
            return tickets;
        }
    }
});
exports.getClientTickets = getClientTickets;
