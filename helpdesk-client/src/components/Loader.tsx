import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: "column",
        // צבע הרקע - שחור עם 50% שקיפות
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        // אופציונלי: טשטוש קל של הרקע שמאחורה (נראה מאוד יוקרתי)
        backdropFilter: "blur(4px)", 
      }}
      open={true} // תמיד פתוח כשהקומפוננטה מרונדרת
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 300, letterSpacing: 1 }}>
          מאמת נתונים...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;