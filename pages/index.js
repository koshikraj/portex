import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard'
import { JssProvider } from 'react-jss';
const Home = (props) => {

  
    return (
        <JssProvider id={{ minify: true }}>
        <Layout toggleDarkMode={props.toggleDarkMode}>
            <Dashboard/>
        </Layout>
        </JssProvider>
    )
}
    
    
  
  export default Home;