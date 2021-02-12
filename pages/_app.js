import React, { useCallback, useState } from 'react'
import useDomClean from '../lib/use-dom-clean'
import { GeistProvider, CssBaseline, useTheme } from '@geist-ui/react'
import {getDefaultProvider, Web3Provider} from "@ethersproject/providers";
import dynamic from "next/dynamic";
import {generateSignature} from "../lib/signerConnect"
import {generateIDX} from '../lib/identity'
import {definitions} from '../utils/config.json'
import { getLoginUser } from '../lib/threadDb';


// const getDefaultTheme = () =>
//   window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function MyApp({ Component, pageProps }) {

  const [themeType, setThemeType] = useState('light');
  const [provider, setProvider] = useState(null);
  const toggleDarkMode = () => setThemeType(themeType === 'dark' ? 'light' : 'dark');
  const [idx, setIdx] = useState(null);
  const [ceramic, setCeramic] = useState(null);
  const [injectedProvider, setInjectedProvider] = useState();
  const [user, setUser] = useState(0);
  const [userData, setUserData] =useState([]);
  // if (window.matchMedia) {
  //   const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   colorSchemeQuery.onchange = (e) => setThemeType(e.matches ? 'dark' : 'light');
  // }

const connectUser = async () => {
  console.log('connect')
  const {seed, metamask} = await generateSignature();
  setProvider(metamask)
  const {idx, ceramic} = await generateIDX(seed);
  setIdx(idx)
  setCeramic(ceramic)
  const threadData = await getLoginUser(idx.id)
  if(!localStorage.getItem("USER")) {
  localStorage.setItem("USER", JSON.stringify(threadData))
  }
  const data = await idx.get(definitions.profile, idx.id)
  console.log(data)
  setUserData(threadData)
  setUser((threadData && data) ? 2 : 1)
  
}


pageProps['connectUser'] = connectUser

  return (
    <GeistProvider theme={{ type: themeType }}>
      <CssBaseline />
      <Component {...pageProps} provider={provider} toggleDarkMode={toggleDarkMode} connectUser={connectUser} user={user} idx={idx} userData={userData} setUserData={setUserData}/>
    </GeistProvider>
  )
}


export default MyApp
