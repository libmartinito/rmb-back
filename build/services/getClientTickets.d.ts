/**
 * Required External Modules
 */
import { UpdatedTicket, GetClientPayload } from "../types";
export declare const getClientTickets: (payload: GetClientPayload) => Promise<UpdatedTicket[]>;
