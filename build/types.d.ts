/**
 * Type Interfaces
 */
export interface BaseTicket {
    crf: number;
    purpose: string;
    office: string;
    department: string;
    actionBy: string;
    status: string;
}
export interface ResTicket extends BaseTicket {
    id: number;
    creatorId: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PayloadTicket extends BaseTicket {
    creatorId: number;
    reimbursements: Reimbursement[];
    images: Image[];
}
export interface Ticket extends BaseTicket {
    id: number;
    creatorId: number;
    createdAt: Date;
    updatedAt: Date;
    reimbursements: Reimbursement[];
    remarks: Remark[];
    images: Image[];
    balance: null | Balance;
}
export interface UpdatedTicket extends Ticket {
    creatorInfo: {
        firstName: string;
        lastName: string;
    };
}
export interface Reimbursement {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    ticketId: null | number;
    expenseDate: string;
    expenseAmount: number;
    expenseNature: string;
    approved: boolean;
}
export interface Remark {
    id: number;
    ticketId: number;
    type: string;
    role: string;
    content: string;
}
export interface Image {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    ticketId: number;
    link: string;
}
export interface Balance {
    id: number;
    ticketId: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    balance: number;
    amount: number;
    preparedBy: string;
}
export interface GetClientPayload {
    id: number;
    role: string;
    status: string;
}
export interface UpdatePayload {
    ticketId: string;
    actionBy: string;
    status: string;
    reimbursements: Reimbursement[];
    remarks: Remark[];
    balance: null | Balance;
}
