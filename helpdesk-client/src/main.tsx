import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import TicketsProvider from './context/TicketsContext.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react' // בלי macro!
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// 2. יצירת Theme עם כיוון RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    // זה יגדיר את הפונט לכל רכיבי MUI
    fontFamily: "'Assistant', sans-serif", 
    // זה מוודא שגם כותרות וגם טקסט רץ ישתמשו בפונט הזה
    h1: { fontFamily: "'Assistant', sans-serif" },
    h2: { fontFamily: "'Assistant', sans-serif" },
    h3: { fontFamily: "'Assistant', sans-serif" },
    h4: { fontFamily: "'Assistant', sans-serif" },
    h5: { fontFamily: "'Assistant', sans-serif" },
    h6: { fontFamily: "'Assistant', sans-serif" },
    button: { fontFamily: "'Assistant', sans-serif", fontWeight: 600 },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
    <AuthProvider>
      <TicketsProvider>
      <App />
      </TicketsProvider>
    </AuthProvider>
    </div>
    </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
)
