import React from 'react';
import { Button, Modal, Input } from '@geist-ui/react';

function AddressModal({ modal, setModal }) {
  const handler = () => setModal(true);
  const closeHandler = (event) => {
    setModal(false);
    console.log('closed');
  };
  return (
    <div>
      <div>
        {/* <Button auto onClick={handler}>
          Show Modal
        </Button> */}
        <Modal open={modal} onClose={closeHandler}>
          <Modal.Title>Add New Address</Modal.Title>

          <Modal.Content>
            <form
              //   onSubmit={handleSignup}
              className='w-80 flex flex-col justify-between p-3'
            >
              <div className='flex justify-center pb-12 '></div>
              <div className='flex flex-col space-y-4'>
                <Input placeholder='First Name' />

                {/* <Input type='email' placeholder='Email' onChange={setEmail} /> */}

                <span className='text-accents-8'>
                  <span className='inline-block align-middle '>
                    {/* <Info width='15' height='15' /> */}
                  </span>{' '}
                  <span className='leading-6 text-sm'>
                    <strong>Info</strong>: Passwords must be longer than 7 chars
                    and include numbers.{' '}
                  </span>
                </span>
                <div className='pt-2 w-full flex flex-col'>
                  <Button
                    variant='slim'
                    type='submit'
                    // loading={loading}
                    // disabled={disabled}
                  >
                    Sign Up
                  </Button>
                </div>

                <span className='pt-1 text-center text-sm'>
                  <span className='text-accents-7'>
                    Do you have an account?
                  </span>
                  {` `}
                  <a className='text-accent-9 font-bold hover:underline cursor-pointer'>
                    Log In
                  </a>
                </span>
              </div>
            </form>
          </Modal.Content>
          <Modal.Action passive onClick={() => setModal(false)}>
            Cancel
          </Modal.Action>
          <Modal.Action>Submit</Modal.Action>
        </Modal>
      </div>
    </div>
  );
}

export default AddressModal;
