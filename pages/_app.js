import React, {useState} from 'react'
import {CssBaseline, GeistProvider} from '@geist-ui/react'
import {generateSignature} from "../lib/signerConnect"
import {generateIDX} from '../lib/identity'
import {definitions} from '../utils/config.json'
import {getLoginUser, loginUserWithChallenge} from '../lib/threadDb';
import {PrivateKey} from "@textile/hub";


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
  const [identity, setIdentity] = useState(null);
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

  const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(seed))
  setIdentity(identity)
  let threadData = null
  const client = await loginUserWithChallenge(identity);
  if (client !== null) {
    //call middleWare
    setCeramic(ceramic)
    threadData = await getLoginUser(idx.id)
    if (!localStorage.getItem("USER")) {
      localStorage.setItem("USER", JSON.stringify(threadData))
    }
  }
  const data = await idx.get(definitions.profile, idx.id)
  setUserData(threadData)
  setUser((threadData && data) ? 2 : 1)
  
}


pageProps['connectUser'] = connectUser

  return (
    <GeistProvider theme={{ type: themeType }}>
      <CssBaseline />
      <Component
          {...pageProps}
          provider={provider}
          toggleDarkMode={toggleDarkMode}
          connectUser={connectUser}
          user={user}
          idx={idx}
          userData={userData}
          identity={identity}
          setUserData={setUserData}
          setUser={setUser}
      />
    </GeistProvider>
  )
}


export default MyApp
