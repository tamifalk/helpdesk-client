import { useEffect, type FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import { getStatusConfig } from "../services/ticket.service";
import { useTickets } from "../context/TicketsContext";
import StateCard from "../components/StatsCards";
import { Box, Divider, Drawer, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import Header from "../components/Header";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import { TicketsChart } from "../components/TicketsChart";
import { showErrorAlert } from "../utils/alerts";

interface DashboardProps {

}

const drawerWidth = 300;

const Dashboard: FunctionComponent<DashboardProps> = () => {
    const { user, isProcessing } = useAuth();
    const { tickets, statuses, refreshTickets, refreshStatuses } = useTickets();
    const navigation = useNavigation();
    const location = useLocation();
    const isLoading = navigation.state === "loading" || isProcessing;

    const isMainDashboard = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    const isUsers = location.pathname.startsWith("/dashboard/users"); 
      //קבלת רשימת טיקטים ורשימת סטטוסים 
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    refreshTickets(),
                    refreshStatuses()

                ])
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
                showErrorAlert("לא הצלחנו לטעון את נתוני המערכת. וודא שאתה מחובר ונסה שוב.");
            }
        };
        fetchData();
    }, []);

    // חישוב מספר טיקטים לפי סטטוס
    const rawCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.status_name] = (acc[ticket.status_name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // יצירת סיכום סטטיסטיקות להצגה בכרטיסי הסטטוס
    const statsSummary = statuses.map(status => {
        const config = getStatusConfig(status.name);

        return {
            id: status.id,
            label: status.name,
            count: rawCounts[status.name] || 0,
            muiColor: config.color
        };

    });

    // תוכן מותאם לפי תפקיד המשתמש
    const roleContent = {
        admin: {
            title: `שלום, מנהל מערכת - ${user?.name}`,
            subtitle: "לפניך תמונת מצב כוללת של כל הפניות במערכת. באפשרותך לעקוב אחר עומסים, לנהל משתמשים ולוודא שכל פנייה מקבלת מענה הולם בזמן.",
        },
        agent: {
            title: `שלום, ${user?.name}`,
            subtitle: "אלו הפניות הממתינות לטיפולך או נמצאות באחריותך. שים לב לעדיפויות וודא עדכון סטטוס שוטף מול הלקוחות.",
        },
        customer: {
            title: `שלום, ${user?.name}`,
            subtitle: "כאן תוכל לעקוב אחר מצב הפניות שפתחת. אנחנו פועלים לטיפול מהיר ויעיל בכל בקשה שלך.",
        }
    };

    const currentContent = roleContent[user?.role as keyof typeof roleContent] || roleContent.customer;


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            {isLoading && (
                <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 3000 }} />
            )}

            {/* Sidebar - תפריט צד מודרני */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        bgcolor: '#0F172A',
                        color: '#F8FAFC',
                        borderLeft: 'none',
                        boxShadow: '10px 0 15px -3px rgba(0,0,0,0.1)'
                    },
                }}
            >
                {/* לוגו / כותרת עליונה */}
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#38BDF8', letterSpacing: '1px' }}>
                        TICKET PRO
                    </Typography>
                </Box>

                <List sx={{ px: 2, mt: 2 }}>
                    {/* טאב דף הבית - לכולם */}
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton
                            component={RouterLink}
                            to="/dashboard"
                            selected={isMainDashboard}
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38BDF8',
                                    '& .MuiListItemIcon-root': { color: '#38BDF8' }
                                },
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: '45px' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>דף הבית</Typography>} />
                        </ListItemButton>
                    </ListItem>

                    {/* טאב הפניות שלי - לכולם */}
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton
                            component={RouterLink}
                            to="/dashboard/tickets"
                            selected={location.pathname === "/dashboard/tickets"}
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: '45px' }}>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>הפניות שלי</Typography>} />
                        </ListItemButton>
                    </ListItem>

                    {/* טאב הוספת פניה - ללקוח בלבד */}
                    {user?.role === 'customer' && (
                        <ListItem disablePadding sx={{ mb: 2 }}>
                            <ListItemButton
                                component={RouterLink}
                                to="/dashboard/tickets/new"
                                selected={location.pathname === "/dashboard/tickets/new"}
                                sx={{
                                    py: 2,
                                    borderRadius: '12px',
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(56, 189, 248, 0.15)',
                                        color: '#38BDF8',
                                        '& .MuiListItemIcon-root': { color: '#38BDF8' }
                                    },
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.05)'
                                    }
                                }}

                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: '45px' }}>
                                    <AddIcon /> {/* ודאי שייבאת את AddIcon מ-@mui/icons-material/Add */}
                                </ListItemIcon>
                                <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>פתיחת פנייה חדשה</Typography>} />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* ניהול מערכת - רק לאדמין */}
                    {user?.role === 'admin' && (
                        <>
                            <Box sx={{ mt: 4, mb: 2, px: 3 }}>
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, mt: 2, display: 'block' }}>
                                    ניהול מערכת
                                </Typography>
                            </Box>

                            <ListItem disablePadding sx={{ mb: 2 }}>
                                <ListItemButton
                                    component={RouterLink}
                                    to="/dashboard/users"
                                    selected={location.pathname.includes("/dashboard/users")}
                                    sx={{
                                        py: 2,
                                        borderRadius: '12px',
                                        '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'white', minWidth: '45px' }}>
                                        <PeopleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>ניהול משתמשים</Typography>} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={RouterLink}
                                    to="/dashboard/settings"
                                    selected={location.pathname === "/dashboard/settings"}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '12px',
                                        '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }
                                    }}
                                >
                                </ListItemButton>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>

            {/*תוכן הדף*/}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    // mr: { sm: `${drawerWidth}px` },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#F8FAFC',
                }}
            >
                <Header />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        pt: { xs: 4, sm: 5 },
                        width: '100%',
                        boxSizing: 'border-box',                       
                        // התיקון כאן: שימוש ב-spread operator
                        ...(isMainDashboard || isUsers
                            ? { pr: { xs: 3, md: 50 }, pl: { xs: 3, md: 6 } }
                            : { pr: { xs: 3, md: 20 }, pl: { xs: 3, md: 20 } , minWidth: 1600,}
                        ),
                    }}
                >
                    {isMainDashboard ? (
                        <Box sx={{ width: '100%', textAlign: 'center' , minWidth: '900px'}}>
                            <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
                                <Box sx={{ mb: 4, mt: 12 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}
                                    >
                                        {currentContent.title}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#475569',
                                            fontSize: '1.1rem',
                                            width: '100%',
                                            lineHeight: 1.6,
                                            fontWeight: 500
                                        }}
                                    >
                                        {currentContent.subtitle}
                                    </Typography>

                                    {/* הקו עכשיו ימתח מקצה לקצה של ה-Padding שקבענו */}
                                    <Divider
                                        sx={{
                                            mt: 3,
                                            width: '100%',
                                            borderBottomWidth: 4,
                                            borderColor: '#38BDF8',
                                            borderRadius: 1
                                        }}
                                    />
                                </Box>

                                <Box sx={{ width: '100%' }}>
                                    <StateCard stats={statsSummary} />
                                </Box>
                                <TicketsChart
                                    title={
                                        user?.role === 'admin' ? "עומס פניות במערכת" :
                                            user?.role === 'agent' ? "הספק טיפול בפניות" :
                                                "מעקב פניות שבועי"
                                    }
                                    dataKeyName={user?.role === 'customer' ? "פניות שפתחתי" : "פניות בטיפול"}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <Outlet />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box >

    );
};



export default Dashboard;