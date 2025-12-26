import { Paper, Box, Typography, Chip, Button, Stack, Menu, MenuItem } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { Ticket, TicketUpdateFields } from "../types/ticket.types";
import { getStatusConfig } from "../services/ticket.service";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from "react-router-dom";
import type { IUser } from "../types/auth.types";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

interface TicketCardProps {
    ticket: Ticket;
    agents: IUser[]
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, agents }) => {

    const statusInfo = getStatusConfig(ticket.status_name);// קבלת מידע על הסטטוס (צבע, תווית וכו')
    const { user, setIsProcessing } = useAuth();
    const { statuses, updateTicketData, deleteTicketFromContext } = useTickets();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [agentAnchorEl, setAgentAnchorEl] = useState<null | HTMLElement>(null);

    const canEditStatus = user?.role === 'agent' || user?.role === 'admin';
    const canEditAgent = user?.role === 'admin';


    //העברה לעמוד טיקט
    const handleSelectTicket = async () => {
        navigate(`/dashboard/tickets/${ticket.id}`);
    }

    //פונקציה לפתיחת תפריט שינוי סטטוס
    const handleOpenStatusMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (user?.role === 'agent' || user?.role === 'admin') {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
        }
    };

    //פונקציה לפתיחת תפריט שינוי סוכן
    const handleOpenAgentMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (user?.role == "admin") {
            event.stopPropagation();
            setAgentAnchorEl(event.currentTarget);
        }
    };

    //פונקצית מחיקת טיקט
    const handleDelete = (ticketId: number) => {
        Swal.fire({
            title: "האם את בטוחה?",
            text: "לא ניתן יהיה לשחזר את הפנייה לאחר המחיקה!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#d33",
            confirmButtonText: "כן, מחק!",
            cancelButtonText: "ביטול",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsProcessing(true);
                    const success = await deleteTicketFromContext(ticketId);

                    if (success) {
                        Swal.fire({
                            title: "נמחק!",
                            text: "הפנייה נמחקה בהצלחה מהמערכת.",
                            icon: "success",
                            timer: 2000, // נסגר אוטומטית אחרי 2 שניות
                            showConfirmButton: false
                        });
                    }
                }
                finally {
                    setIsProcessing(false);
                }
            }
        });
    };

    //פונקצית עדכון סוכן/סטטוס
    const handleUpdate = async (dataToUpdate: TicketUpdateFields) => {
        setAnchorEl(null);
        setAgentAnchorEl(null);
        try {
            await updateTicketData(ticket.id, dataToUpdate);
            showSuccessAlert("העדכון בוצע בהצלחה!");
        } catch (error: any) {
            const msg = error.response?.data?.message || "לא הצלחנו לעדכן את הפנייה";
            showErrorAlert(msg);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0, mb: 4, borderRadius: '24px', bgcolor: '#ffffff',
                overflow: 'hidden', maxWidth: '600px', minWidth: '360px', mx: 'auto',
                position: 'relative',
                transition: 'all 0.4s ease',
                borderRight: `2px solid ${statusInfo.hex}`,
                boxShadow: `0 10px 30px -10px ${statusInfo.hex}40`, 
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px -12px ${statusInfo.hex}60`, 
                }
            }}
        >
            {/*פרטי שולח (רק לסוכן) + עדיפות ותאריך (לכולם) */}
            <Box sx={{ bgcolor: '#fbfcfd', p: 2, px: 4, borderBottom: '1px solid #f0f0f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">

                    {/* צד ימין: פרטי שולח (מוצג רק לסוכן/מנהל) */}
                    <Box>
                        {(user?.role === 'agent' || user?.role === 'admin') ? (
                            <>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A2027' }}>
                                    {ticket.created_by_name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#667085' }}>
                                    {ticket.created_by_email}
                                </Typography>
                            </>
                        ) : (
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#667085' }}>
                                פנייה #{ticket.id}
                            </Typography>
                        )}
                    </Box>

                    {/* צד שמאל: עדיפות ותאריך (מוצג לכולם) */}
                    <Stack alignItems="flex-end" spacing={0.5}>
                        <Chip
                            label={ticket.priority_name}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.7rem', height: '20px' }}
                        />
                        <Typography sx={{ fontSize: '0.7rem', color: '#98A2B3', fontWeight: 500 }}>
                            {new Date(ticket.created_at).toLocaleDateString('he-IL')}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{ p: 4, pt: (user?.role === 'customer' ? 4 : 3), textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#101828', mb: 1.5 }}>
                    {ticket.subject}
                </Typography>

                <Typography sx={{
                    fontSize: '0.95rem', color: '#475467', lineHeight: 1.6, mb: 4,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                    {ticket.description}
                </Typography>

                {/* שורת סטטוס וסוכן */}
                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mb: 4, p: 1.5, bgcolor: '#f4f8fdff', borderRadius: '16px' }}
                >
                    {/* סלקט סטטוס דינמי */}
                    <Box
                        onClick={handleOpenStatusMenu}
                        sx={{
                            cursor: canEditStatus ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '8px',
                            transition: '0.2s',
                            '&:hover': canEditStatus ? { bgcolor: '#eaecf0' } : {}
                        }}
                    >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: `${statusInfo.color}.main` }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#344054' }}>
                            {statusInfo.label}
                        </Typography>
                        {canEditStatus && <KeyboardArrowDownIcon sx={{ fontSize: '1.1rem', color: '#98A2B3' }} />}
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{ sx: { borderRadius: '12px', minWidth: 150 } }}
                    >
                        {statuses.map((status) => (
                            <MenuItem
                                key={status.id}
                                onClick={() => handleUpdate({ status_id: status.id })}
                                selected={status.name === ticket.status_name}
                            >
                                {status.name}
                            </MenuItem>
                        ))}
                    </Menu>

                    <Box sx={{ width: '1px', bgcolor: '#eaecf0', height: '20px', alignSelf: 'center', mx: 1 }} />

                    {/* סלקט סוכן דינמי */}
                    <Box
                        onClick={handleOpenAgentMenu}
                        sx={{
                            cursor: canEditAgent ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '8px',
                            transition: '0.2s',
                            '&:hover': canEditAgent ? { bgcolor: '#eaecf0' } : {}
                        }}
                    >
                        <Typography sx={{ fontSize: '0.9rem', color: '#667085' }}>מטופל ע"י:</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#344054' }}>
                            {ticket.assigned_to_name || 'ממתין'}
                        </Typography>
                        {canEditAgent && <KeyboardArrowDownIcon sx={{ fontSize: '1.1rem', color: '#98A2B3' }} />}
                    </Box>

                    <Menu
                        anchorEl={agentAnchorEl}
                        open={Boolean(agentAnchorEl)}
                        onClose={() => setAgentAnchorEl(null)}
                        PaperProps={{ sx: { borderRadius: '12px', minWidth: 180, maxHeight: 300 } }}
                    >
                        <Typography sx={{ px: 2, py: 1, fontSize: '0.75rem', fontWeight: 700, color: 'text.disabled' }}>
                            :ניתוב לסוכן
                        </Typography>
                        {agents.map((agent) => (
                            <MenuItem
                                key={agent.id}
                                onClick={() => handleUpdate({ assigned_to: agent.id })}
                                selected={agent.id === ticket.assigned_to}
                            >
                                {agent.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Stack>

                {/* כפתורי פעולה */}
                <Stack spacing={2} alignItems="center">
                    <Button
                        onClick={handleSelectTicket}
                        variant="contained"
                        disableElevation
                        startIcon={<ChatBubbleOutlineIcon sx={{ ml: 1 }} />}
                        sx={{ width: '200px', py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                    >
                        צפה בתגובות
                    </Button>

                    {user?.role === 'admin' && (
                        <Button
                            onClick={() => handleDelete(ticket.id)}
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon sx={{ ml: 0.5 }} />}
                            sx={{
                                fontWeight: 600, fontSize: '0.8rem', opacity: 0.6,
                                '&:hover': { opacity: 1, bgcolor: 'transparent', textDecoration: 'underline' }
                            }}
                        >
                            מחק פנייה
                        </Button>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
};
export default TicketCard;