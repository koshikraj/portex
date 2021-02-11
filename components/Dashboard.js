import React from 'react';
import Menu from './Menu';
import Heading from './Profile';
import Content from './Content';
import Footer from './Footer';

const Dashboard = ({ toggleDarkMode,idx }) => {
  return (
    <>
      <Content idx={idx}/>
    </>
  );
};

export default Dashboard;
