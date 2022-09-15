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
    hasHardcopy: boolean;
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
        balance: null | number;
        email: string;
    };
}
export interface Reimbursement {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    ticketId: null | number;
    orNum: number;
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
    balanceDate: string;
    amount: number;
    preparedBy: string;
}
export interface GetClientPayload {
    id: number;
    role: string;
    status: string;
}
export interface UpdatePayload {
    userId: number;
    ticketId: string;
    crf: number;
    department: string;
    email: string;
    actionBy: string;
    status: string;
    reimbursements: Reimbursement[];
    remarks: Remark[];
    balance: null | Balance;
    updatedBalance: null | number;
}
export interface UserUpdatePayload {
    ticketId: string;
    hasHardcopy: boolean;
    actionBy: string;
    status: string;
}
