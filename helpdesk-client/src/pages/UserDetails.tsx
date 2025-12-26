import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Avatar,
    Divider,
    Stack,
    Chip,
    Paper,
    Grid
} from "@mui/material";
import type { FunctionComponent } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';



interface UsersDetailsProps {

}

const UsersDetails: FunctionComponent<UsersDetailsProps> = () => {
    const user = useLoaderData();
    const navigate = useNavigate();
    const customFont = "'Assistant', sans-serif";

    // חזרה לרשימה בסגירה
    const handleClose = () => {
        navigate("/dashboard/users");
    };


    return (<Dialog
        open={true}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
            sx: { borderRadius: '20px', p: 1 }
        }}
    >
        {/* כפתור סגירה */}
        <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary' }}
        >
            <CloseIcon />
        </IconButton>

        <DialogContent>
            {/* הדר עם אווטאר ושם */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, mt: 2 }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '2.5rem',
                        mb: 2,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    {user.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: customFont }}>
                    {user.name}
                </Typography>
                <Chip
                    label={user.role}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1, textTransform: 'uppercase', fontWeight: 600 }}
                />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* פרטי המשתמש ברשת (Grid) */}
            <Grid container spacing={3}>
                {/* אימייל */}
                <Grid size={{ xs: 12 }}>
                    <Paper variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'left', // מרכז את הכל אופקית
                            flexDirection: 'row-reverse', // שם את האייקון מימין לטקסט
                            gap: 2
                        }}
                    >
                        <EmailIcon color="action" />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: customFont }}>כתובת אימייל</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: customFont }}>{user.email}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* מזהה מערכת ותאריך הצטרפות */}
                <Grid size={{ xs: 6 }}>
                    <Stack
                        direction="row-reverse" // האייקון יעבור לצד ימין של הטקסט
                        spacing={1}
                        alignItems="center"
                        justifyContent="center" // מרכז את הסטאק בתוך ה-Grid
                        sx={{ width: '100%' }}
                    >
                        <BadgeIcon fontSize="small" color="disabled" />
                        <Typography variant="body2" sx={{ fontFamily: customFont }}>מזהה: {user.id}</Typography>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Stack
                        direction="row-reverse" // האייקון יעבור לצד ימין של הטקסט
                        spacing={1}
                        alignItems="center"
                        justifyContent="center" // מרכז את הסטאק בתוך ה-Grid
                        sx={{ width: '100%' }}
                    >
                        <CalendarMonthIcon fontSize="small" color="disabled" />
                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                            הצטרף ב: {new Date(user.created_at || '').toLocaleDateString('he-IL')}
                        </Typography>
                    </Stack>
                </Grid>

                {/* סטטוס פעילות */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        bgcolor: user.is_active ? '#edf7ed' : '#fdeded',
                        borderRadius: '12px'
                    }}>
                        {user.is_active ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CheckCircleIcon color="success" />
                                <Typography color="success.main" fontWeight={700} sx={{ fontFamily: customFont }}>חשבון פעיל</Typography>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CancelIcon color="error" />
                                <Typography color="error.main" fontWeight={700} sx={{ fontFamily: customFont }}>חשבון מושבת</Typography>
                            </Stack>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
    );
};

export default UsersDetails;