import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                    textAlign: 'center',
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                    404
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
                    אופס! הדף שחיפשת לא קיים.
                </Typography>
                <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/dashboard"
                    sx={{ borderRadius: '10px', px: 4 }}
                >
                    חזרה למסך הבית
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;