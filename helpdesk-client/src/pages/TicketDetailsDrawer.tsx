import { Box, Chip, Divider, Drawer, IconButton, Stack, Typography, TextField, Button } from "@mui/material";
import { useState, useRef, useEffect, type FunctionComponent } from "react";
import type { TicketComment } from "../types/ticket.types";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useTickets } from "../context/TicketsContext";
import { useAuth } from "../context/AuthContext";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";

interface TicketDetailsDrawerProps {

}

const TicketDetailsDrawer: FunctionComponent<TicketDetailsDrawerProps> = () => {
    const [commentText, setCommentText] = useState("");
    const { user } = useAuth();
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const { addNewComment } = useTickets();
    const navigate = useNavigate();
    const ticket = useLoaderData();
    const revalidator = useRevalidator();
    const { isProcessing,setIsProcessing } = useAuth();
    const isAdmin = user?.role === 'admin'

    const customFont = "'Assistant', sans-serif";

    if (!ticket) return null;

    // סגירת ה-Drawer 
    const handleClose = () => {
        navigate("/dashboard/tickets");
    };

    // פונקציה לגלילה לתחתית
    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // גלילה בכל פעם שנוספת תגובה או שהחלונית נפתחת
    useEffect(() => {
        if (ticket?.comments) scrollToBottom();
    }, [ticket?.comments]);

    //הוספת תגובה
    const handleSendComment = async () => {
        if (!commentText.trim() || !ticket) return;
        try {
            setIsProcessing(true);
            await addNewComment(ticket.id, commentText);
            setCommentText('');
            revalidator.revalidate(); // מרענן את הנתונים מה-Loader
        } catch (error) {
            console.error("Failed to send comment", error);
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <Drawer
            anchor="left"
            open={true}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 450 },
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: customFont,
                    borderTopRightRadius: '20px',
                    borderBottomRightRadius: '20px',
                }
            }}
        >
            {ticket && (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                    {/* כותרת - קבועה למעלה */}
                    <Box sx={{ p: 3, bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                        <Typography variant="h6" sx={{ fontFamily: customFont, fontWeight: 800 }}>
                            פרטי פנייה #{ticket.id} 
                        </Typography>
                        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
                    </Box>

                    {/* תוכן ותגובות - אזור נגלל */}
                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#fff' }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: customFont, fontWeight: 700, mb: 1 }}>
                            {ticket.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: customFont }}>
                            {ticket.description}
                        </Typography>

                        <Divider sx={{ my: 2 }}>
                            <Chip label="שיחת צ'אט" size="small" sx={{ fontFamily: customFont, fontSize: '0.75rem' }} />
                        </Divider>

                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {ticket.comments && ticket.comments.length > 0 ? (
                                ticket.comments.map((comment: TicketComment) => {
                                    const isMe = user?.id && comment.author_id === user.id;

                                    return (
                                        <Box
                                            key={comment.id}
                                            sx={{
                                                p: 2,
                                                bgcolor: isMe ? '#E3F2FD' : '#f1f3f4',
                                                color: '#303030',
                                                borderRadius: isMe ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                                alignSelf: isMe ? 'flex-start' : 'flex-end',
                                                maxWidth: '85%',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            {!isMe && (
                                                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, fontFamily: customFont, color: '#1a73e8' }}>
                                                    {comment.author_name}
                                                </Typography>
                                            )}

                                            <Typography variant="body2" sx={{ fontFamily: customFont, whiteSpace: 'pre-wrap' }}>
                                                {comment.content}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    opacity: 0.6,
                                                    display: 'block',
                                                    mt: 1,
                                                    textAlign: 'left',
                                                    fontSize: '0.65rem',
                                                    fontFamily: customFont
                                                }}
                                            >
                                                {comment.created_at ? (() => {
                                                    const date = new Date(comment.created_at);

                                                    const day = date.getDate();
                                                    const month = date.toLocaleDateString('he-IL', { month: 'short' }); // מוציא רק את שם החודש (בדצמ׳)
                                                    const time = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

                                                    return ` ${time} ,${month} ${day}   `;
                                                })() : '--:--'}
                                            </Typography>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography sx={{ textAlign: 'center', color: 'text.disabled', mt: 4, fontFamily: customFont }}>
                                    אין עדיין תגובות בטיקט זה.
                                </Typography>
                            )}
                            <div ref={commentsEndRef} />

                            <div ref={commentsEndRef} />
                            {/* העוגן לגלילה */}
                            <div ref={commentsEndRef} />
                        </Stack>
                    </Box>

                    {/* אזור ה-Input רק לסוכן ולקוח*/}
                    {!isAdmin && (
                        <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee', boxShadow: '0 -2px 10px rgba(0,0,0,0.03)' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    placeholder="כתוב תגובה..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: '15px', bgcolor: '#f8f9fa' },
                                        '& .MuiInputBase-input': { fontFamily: customFont }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSendComment}
                                    disabled={!commentText.trim() || isProcessing}
                                    sx={{
                                        borderRadius: '12px',
                                        minWidth: '45px',
                                        height: '45px',
                                        bgcolor: '#1A2027',
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    <SendIcon sx={{ transform: 'rotate(180deg)', fontSize: '1.1rem' }} />
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
            )}
        </Drawer >
    );
}

export default TicketDetailsDrawer;