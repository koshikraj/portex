import React, { useState } from 'react';
import { Modal, Input } from '@geist-ui/react';
import makeStyles from '../makeStyles';
import * as Icons from 'react-feather';
import { updateName } from '../../lib/threadDb';

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

function EditProfie({ editName, setEditName, email }) {
  const classes = useStyles();

  const [name, setName] = useState(null);

  const handleSubmit = async () => {
    console.log('Name:', name);
    console.log('Email:', email);
    const status = await updateName(name, email);
    if (status) alert('Updated');
    else alert('SOme error!!1 try latter');
  };

  return (
    <Modal
      open={editName}
      onClose={() => setEditName(false)}
      disableBackdropClick={true}
    >
      <Modal.Title>Edit Profile </Modal.Title>

      <Modal.Content>
        <div className={classes.form}>
          <div className={classes.input}>
            <Input
              placeholder='Enter your Name'
              icon={<Icons.User />}
              className={classes.inputField}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Action passive onClick={() => setEditName(false)}>
        Cancel
      </Modal.Action>
      <Modal.Action onClick={handleSubmit}>Submit</Modal.Action>
    </Modal>
  );
}

export default EditProfie;
