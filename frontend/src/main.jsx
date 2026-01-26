import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#667eea',
            light: '#8b9df7',
            dark: '#4c5fd5'
        },
        secondary: {
            main: '#764ba2',
            light: '#9568c4',
            dark: '#5a3880'
        },
        success: {
            main: '#10b981'
        },
        error: {
            main: '#ef4444'
        },
        warning: {
            main: '#f59e0b'
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff'
        }
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h4: {
            fontWeight: 700
        },
        h5: {
            fontWeight: 600
        },
        h6: {
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 12
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        ...Array(20).fill('0px 16px 32px rgba(0,0,0,0.15)')
    ]
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
