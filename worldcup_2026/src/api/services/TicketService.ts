import api from '../api';
import type { ApiResponse } from '../types/Common';
import type {Ticket, TicketAddRequest, TicketListResponse, TicketCartResponse, TicketPaymentResponse, TicketValidateRequest } from '../types/Tickets';

export class TicketService {

    // ajouter tickets dans panier
    static async addTickets(request: TicketAddRequest): Promise<TicketCartResponse> {
        const response = await api.post<ApiResponse<TicketCartResponse>>('/tickets', request);
        return response.data.data;
    }

    // voir tous ses tickets
    static async getAllUserTickets(): Promise<TicketListResponse> {
        const response = await api.get<ApiResponse<TicketListResponse>>('/tickets');
        return response.data.data;
    }

    // voir le panier
    static async getPendingTickets(): Promise<TicketCartResponse> {
        const response = await api.get<ApiResponse<TicketCartResponse>>('/tickets/pending');
        return response.data.data;
    }

    // payer les tickets en attente
    static async payAllPendingTickets(): Promise<TicketPaymentResponse> {
        const response = await api.post<ApiResponse<TicketPaymentResponse>>('/tickets/pay-pending', {});
        return response.data.data;
    }

    //supprimer un ticket du panier
    static async removePendingTicket(ticketId: string): Promise<void> {
        await api.delete<ApiResponse<{}>>(`/tickets/${ticketId}`);
    }

    // valider un ticket a l entree du stade
    static async validateTicket(ticketId: string, qrCode: string): Promise<Ticket> {
        const request: TicketValidateRequest = { qrCode };
        const response = await api.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/validate`, request);
        return response.data.data;
  }
}