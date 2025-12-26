export interface Ticket {
    id: number;             
    subject: string;        
    description: string;
    status_id: number;
    priority_id: number;
    created_at: string;
    updated_at: string | null;
    created_by: number;
    assigned_to: number | null;     
    status_name: string;    
    priority_name: string; 
    created_by_name: string; 
    created_by_email: string;
    assigned_to_name: string | null; 
    assigned_to_email: string | null; 
}

export interface TicketComment {
    id: number;
    ticket_id: number;
    author_id: number;
    author_name: string;
    author_email: string;
    content: string;
    created_at: string;
}

export interface TicketWithComments extends Ticket {
    comments: TicketComment[];
}

export interface CreateTicketDto {
    subject: string;
    description: string;
    status_id?: number;
    priority_id?: number;
    assigned_to?: number;
}

export interface Status {
    id: number;
    name: string;
}

export interface Priority {
    id: number;
    name: string;
}

export interface TicketUpdateFields {
    status_id?: number;
    priority_id?: number;
    assigned_to?: number;
}