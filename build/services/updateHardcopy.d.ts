/**
 * Required External Modules
 */
import { UserUpdatePayload } from "../types";
export declare const updateHardcopy: (payload: UserUpdatePayload) => Promise<(import(".prisma/client").Ticket & {
    reimbursements: import(".prisma/client").Reimbursement[];
    remarks: import(".prisma/client").Remark[];
}) | null>;
