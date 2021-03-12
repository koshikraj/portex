import React, { useState, useEffect } from 'react';
import { Button, Image, Loading, Modal, Row } from '@geist-ui/react';
import Router from 'next/router';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { useUser } from '../../lib/hooks';
import { ethers } from 'ethers';

function Connect({ modal, setModal, connectUser, userConnected }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [loading, setLoading] = useState(false);

  const handler = () => setModal(true);
  const closeHandler = (event) => {
    setModal(false);
    console.log('closed');
  };

  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    !magic &&
      setMagic(
        new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
          extensions: [new OAuthExtension()],
        })
      );
    magic?.preload();
  }, [magic]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: `${process.env.NEXT_PUBLIC_CLIENT_URL}/callback`,
      });
      authenticateWithServer(didToken);
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  async function handleLoginWithSocial(provider) {
    await magic.oauth.loginWithRedirect({
      provider,
      redirectURI: `${process.env.NEXT_PUBLIC_CLIENT_URL}/callback`,
    });
  }

  // try to login with webauthn, if that fails, revert to registering with webauthn
  async function authenticateWithServer(didToken) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
      }
    );
    res.status === 200 && Router.push('/');
  }

  return (
    <div>
      <div>
        {/* <Button auto onClick={handler}>
          Show Modal
        </Button> */}
        <Modal open={modal} onClose={closeHandler} disableBackdropClick={true}>
          <Modal.Title>Login to Portex</Modal.Title>

          <Modal.Content>
            <Row gap={0.8} justify='center' style={{ marginBottom: '15px' }}>
              <Button
                type='secondary'
                icon={
                  <Image width='25' height='25' src='/assets/metamask.png' />
                }
                ghost
                onClick={() => {
                  connectUser(null), setModal(false), setLoading(true);
                }}
              >
                MetaMask
              </Button>
            </Row>
            <Row gap={0.8} justify='center' style={{ marginBottom: '15px' }}>
              <Button
                type='secondary'
                icon={<Image width='25' height='25' src='/assets/github.png' />}
                ghost
                onClick={() => {
                  handleLoginWithSocial('github');
                }}
              >
                GitHub
              </Button>
            </Row>
            <Row gap={0.8} justify='center' style={{ marginBottom: '15px' }}>
              <Button
                type='secondary'
                icon={<Image width='25' height='25' src='/assets/google.png' />}
                ghost
                onClick={() => {
                  handleLoginWithSocial('google');
                }}
              >
                Google
              </Button>
            </Row>
          </Modal.Content>
          <Modal.Action onClick={closeHandler} />
        </Modal>
        <Modal open={loading && !userConnected} disableBackdropClick>
          <Modal.Title>Login to Portex</Modal.Title>

          <Modal.Content>
            <Row style={{ padding: '10px 0' }}>
              <Loading>Connecting user </Loading>
            </Row>
          </Modal.Content>
        </Modal>
      </div>
    </div>
  );
}

export default Connect;
