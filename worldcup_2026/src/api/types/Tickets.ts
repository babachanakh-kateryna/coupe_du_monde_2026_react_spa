import type { Match } from "./Match";

export type TicketStatus = 'pending_payment' | 'confirmed' | 'used';
export type TicketCategory = 'VIP' | 'CATEGORY_1' | 'CATEGORY_2' | 'CATEGORY_3';

export interface Ticket {
    id: string;
    userId: string;
    matchId: number;
    category: TicketCategory;
    price: number;
    status: TicketStatus;
    seatNumber: string;
    qrCode: string;
    expiresAt: string;
    paymentDate: string;
    validatedAt: string;
    match: Match;
}