import React, { useState, useEffect } from 'react';
import {
  GeistUIThemes,
  Avatar,
  Button,
  Text,
  Link,
  Row,
  Loading,
} from '@geist-ui/react';
import makeStyles from './makeStyles';
import * as Icons from 'react-feather';
import ProfileCard from './Profile/ProfileCard';
import AddressModal from './Profile/AddressModal';
import Loader from './modals/Loader';
import { definitions } from '../utils/config.json';
import { decryptData, encryptData } from '../lib/threadDb';

const useStyles = makeStyles((ui) => ({
  root: {
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    padding: `calc(${ui.layout.gap} * 2) ${ui.layout.pageMargin} calc(${ui.layout.gap} * 4)`,
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  avatar: {
    width: '100px !important',
    height: '100px !important',
    marginRight: '30px !important',
  },
  name: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    lineHeight: 1,
  },
  createProjectButton: {},
  [`@media screen and (max-width: ${ui.layout.pageWidthWithMargin})`]: {
    createProjectButton: {
      display: 'none !important',
    },
    avatar: {
      width: '80px !important',
      height: '80px !important',
      marginRight: '20px !important',
    },
    username: {
      fontSize: 24,
    },
  },
  projects: {
    // width: '1040px !important',
    width: 'auto',
    maxWidth: '100%',
  },
  integrationsTitle: {
    textTransform: 'uppercase',
    color: `${ui.palette.accents_5} !important`,
    fontWeight: 500,
    fontSize: 12,
    margin: 0,
  },
  integrationsUsername: {
    margin: '0 0 0 4px',
    fontWeight: 0,
  },
  crypto: {
    width: '50px !important',
    height: '50px !important',
    marginRight: '25px !important',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    width: ui.layout.pageWidthWithMargin,
    paddingLeft: 23.333,
    boxSizing: 'border-box',
    margin: '0 auto',
  },
}));

const Profile = ({ idx, userData }) => {
  const classes = useStyles();
  const [modal, setModal] = useState(false);
  const [addressArray, setAddress] = useState([]);
  const [aesKey, setAesKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        if (idx) {
          const res = JSON.parse(localStorage.getItem('USER'));
          const dec = await idx.ceramic.did.decryptDagJWE(res.aesKey);
          setAesKey(dec);
          const [addressList] = await Promise.all([
            idx.get(definitions.portfolio, idx.id),
          ]);
          console.log(addressList);
          if (addressList) {
            const decryptedData = await decryptData(
              Buffer.from(addressList.portfolio, 'hex'),
              dec
            );
            console.log(JSON.parse(decryptedData.toString('utf8')));
            addressList
              ? setAddress(JSON.parse(decryptedData.toString('utf8')))
              : setAddress([]);
          } else {
            setAddress([]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetch();
  }, [idx]);

  const addAddress = async (newAddress) => {
    setLoading(true);
    setModal(false);
    const newAddresses = [...addressArray, newAddress];

    const encryptedData = await encryptData(
      Buffer.from(JSON.stringify(newAddresses)),
      aesKey
    );
    console.log(encryptedData);
    setAddress(newAddresses);
    const docId = await idx.set(definitions.portfolio, {
      portfolio: encryptedData.toString('hex'),
    });
    localStorage.setItem('docId', docId.toString());
    setLoading(false);
  };

  return (
    <div>
      <Loader
        loading={loading}
        heading={'Add address'}
        content={'Adding address'}
      />
      <AddressModal modal={modal} setModal={setModal} addAddress={addAddress} />

      <div className={classes.root}>
        {userData ? (
          <div className={classes.content}>
            <Avatar
              alt='Your Avatar'
              className={classes.avatar}
              src='/assets/avatar.png'
            />
            <div className={classes.name}>
              <div className={classes.title}>
                <Text h2 className={classes.username}>
                  {userData.name}
                </Text>
                <Button
                  className={classes.createProjectButton}
                  type='secondary'
                  auto
                  icon={<Icons.Plus />}
                  onClick={() => setModal(true)}
                >
                  Add New Address
                </Button>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icons.Mail size={16} aria-label='Email' />
                  <Text className={classes.integrationsUsername}>
                    {userData.email}
                  </Text>
                </div>
                <Link
                  href='https://github.com/consensolabs'
                  target='_blank'
                  rel='noopener'
                  underline
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}></div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Row style={{ padding: '10px 0' }}>
            :<Text> No user data found</Text>
          </Row>
        )}

        <div
          className={classes.heading}
          style={{ marginBottom: '0px', height: '0px', background: 'red' }}
        >
          <Text h4 className={classes.username}>
            My Portfolio
          </Text>
        </div>
        <div className={classes.content}>
          <div className={classes.projects}>
            {addressArray.length > 0 ? (
              addressArray.map((add, index) => {
                console.log(add);
                return (
                  <ProfileCard
                    address={add.address}
                    name={add.chain}
                    addAddress={addAddress}
                    key={index}
                  />
                );
              })
            ) : (
              <Row style={{ padding: '10px 0' }}>
                <Text> No portfolios found</Text>
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
