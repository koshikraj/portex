import React, {useState} from 'react'
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard'
import SignUp from "../components/auth/SignUp"
import { JssProvider } from 'react-jss';
const Home = (props) => {

    return (
        <JssProvider id={{ minify: true }}>
<<<<<<< HEAD
        <Layout toggleDarkMode={props.toggleDarkMode} connectUser={props.connectUser} provider={props.provider} user={props.user} handleMagicLinkWeb3={props.handleMagicLinkWeb3}>
            <SignUp user={props.user} idx={props.idx} identity={props.identity} setUserData={props.setUserData} />
=======
        <Layout toggleDarkMode={props.toggleDarkMode} connectUser={props.connectUser} provider={props.provider} user={props.user}>
            <SignUp user={props.user} idx={props.idx} identity={props.identity} setUserData={props.setUserData} setUser={props.setUser} />
>>>>>>> main
            <Dashboard idx={props.idx} user={props.user} userData={props.userData} />
        </Layout>
        </JssProvider>
    )
}
    
    
  
  export default Home;