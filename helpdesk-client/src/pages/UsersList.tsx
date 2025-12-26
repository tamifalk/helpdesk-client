import { useEffect, type FunctionComponent } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import type { IUser } from "../types/auth.types";
import Button from "@mui/material/Button";
import { Link as RouterLink } from 'react-router-dom';
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Avatar, Chip, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { showErrorAlert } from "../utils/alerts";

interface UsersListProps {

}

const UsersList: FunctionComponent<UsersListProps> = () => {
    const users = useLoaderData() as IUser[];

    useEffect(() => {
        if (!users || (Array.isArray(users) && users.length === 0)) {
            showErrorAlert("לא הצלחנו לטעון את רשימת המשתמשים. נסה שוב מאוחר יותר.");
        }
    }, [users]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'agent': return 'primary';
            default: return 'default';
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            
                px: { xs: 3, md: 6 } ,
                py: { xs: 2, sm: 4 },
                mt: 10
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 1100 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                textAlign: { xs: 'center', sm: 'right' }
                            }}
                        >
                            ניהול משתמשי מערכת
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            component={RouterLink}
                            to="new" 
                            sx={{
                                borderRadius: '10px',
                                fontWeight: 600,
                                px: 3,
                                width: { xs: '100%', sm: 'auto' },
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                            }}
                        >
                            הוסף משתמש
                        </Button>
                    </Stack>

                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            overflowX: 'auto',
                            mx: 'auto',
                            width: '100%',
                            maxWidth: 980,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Table sx={{ minWidth: 650, mx: 'auto' }}>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>משתמש</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>אימייל</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>תפקיד</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>פעולות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user: IUser) => (
                                    <TableRow
                                        key={user.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                sx={{ width: '100%' }}
                                            >
                                                <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {user.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">{user.email}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={getRoleColor(user.role) as any}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                size="small"
                                                component={RouterLink}
                                                to={`/dashboard/users/${user.id}`}
                                                startIcon={<PersonOutlineIcon />}
                                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                                            >
                                                צפה בפרטים
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Outlet />
            </Box>
        </Box>
    );
}

export default UsersList;