import { Box, Button, MenuItem, TextField } from "@mui/material";
import { type FunctionComponent } from "react";
import { useTickets } from "../context/TicketsContext";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (newTerm: string) => void;
    sortBy: "date" | "priority";
    onSortChange: (newSort: "date" | "priority") => void;
    statusFilter: string | null;
    onStatusChange: (newStatus: string | null) => void;
}

const FilterBar: FunctionComponent<FilterBarProps> = ({ searchTerm, onSearchChange, sortBy, onSortChange, statusFilter, onStatusChange }) => {
    const { statuses } = useTickets();

    return (<Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        mb: 6,
        mt: 6,
        flexShrink: 0
    }}>

        {/* שורת הפילטרים */}
        <Box sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            bgcolor: '#f8f9fa',
            p: 3,
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            width: 'fit-content'
        }}>
            {/* שדה חיפוש חופשי */}
            <TextField
                placeholder="חיפוש..."
                size="small"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{
                    width: '300px',
                    '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'white' }
                }}
            />

            {/* בחירת מיון */}
            <TextField
                select
                label="מיין לפי"
                size="small"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as "date" | "priority")}
                sx={{ minWidth: '150px', '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'white' } }}
            >
                <MenuItem value="date">תאריך</MenuItem>
                <MenuItem value="priority">עדיפות</MenuItem>
            </TextField>

            {/* בחירת סינון לפי סטטוס */}
            <TextField
                select
                label="סטטוס"
                size="small"
                value={statusFilter || "all"}
                onChange={(e) => onStatusChange(e.target.value === "all" ? null : e.target.value)}
                sx={{ minWidth: '150px', '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'white' } }}
            >
                <MenuItem value="all">כל הסטטוסים</MenuItem>

                {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                        {status.name}
                    </MenuItem>
                ))}
            </TextField>
            {/* כפתור איפוס סינונים - מופיע רק כשמשהו מסונן */}
            {(searchTerm || statusFilter) && (
                <Button
                    onClick={() => { onSearchChange(""); onStatusChange(null); }}
                    sx={{ fontFamily: 'Assistant', color: 'text.secondary' }}
                >
                    נקה הכל
                </Button>
            )}
        </Box>
    </Box>
    );
}

export default FilterBar;