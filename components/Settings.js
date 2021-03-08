import React from 'react';
import { GeistUIThemes, Avatar, Button, Text, Link } from '@geist-ui/react';
import makeStyles from './makeStyles';
import * as Icons from 'react-feather';

const useStyles = makeStyles((ui) => ({
  root: {
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
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

const Settings = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.name}>
        <div className={classes.title}>
          <Text h2 className={classes.username}>
            Consenso Labs
          </Text>
          <Button className={classes.createProjectButton} type='secondary' auto>
            Update Settings
          </Button>
        </div>
        <div>
          <Text className={classes.integrationsTitle}>Git Integrations</Text>
          <Link
            href='https://github.com/consensolabs'
            target='_blank'
            rel='noopener'
            pure
            underline
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icons.GitHub size={16} aria-label='Github' />
              <Text className={classes.integrationsUsername}>consensolabs</Text>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
