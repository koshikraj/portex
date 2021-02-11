import React from 'react';
import Content from './Content';
import NotConnected from './NotConnected';


const Dashboard = ({ toggleDarkMode,idx, user, userData }) => {
  return (
    <>
      {
        user ? <Content idx={idx} user={user} userData={userData}/> :
        <NotConnected />
      }
    </>
  );
};

export default Dashboard;
