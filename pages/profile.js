import Layout from '../components/Layout';
import { JssProvider } from 'react-jss';
import Profile from '../components/Profile/Profile';
const ProfilePage = (props) => {
  return (
    <JssProvider id={{ minify: true }}>
      <Layout
        toggleDarkMode={props.toggleDarkMode}
        connectUser={props.connectUser}
        provider={props.provider}
        user={props.user}
      >
        <Profile idx={props.idx} userData={props.userData} />
      </Layout>
    </JssProvider>
  );
};

export default ProfilePage;
