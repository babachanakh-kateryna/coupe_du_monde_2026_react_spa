export type TicketCategory = 'CATEGORY_1' | 'CATEGORY_2' | 'CATEGORY_3' | 'HOSPITALITY';
export type TicketStatus = 'pending_payment' | 'confirmed' | 'used' | 'expired' | 'cancelled';

export interface MatchInfo {
    id: number;
    homeTeam: string;
    awayTeam: string;
    matchDate: string;
    stadium: string;
}

export interface Ticket {
    id: string;
    userId: string;
    matchId: number;
    category: TicketCategory;
    price: number;
    status: TicketStatus;
    seatNumber: string | null;
    qrCode: string | null;
    expiresAt: string | null;
    paymentDate: string | null;
    validatedAt?: string | null;
    match?: MatchInfo;
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