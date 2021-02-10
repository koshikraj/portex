import Layout from '../components/Layout';
import { JssProvider } from 'react-jss';
import Profile from '../components/Profile';
const ProfilePage = (props) => {
  return (
    <JssProvider id={{ minify: true }}>
      <Layout toggleDarkMode={props.toggleDarkMode}>
        <Profile />
      </Layout>
    </JssProvider>
  );
};

export default ProfilePage;
