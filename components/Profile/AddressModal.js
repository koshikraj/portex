import React, { useState } from 'react';
import { Button, Modal, Input, Select } from '@geist-ui/react';
import * as Icons from 'react-feather';
import makeStyles from '../../components/makeStyles';
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

function AddressModal({ modal, setModal, addAddress }) {
  const [newAddress, setNewAddress] = useState('');
  const closeHandler = (event) => {
    setModal(false);
  };

  const handleSubmit = () => {
    if (!newAddress) return;
    console.log(newAddress);
    addAddress(newAddress).then(console.log('done'));
    setNewAddress('');
  };
  const classes = useStyles();

  return (
    <>
      <Modal open={modal} onClose={closeHandler}>
        <Modal.Title>Add New Address </Modal.Title>
        <Modal.Content>
          <div className={classes.form}>
            <div className={classes.input}>
              <Input
                placeholder='Enter the Address'
                icon={<Icons.Globe />}
                className={classes.inputField}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className={classes.input}>
              <Select placeholder='Select Coin' className={classes.inputField}>
                <Select.Option value='1'>Option 1</Select.Option>
                <Select.Option value='2'>Option 2</Select.Option>
              </Select>
            </div>
          </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setModal(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={handleSubmit} loading={false}>
          Add
        </Modal.Action>
      </Modal>
    </>
  );
}
export default AddressModal;
