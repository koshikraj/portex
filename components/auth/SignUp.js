import React, { useState } from 'react';
import { Button, Modal, Input } from '@geist-ui/react';
import * as Icons from 'react-feather';
import makeStyles from '../makeStyles';
import {definitions} from "../../utils/config.json"
import { generateCipherKey, registerNewUser } from '../../lib/threadDb';

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

function SignUp({ status, idx }) {
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [modal, setModal] = useState(Boolean(status))
  const [loading, setLoading] = useState(false)
  //    const [modal, setModal] = useState(true);
  const closeHandler = (event) => {
    setModal(false);
  };
  const classes = useStyles();


  const handleSubmit = async () => {
    //ceramic and threaddb
    const aesKey = await generateCipherKey()
    if(idx){
      setLoading(true)
      const enc = await idx.ceramic.did.createDagJWE(aesKey, [idx.id])

      const ceramicRes = await idx.set(definitions.profile, {
        name: name,
        email: email
      })

      const encCeramic = await idx.set(definitions.encryptionKey, {
        key: enc
      })


      const threadRes = await registerNewUser(idx.id, name, email, enc)
      
      console.log(threadRes)
      if(ceramicRes && threadRes){
        setLoading(false)
        setModal(false);
      }
    }
  }

  return (
    <>
      <Modal open={status || modal} onClose={closeHandler}>
        <Modal.Title>Sign up </Modal.Title>

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
        <Modal.Action onClick={handleSubmit} loading={loading}>
          Submit
        </Modal.Action>
      </Modal>
    </>
  );
}

export default SignUp;
