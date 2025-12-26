import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

// נתוני דמה - בהמשך יוחלפו בנתונים מה-API
const data = [
  { name: 'א׳', count: 4 },
  { name: 'ב׳', count: 7 },
  { name: 'ג׳', count: 5 },
  { name: 'ד׳', count: 10 },
  { name: 'ה׳', count: 8 },
  { name: 'ו׳', count: 3 },
  { name: 'ש׳', count: 2 },
];

interface TicketsChartProps {
  title?: string;
  dataKeyName?: string;
}

export const TicketsChart = ({ 
  title = "פעילות שבועית", 
  dataKeyName = "פניות" 
}: TicketsChartProps) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        pt: 4, 
        borderRadius: '24px', 
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        width: '100%',
        height: 400,
        direction: 'rtl',
        bgcolor: 'white'
      }}
    >
      <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, color: '#1e293b' }}>
        {title}
      </Typography>
      
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {/* עברנו ל-AreaChart למראה מודרני יותר עם מילוי צבע עדין */}
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                direction: 'rtl',
                textAlign: 'right'
              }}
              labelStyle={{ fontWeight: 800, color: '#1e293b' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorCount)"
              name={dataKeyName}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};