/**
 * Required External Modules and Types
 */
import { PayloadTicket, Ticket } from "../types";
export declare const createTicket: (payload: PayloadTicket) => Promise<Ticket | undefined>;
