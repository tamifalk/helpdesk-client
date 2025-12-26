import axiosInstance from "../api/axiosInstance";
import type { CreateTicketDto, Priority, Status, Ticket, TicketComment, TicketUpdateFields, TicketWithComments } from "../types/ticket.types";

export const getTickets = async (): Promise<Ticket[]> => {
    try {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTicketsById = async (ticketId: number): Promise<TicketWithComments> => {
    try {
        const response = await axiosInstance.get(`/tickets/${ticketId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
    try {
        const response = await axiosInstance.post('/tickets', ticket);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTicket = async (ticketId: number) => {
    try {
        await axiosInstance.delete(`/tickets/${ticketId}`);
    } catch (error) {
        throw error;
    }
};

export const addComment = async (ticketId: number, content: string): Promise<TicketComment> => {
    try {
        const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, { content });
        return response.data;
    } catch (error) {
        throw error;
    }
};



export const getStatuses = async (): Promise<Status[]> => {
    try {
        const response = await axiosInstance.get('/statuses');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPriorities = async (): Promise<Priority[]> => {
    try {
        const response = await axiosInstance.get('/priorities');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTicket = async (
    ticketId: number,
    updates: TicketUpdateFields
): Promise<Ticket> => {
    try {
        const response = await axiosInstance.patch(`/tickets/${ticketId}`, updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};



//עדכון צבעים לפי סטטוס
export const getStatusConfig = (statusName: string | undefined) => {
    const name = statusName?.toLowerCase() || "";
    
    if (name.includes("open") || name.includes("פתוח"))
        return { color: "error" as const, hex: "#d32f2f", label: "פתוח" };
    
    if (name.includes("progress") || name.includes("בטיפול"))
        return { color: "warning" as const, hex: "#ed6c02", label: "בטיפול" };
    
    if (name.includes("closed") || name.includes("סגור"))
        return { color: "success" as const, hex: "#2e7d32", label: "סגור" };
    
    return { color: "primary" as const, hex: "#1976d2", label: statusName || "חדש" };
};

