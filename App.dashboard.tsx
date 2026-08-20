import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import DashboardContainer from './src/components/DashboardContainer';
import theme from './src/theme';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const App: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashboardContainer />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;