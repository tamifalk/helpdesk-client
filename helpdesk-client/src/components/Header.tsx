import type { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { Avatar, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink } from 'react-router-dom';

interface HeaderProps {

}

const Header: FunctionComponent<HeaderProps> = () => {
    const { user, logout } = useAuth();
    const customFont = "'Assistant', sans-serif";

    return (
        
            <Box sx={{ 
                width: '100%', 
                bgcolor: 'white', 
                // שימוש ב-fixed מבטיח הצמדה מוחלטת
                position: 'fixed', 
                top: 0, 
                left: 0,
                right: 0,
                zIndex: 1200, 
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                // גובה קבוע להדר (אפשר לשנות לפי הצורך)
                height: '90px', 
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container 
                    maxWidth={false} 
                    sx={{ 
                        px: { xs: 2, md: 5 }, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' 
                    }}
                >
                {/* לוגו כקישור לעמוד הבית/כניסה */}
                <Stack
                    component={RouterLink}
                    to={user ? "/dashboard" : "#"}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 0.8,
                        borderRadius: 2,
                        display: 'flex',
                        boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
                    }}>
                        <ManageAccountsIcon fontSize="medium" />
                    </Box>
                    <Typography variant="h6" sx={{
                        fontWeight: 800,
                        fontFamily: customFont,
                        letterSpacing: 0.5,
                        color: '#1a2027'
                    }}>
                        HelpDesk <Box component="span" sx={{ color: 'primary.main' }}>Pro</Box>
                    </Typography>
                </Stack>

                {/* צד שמאל - מציג פרטי משתמש והתנתקות רק אם יש משתמש מחובר */}
                {user ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            bgcolor: '#f1f5f9',
                            px: 2,
                            py: 0.7,
                            borderRadius: 5
                        }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                                {user.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: customFont, color: 'text.primary' }}>
                                {user.name}
                            </Typography>
                        </Box>

                        <Tooltip title="התנתק">
                            <IconButton onClick={logout} size="small" sx={{ color: 'error.main' }}>
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ) : (
                    /* אם אין משתמש (למשל בעמוד כניסה), נציג את הטקסט המקורי שלך */
                    <Typography variant="body2" sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontFamily: customFont,
                        bgcolor: '#f1f5f9',
                        px: 2,
                        py: 0.5,
                        borderRadius: 5
                    }}>
                        זמינות מערכת: 24/6
                    </Typography>
                )}

            </Container>
            <Divider sx={{ opacity: 0.6 }} />
        </Box>
    );
}

export default Header;