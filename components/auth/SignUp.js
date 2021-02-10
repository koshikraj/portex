import React, { useState } from 'react';
import { Button, Modal, Input } from '@geist-ui/react';
import * as Icons from 'react-feather';
import makeStyles from '../makeStyles';

const useStyles = makeStyles((ui) => ({
  form: {
    display: ' flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: '6px 0',
  },
  inputField: {
    width: '310px !important',
  },
}));

function SignUp({ modal, setModal }) {
  const [email, setEmail] = useState('');
  console.log('EMAIL', email);
  //    const [modal, setModal] = useState(true);
  const closeHandler = (event) => {
    setModal(false);
  };
  const classes = useStyles();
  return (
    <>
      <Modal open={modal} onClose={closeHandler}>
        <Modal.Title>Sign up </Modal.Title>

        <Modal.Content>
          <div className={classes.form}>
            <div className={classes.input}>
              <Input
                placeholder='Enter your Name'
                icon={<Icons.User />}
                className={classes.inputField}
              />
            </div>
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
          Submit
        </Modal.Action>
      </Modal>
    </>
  );
}

export default SignUp;
