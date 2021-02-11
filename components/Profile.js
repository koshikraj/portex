import React, { useState, useEffect } from 'react';
import { GeistUIThemes, Avatar, Button, Text, Link } from '@geist-ui/react';
import makeStyles from './makeStyles';
import * as Icons from 'react-feather';
import ProfileCard from './Profile/ProfileCard';
import {definitions} from '../utils/config.json'

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
    width: 540,
    maxWidth: '100%',
    marginRight: 80,
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
}));

const Profile = ({idx}) => {
  const classes = useStyles();

  const [addressArray, setAddress] = useState([])


  useEffect(() => {
    async function fetch(){
        try{
            if(idx){
                const [addressList] = await Promise.all([
                idx.get(definitions.portfolio, idx.id)]);
                console.log(addressList); 
                addressList ? setAddress(addressList.portfolio) : setAddress([])  
            }
        }catch(err){
            console.log(err)
        }
    }
    fetch()
}, [])

const addAddress = async (newAddress) => {
  const newAddresses = [...addressArray, newAddress];
  setAddress(newAddresses)
  console.log(newAddresses)
  await idx.set(definitions.portfolio, {
    portfolio: newAddress
  })
}


  return (
    <>
      <div className={classes.root}>
        <div className={classes.content}>
          <Avatar
            alt='Your Avatar'
            className={classes.avatar}
            src='/assets/consensolabs.png'
          />
          <div className={classes.name}>
            <div className={classes.title}>
              <Text h2 className={classes.username}>
                Consenso Labs
              </Text>
              <Button
                className={classes.createProjectButton}
                type='secondary'
                auto
              >
                Edit Profile
              </Button>
            </div>
            <div>
              <Text className={classes.integrationsTitle}>
                Git Integrations{' '}
              </Text>
              <Link
                href='https://github.com/consensolabs'
                target='_blank'
                rel='noopener'
                pure
                underline
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icons.Mail size={16} aria-label='Email' />
                  <Text className={classes.integrationsUsername}>
                    Koushith97@gmail.com
                  </Text>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.content}>
        <div className={classes.projects}>
          <ProfileCard
            heading='Your Portfolio'
            address='0xf584a190E5210f3d98654EF6792FA40fb4519332'
            name='Bitcoin'
            addAddress={addAddress}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
