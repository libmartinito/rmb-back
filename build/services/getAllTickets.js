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
exports.getAllTickets = void 0;
const client_1 = require("@prisma/client");
const getUpdatedTickets_1 = require("./getUpdatedTickets");
const prisma = new client_1.PrismaClient();
/**
 * Define the service
 */
const getAllTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get all the tickets in the database
    const tickets = yield prisma.ticket.findMany({
        include: {
            reimbursements: true,
            remarks: true,
            images: true,
            balance: true
        }
    });
    const updatedTickets = yield (0, getUpdatedTickets_1.getUpdatedTickets)(tickets);
    prisma.$disconnect();
    return updatedTickets;
});
exports.getAllTickets = getAllTickets;