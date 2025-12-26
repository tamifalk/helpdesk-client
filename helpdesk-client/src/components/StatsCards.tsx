import type { FunctionComponent } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import DraftsIcon from '@mui/icons-material/Drafts'; 
import PendingActionsIcon from '@mui/icons-material/PendingActions'; 
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; 
import { getStatusConfig } from "../services/ticket.service";

interface StateCardProps {
    stats: {
        id: number;
        label: string;
        count: number;
        //muiColor: "error" | "warning" | "success" | "primary";
    }[];
}

const StateCard: FunctionComponent<StateCardProps> = ({ stats }) => {
    const getIcon = (color: string) => {
        const iconStyle = { fontSize: 28 };
        switch (color) {
            case "error": return <DraftsIcon sx={iconStyle} />;
            case "warning": return <PendingActionsIcon sx={iconStyle} />;
            case "success": return <CheckCircleOutlineIcon sx={iconStyle} />;
            default: return <InfoOutlinedIcon sx={iconStyle} />;
        }
    };

    return (
        <Box sx={{ width: '100%', flexGrow: 1, py: 2}}>
            <Grid container spacing={5} justifyContent="center" alignItems="center">
                {stats.map((stat) => {
                    const config = getStatusConfig(stat.label);
                    return (
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={stat.id}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: "16px",
                                border: "1px solid #e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                minHeight: "100px",
                                minWidth: "220px",
                                backgroundColor: "#fafafa",
                                gap: 2,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                                    transform: "translateY(-8px)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    backgroundColor: config.hex,
                                    color: "#fff",
                                }}
                            >
                                {getIcon(config.color)}
                            </Box>

                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: "'Assistant', sans-serif",
                                        fontWeight: 800,
                                        fontSize: '2rem',
                                        color: "#212529",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {stat.count}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: "'Assistant', sans-serif",
                                        fontWeight: 600,
                                        color: "#6c757d",
                                        marginTop: "6px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
};

export default StateCard;