import Layout from '../components/Layout';
import Settings from '../components/Settings';
import { JssProvider } from 'react-jss';
const SettingsPage = (props) => {
  
    return (
        <JssProvider id={{ minify: true }}>
        <Layout toggleDarkMode={props.toggleDarkMode}>
        <Settings/>
        </Layout>
        </JssProvider>
    )
}
    
    
  
  export default SettingsPage;