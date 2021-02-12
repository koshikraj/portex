import React, { useEffect, useState } from 'react';
import { Button, Modal, Row, Spinner, Text } from '@geist-ui/react';
import * as Icons from 'react-feather';
import makeStyles from '../makeStyles';

import { decryptData } from '../../lib/threadDb';

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

function Portfolio({ state, idx, portfolio }) {
  
  const [portfolioData, setPortfolioData] = useState({});
  const [modal, setModal ] = useState(false);
  
  useEffect(() => {
     async function loadPortfolio() {   
       
       if (idx && portfolio.documentId) {
         console.log(idx)
          const aesKey = await idx.ceramic.did.decryptDagJWE(portfolio.encryptedKey)
          const encData = await idx.ceramic.loadDocument(portfolio.documentId)
          const decryptedData = await decryptData(Buffer.from(encData._state.content.portfolio, "hex"), aesKey)
          const res = JSON.parse(decryptedData.toString("utf8"))
          console.log("Decryp:", res)
          setPortfolioData (  
          { name: portfolio.senderName,
            email: portfolio.senderEmail,
            did: portfolio.senderDid,
            portfolio: res
          }
        )
       }
        setModal(state)
     }
     loadPortfolio();
  }, [state, idx, portfolio] ) 

  const closeHandler = (event) => {
    setModal(false);
  };
  const classes = useStyles();



  return (
    <>
      <Modal open={modal} onClose={closeHandler}>
        <Modal.Title>User portfolio </Modal.Title>

        <Modal.Content>
        <div>
              <Row gap={.8} justify="center" style={{ marginBottom: '15px' }}>
                   <Spinner size="large" />
                   </Row>
              <Row gap={.8} justify="center" style={{ marginBottom: '15px' }}>
                   <Text>Loading portfolios</Text>
              </Row>

        </div>
          
        </Modal.Content>
        <Modal.Action passive onClick={() => setModal(false)}>
          Cancel
        </Modal.Action>
      </Modal>
    </>
  );
}

export default Portfolio;
