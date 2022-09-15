"use strict";
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
exports.updateCopy = exports.updateOne = exports.getOne = exports.getAll = exports.getClient = exports.create = void 0;
/**
 * Required External Modules
 */
const client_1 = require("@prisma/client");
const createTicket_1 = require("../services/createTicket");
const getClientTickets_1 = require("../services/getClientTickets");
const getAllTickets_1 = require("../services/getAllTickets");
const getTicket_1 = require("../services/getTicket");
const updateTicket_1 = require("../services/updateTicket");
const updateHardcopy_1 = require("../services/updateHardcopy");
const prisma = new client_1.PrismaClient();
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const ticket = yield (0, createTicket_1.createTicket)(payload);
        res.status(200).send(ticket);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.create = create;
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, role, status } = req.params;
        const payload = {
            id: parseInt(id),
            role: role,
            status: status
        };
        const clientTickets = yield (0, getClientTickets_1.getClientTickets)(payload);
        res.status(200).send(clientTickets);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getClient = getClient;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield (0, getAllTickets_1.getAllTickets)();
        res.status(200).send(tickets);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getAll = getAll;
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketcrf } = req.params;
        const payload = parseInt(ticketcrf);
        const ticket = yield (0, getTicket_1.getTicket)(payload);
        res.status(200).send(ticket);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.getOne = getOne;
const updateOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const ticket = yield (0, updateTicket_1.updateTicket)(payload);
        res.status(200).send(ticket);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateOne = updateOne;
const updateCopy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const ticket = yield (0, updateHardcopy_1.updateHardcopy)(payload);
        res.status(200).send(ticket);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updateCopy = updateCopy;
