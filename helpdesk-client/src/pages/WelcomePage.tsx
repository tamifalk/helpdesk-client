import type { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Stack, Grid as Grid } from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import UpdateIcon from '@mui/icons-material/Update';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import Header from "../components/Header";

const WelcomePage: FunctionComponent = () => {
    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                width: '100vw',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                bgcolor: '#ffffff',
                position: 'relative',
                overflowX: 'hidden',
                mt:7,
                "& *": { fontFamily: "'Assistant', sans-serif !important" }
            }}
        >
            <Header />

            <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
                
                {/* לוגו מרכזי מעוצב */}
                <Box sx={{ 
                    mb: 4, 
                    display: 'inline-flex', 
                    p: 4, 
                    borderRadius: '50%', 
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                    <ManageAccountsIcon sx={{ fontSize: 100, color: 'primary.main' }} />
                </Box>

                <Typography 
                    variant="h2" 
                    sx={{ 
                        fontWeight: 900, 
                        fontSize: { xs: '2.5rem', md: '3.8rem' },
                        mb: 2,
                        color: '#1a2027',
                        lineHeight: 1.1
                    }}
                >
                    ניהול פניות <Box component="span" sx={{ color: 'primary.main' }}>חכם ומקצועי</Box>
                </Typography>

                <Typography variant="h5" sx={{ mb: 8, color: '#64748b', maxWidth: '750px', mx: 'auto', fontWeight: 500 }}>
                    הפלטפורמה המתקדמת ביותר לניהול קשרי לקוחות ותמיכה טכנית. 
                    פתרונות שירות מקיפים לעסק שלך, בזמינות מלאה 24/6.
                </Typography>

                <Grid container spacing={5} sx={{ mb: 10 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AdvantageItem 
                            icon={<BoltIcon sx={{ fontSize: 35 }} />} 
                            title="ביצועי שיא" 
                            description="ממשק עבודה מהיר במיוחד ללא זמני טעינה"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AdvantageItem 
                            icon={<ShieldMoonIcon sx={{ fontSize: 35 }} />} 
                            title="אבטחה רב-שכבתית" 
                            description="הצפנת נתונים והגנה על המידע הארגוני"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AdvantageItem 
                            icon={<UpdateIcon sx={{ fontSize: 35 }} />} 
                            title="סנכרון בזמן אמת" 
                            description="עדכונים חיים על כל פנייה לכל צוות התמיכה"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <AdvantageItem 
                            icon={<HeadsetMicIcon sx={{ fontSize: 35 }} />} 
                            title="מענה 24/6" 
                            description="אנחנו כאן לרשותך לאורך כל ימי הפעילות"
                        />
                    </Grid>
                </Grid>

                {/* כפתור כניסה */}
                <Box>
                    <Button 
                        component={RouterLink} 
                        to="/login" 
                        variant="contained" 
                        size="large" 
                        sx={{ 
                            px: 7, 
                            py: 1.8, 
                            borderRadius: 20, 
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: '0 10px 25px rgba(25, 118, 210, 0.25)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                                transform: 'translateY(-3px)', 
                                boxShadow: '0 15px 35px rgba(25, 118, 210, 0.35)' 
                            }
                        }}
                    >
                        כניסה למערכת
                    </Button>
                </Box>
            </Container>

            {/* פוטר */}
            <Box sx={{ position: 'absolute', bottom: 25, color: '#94a3b8', width: '100%', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                    © {new Date().getFullYear()} HELPDESK PRO | SMART TICKETING SYSTEM
                </Typography>
            </Box>
        </Box>
    );
};

// קומפוננטת עזר ליתרונות כולל אנימציית Hover
const AdvantageItem = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
    <Stack 
        direction="row" 
        spacing={3} 
        justifyContent="center" 
        alignItems="center"
        sx={{
            p: 2,
            borderRadius: 4,
            transition: 'all 0.3s ease-in-out',
            cursor: 'default',
            '&:hover': {
                transform: 'scale(1.05)',
                bgcolor: '#fcfdfe',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                '& .icon-box': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'rotate(5deg)'
                }
            }
        }}
    >
        <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.3 }}>
                {description}
            </Typography>
        </Box>

        <Box 
            className="icon-box"
            sx={{ 
                bgcolor: '#eff6ff', 
                p: 2, 
                borderRadius: 2.5, 
                display: 'flex', 
                color: 'primary.main',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)' 
            }}
        >
            {icon}
        </Box>
    </Stack>
);

export default WelcomePage;