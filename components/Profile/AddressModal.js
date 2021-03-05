import React, { useState } from 'react';
import { Button, Modal, Input, Image, Select } from '@geist-ui/react';
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
  const [newChain, setNewChain] = useState('');
  const closeHandler = (event) => {
    setModal(false);
  };

  const handleSubmit = () => {
    if (!newAddress) return;
    addAddress({ chain: newChain, address: newAddress }).then(
      console.log('done')
    );
    setNewAddress('');
  };
  const classes = useStyles();

  return (
    <>
      <Modal open={modal} onClose={closeHandler}>
        <Modal.Title>Add New Account </Modal.Title>
        <Modal.Content>
          <div className={classes.form}>
            <div className={classes.input}>
              <div className={classes.input}>
                <Select
                  placeholder='Select Chain'
                  className={classes.inputField}
                  onChange={(value) => {
                    setNewChain(value);
                  }}
                >
                  <Select.Option value='ETH' icon={<Icons.Link2 />}>
                    Ethereum
                  </Select.Option>
                  <Select.Option value='DOGE'>Dogecoin</Select.Option>
                  <Select.Option value='BTC'>Bitcoin</Select.Option>
                  <Select.Option value='BCH'>Bitcoin Cash</Select.Option>
                  <Select.Option value='XRP'>Ripple</Select.Option>
                  <Select.Option value='DOT'>Polkadot</Select.Option>
                  <Select.Option value='XLM'>Stellar</Select.Option>
                </Select>
              </div>
              <Input
                placeholder='Enter the Address'
                icon={<Icons.Link2 />}
                className={classes.inputField}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
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
