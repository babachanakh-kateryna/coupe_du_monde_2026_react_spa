export type TicketCategory = 'CATEGORY_1' | 'CATEGORY_2' | 'CATEGORY_3' | 'HOSPITALITY';
export type TicketStatus = 'pending_payment' | 'confirmed' | 'used' | 'expired' | 'cancelled';

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
    paymentDate?: string;
    validatedAt?: string;
    match: {
        id: number;
        homeTeam: string;
        awayTeam: string;
        matchDate: string;
        stadium: string;
    };
}

export interface TicketAddRequest {
    matchId: number;
    category: TicketCategory;
    quantity: number;
}

export interface TicketValidateRequest {
    qrCode: string;
}

export interface TicketCartResponse {
    tickets: Ticket[];
    count: number;
    totalPrice: number;
    expiresAt: string;
}

export interface TicketPaymentResponse {
    tickets: Ticket[];
    count: number;
    totalPrice: number;
}

export interface TicketListResponse {
    tickets: Ticket[];
    grouped: {
        pending: Ticket[];
        confirmed: Ticket[];
        used: Ticket[];
    };
    counts: {
        total: number;
        pending: number;
        confirmed: number;
        used: number;
    };
}