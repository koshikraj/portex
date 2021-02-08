import React, { useEffect, useState } from 'react'
import useDomClean from '../lib/use-dom-clean'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/react'


// const getDefaultTheme = () =>
//   window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function MyApp({ Component, pageProps }) {

  const [themeType, setThemeType] = useState('light');
  const toggleDarkMode = () => setThemeType(themeType === 'dark' ? 'light' : 'dark');
  pageProps['toggleDarkMode'] = toggleDarkMode

  // if (window.matchMedia) {
  //   const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   colorSchemeQuery.onchange = (e) => setThemeType(e.matches ? 'dark' : 'light');
  // }

  return (
    <GeistProvider theme={{ type: themeType }}>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}
export default MyApp
