import React, { useState } from 'react';
import { Button, Modal, Input } from '@geist-ui/react';
import * as Icons from 'react-feather';
import makeStyles from '../makeStyles';

function SignIn() {
  const [email, setEmail] = useState('');
  //    const [modal, setModal] = useState(true);
  const closeHandler = (event) => {
    setModal(false);
  };

  return (
    <>
      <Modal open={modal} onClose={closeHandler}>
        <Modal.Title>Sign up </Modal.Title>

        <Modal.Content>
          <div className={classes.form}>
            <div className={classes.input}>
              <Input
                value={email}
                placeholder='johndoe@domain.com'
                icon={<Icons.Mail />}
                className={classes.inputField}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setModal(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={() => console.log('CLICKED')} loading={true}>
          Sign in
        </Modal.Action>
      </Modal>
    </>
  );
}

export default SignIn;
