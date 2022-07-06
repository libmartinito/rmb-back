/**
 * Required External Modules
 */
import { UpdatePayload } from "../types";
export declare const updateTicket: (payload: UpdatePayload) => Promise<(import(".prisma/client").Ticket & {
    reimbursements: import(".prisma/client").Reimbursement[];
    remarks: import(".prisma/client").Remark[];
}) | null>;
