import React from 'react';
import { Display, Image } from '@geist-ui/react';


const NotConnected = () => {
  return (
      <Display shadow caption="Please login or create a new user by clicking on Connect to start using Portex.">
        <Image width="435" height="200" src="/assets/auth.svg" />
      </Display>

  );
};

export default NotConnected;
