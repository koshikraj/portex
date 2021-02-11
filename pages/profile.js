import Layout from '../components/Layout';
import { JssProvider } from 'react-jss';
import Profile from '../components/Profile';
const ProfilePage = (props) => {
  console.log(props.idx)
  return (
    <JssProvider id={{ minify: true }}>
      <Layout toggleDarkMode={props.toggleDarkMode}>
        <Profile idx={props.idx}/>
      </Layout>
    </JssProvider>
  );
};

export default ProfilePage;
