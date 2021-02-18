import React, { useState } from 'react';
import { Button, Image, Loading, Modal, Row } from '@geist-ui/react';

function Connect({ modal, setModal, connectUser, userConnected }) {
  console.log(userConnected)

  const [loading, setLoading] = useState(false);
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
          <Modal.Title>Login to Portex</Modal.Title>

          <Modal.Content>
          <Row gap={.8} justify="center" style={{ marginBottom: '15px' }}>
          <Button type="secondary" icon={<Image width="25" height="25" src="/assets/metamask.png" />} ghost onClick={() => {connectUser(), setModal(false), setLoading(true)}}>MetaMask</Button>
          </Row>
          <Row gap={.8} justify="center" style={{ marginBottom: '15px' }}>
          <Button type="secondary" icon={<Image width="25" height="25" src="/assets/github.png" />} ghost onClick={() => {}}>GitHub</Button>
          </Row>
          <Row gap={.8} justify="center" style={{ marginBottom: '15px' }}>
          <Button type="secondary" icon={<Image width="25" height="25" src="/assets/google.png" />} ghost onClick={() => {}}>Google</Button>
          </Row>
          </Modal.Content>
        </Modal>
        <Modal open={loading && !userConnected} disableBackdropClick>
          <Modal.Title>Login to Portex</Modal.Title>

          <Modal.Content>
        <Row style={{ padding: '10px 0'}}>
         <Loading>Connecting user </Loading>
        </Row> 
        </Modal.Content>
        </Modal>
      </div>
    </div>
  );
}

export default Connect;
