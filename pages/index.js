import {useState} from 'react'
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard'
import SignUp from "../components/auth/SignUp"
import { JssProvider } from 'react-jss';
const Home = (props) => {
  
    
    return (
        <JssProvider id={{ minify: true }}>
        <Layout toggleDarkMode={props.toggleDarkMode} connectUser={props.connectUser} provider={props.provider} user={props.user}>
            <SignUp status={props.user === 1} idx={props.idx}/>
            <Dashboard idx={props.idx}/>
        </Layout>
        </JssProvider>
    )
}
    
    
  
  export default Home;