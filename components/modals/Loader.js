import React, { useState } from 'react';
import { Loading, Modal, Row } from '@geist-ui/react';

function Loader({ loading, heading, content }) {

  return (
    <div>
      <div>
        <Modal open={loading} disableBackdropClick>
        <Modal.Title>{heading}</Modal.Title>

          <Modal.Content>
        <Row style={{ padding: '10px 0'}}>
         <Loading> {content} </Loading>
        </Row> 
        </Modal.Content>
        </Modal>
      </div>
    </div>
  );
}

export default Loader;
