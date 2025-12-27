
import { useEffect, useState, type FunctionComponent } from "react";
import TicketCard from "../components/TicketCard";
import { Box, Grid, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import FilterBar from "../components/FilterBar";
import { Outlet } from "react-router-dom";
import type { IUser } from "../types/auth.types";
import { getUsers } from "../services/user.service";

interface TicketsListProps {

}

const TicketList: FunctionComponent<TicketsListProps> = () => {
    const { tickets } = useTickets();
    const { user, setIsProcessing } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");//שמירת שדה החיפוש
    const [filterStatus, setFilterStatus] = useState<string | null>(null);//שמירת הסטטוס לסינון
    const [sortBy, setSortBy] = useState<"date" | "priority">("date");//שמירת שיטת המיון הנבחרת
    //const navigate = useNavigate();
    const [agents, setAgents] = useState<IUser[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            if (user?.role === 'admin') {
                try {
                    setIsProcessing(true);
                    const data = await getUsers();
                    setAgents(data.filter(u => u.role === 'agent'));
                } catch (error) {
                    console.error("שגיאה בטעינת סוכנים", error);
                } finally {
                    setIsProcessing(false);
                }
            }
        };
        fetchAgents();
    }, [user]);

    // סינון ומיון הטיקטים לפי שדה החיפוש, סטטוס ומיון
    const filteredTickets = tickets.filter(ticket => {
        const s = searchTerm.toLowerCase(); // חישוב פעם אחת בלבד

        let matchesSearch = ticket.subject.toLowerCase().includes(s) ||
            ticket.description.toLowerCase().includes(s);

        if (user?.role !== 'customer') {
            matchesSearch = matchesSearch || ticket.created_by_name?.toLowerCase().includes(s);
        }
        const matchesStatus = filterStatus === null || ticket.status_name === filterStatus;

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.priority_id - a.priority_id;
    });


    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            {/* 1. סרגל פילטרים */}
            <Box sx={{
                position: 'sticky',
                top: '64px',
                zIndex: 10,
                width: '100%',
                bgcolor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                px: { xs: 2, sm: 4, md: 6 },
                py: 2,
                boxSizing: 'border-box'
            }}>
                <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <FilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={filterStatus}
                        onStatusChange={setFilterStatus}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                    />
                </Box>
            </Box>

            {/* 2. אזור התוכן */}
            <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
                {tickets.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        mt: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            אין פניות להצגה
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            נראה שעדיין לא נוצרו פניות במערכת.
                        </Typography>
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={4}
                        justifyContent="center"
                        sx={{
                            width: '100%',
                            margin: '0 auto',
                            maxWidth: '1400px',
                        }}
                    >
                        {filteredTickets.map((ticket) => (
                            <Grid
                                key={ticket.id}
                                size={{ xs: 12, sm: 6, md: 4 }} 
                                sx={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <Box sx={{ width: '100%', maxWidth: '380px', display: 'flex' }}>
                                    <TicketCard ticket={ticket} agents={agents} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* דפי הילד (Outlet) יופיעו כאן */}
                <Outlet />
            </Box>
        </Box>
    );
}

export default TicketList;