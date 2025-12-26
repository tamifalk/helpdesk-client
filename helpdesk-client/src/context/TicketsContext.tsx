import type { FunctionComponent } from "react";
import { createContext, useContext, useState } from "react";
import type { CreateTicketDto, Status, Ticket, TicketComment, TicketUpdateFields, } from "../types/ticket.types";
import { addComment, createTicket, deleteTicket, getStatuses, getTickets, updateTicket } from "../services/ticket.service";
import { showErrorAlert } from "../utils/alerts";

interface TicketsProviderProps {
    children: React.ReactNode;
}

interface TicketsContextType {
    tickets: Ticket[];
    statuses: Status[];
    loading: boolean;
    error: string | null;
    refreshTickets: () => Promise<Ticket[]>;
    addTicket: (ticket: CreateTicketDto) => Promise<Ticket>;
    deleteTicketFromContext: (id: number) => Promise<boolean>;
    addNewComment: (ticketId: number, content: string) => Promise<TicketComment>;
    refreshStatuses: () => Promise<Status[]>;
    updateTicketData: (ticketId: number, fields: TicketUpdateFields) => Promise<Ticket>;

}

export const TicketsContext = createContext<TicketsContextType>({
    tickets: [],
    statuses: [],
    loading: false,
    error: null,
    refreshTickets: async () => [],
    addTicket: async (ticket: CreateTicketDto) => ({} as Ticket),
    deleteTicketFromContext: async (id: number) => false,
    addNewComment: async (ticketId: number, content: string) => ({} as TicketComment),
    refreshStatuses: async () => [],
    updateTicketData: async (ticketId: number, fields: TicketUpdateFields) => ({} as Ticket),
});

const TicketsProvider: FunctionComponent<TicketsProviderProps> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const refreshTickets = async (): Promise<Ticket[]> => {
        try {
            setLoading(true); // מסמנים שהתחילה טעינה
            setError(null);    // מאפסים שגיאות קודמות

            const response = await getTickets();
            setTickets(response);
            return response;
        } catch (err) {
            setError("נכשלנו בטעינת הטיקטים. נסה שוב מאוחר יותר.");
            return [];
        } finally {
            setLoading(false);
        }
    }

    const addTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
        try {
            setLoading(true);
            setError(null);

            const response = await createTicket(ticket);
            setTickets(prev => [...prev, response]);
            return response;
        } catch (err) {
            setError("נכשלנו ביצירת הטיקט. נסה שוב מאוחר יותר.");
            return {} as Ticket;
        } finally {
            setLoading(false);
        }
    }

    const deleteTicketFromContext = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            await deleteTicket(id);
            setTickets(prevTickets => prevTickets.filter(t => t.id !== id));
            return true;
        } catch (error) {
            setError("שגיאה במחיקת הפנייה");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addNewComment = async (ticketId: number, content: string): Promise<TicketComment> => {
        try {
            setLoading(true);
            const response = await addComment(ticketId, content);

            const fullComment: TicketComment = {
                ...response,
                created_at: new Date().toISOString(),
            };

            setTickets(prev => prev.map(t =>
                t.id === ticketId
                    ? { ...t, updated_at: fullComment.created_at }
                    : t
            ));

            return fullComment;
        } catch (err) {
            setError("שגיאה בהוספת התגובה");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshStatuses = async (): Promise<Status[]> => {
        try {
            setLoading(true);
            setError(null);

            const response = await getStatuses();
            setStatuses(response);
            return response;
        } catch (err) {
            setError("שגיאה בטעינת הסטטוסים");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const updateTicketData = async (ticketId: number, fields: TicketUpdateFields): Promise<Ticket> => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateTicket(ticketId, fields);

            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, ...response } : t
            ));

            return response;
        } catch (err) {
            setError("שגיאה בעדכון פרטי הפנייה");
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return (<TicketsContext.Provider value={{
        tickets,
        statuses,
        loading,
        error,
        refreshTickets,
        addTicket,
        deleteTicketFromContext,
        addNewComment,
        refreshStatuses,
        updateTicketData
    }}>
        {children}
    </TicketsContext.Provider>);
}

export const useTickets = () => {
    const context = useContext(TicketsContext);
    if (!context) {
        throw new Error("useTickets must be used within a TicketsProvider");
    }
    return context;
};

export default TicketsProvider;