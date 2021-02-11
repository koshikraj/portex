import React from 'react';
import Menu from '../../components/Menu';
import {
  GeistUIThemes,
  Button,
  Text,
  Link,
  Card,
  Dot,
  Tag,
  Avatar,
} from '@geist-ui/react';
import makeStyles from '../../components/makeStyles';
import { JssProvider } from 'react-jss';
import Layout from '../../components/Layout';
import EventListItem from '../../components/EventListItem';
import PortfolioCard from '../../components/PortfolioCard';

import * as Icons from 'react-feather';
const useStyles = makeStyles((ui) => ({
  root: {
    backgroundColor: ui.palette.accents_1,
  },
  content: {
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: `calc(${ui.layout.gap} * 2) ${ui.layout.pageMargin} calc(${ui.layout.gap} * 4)`,
    transform: 'translateY(-35px)',
  },
  invite: {
    display: 'flex',
  },
  inviteHeading: {
    marginBottom: 18,
    fontSize: '14px !important',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minWidth: 1,
    maxWidth: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  projects: {
    width: '100%',
  },
  activity: {
    flex: 1,
  },
  [`@media screen and (min-width: ${ui.layout.pageWidthWithMargin})`]: {
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    projects: {
      width: 540,
      maxWidth: '100%',
      marginRight: 80,
    },
    activityTitle: {
      marginTop: '20 !important',

      fontSize: '14px !important',
      textAlign: 'start !important',
    },
    viewAll: {
      marginBottom: '0 !important',
      textAlign: 'start !important',
    },
    invite: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: ui.layout.gap,
    textAlign: 'center',
  },
  activityTitle: {
    fontWeight: 700,
    marginTop: ui.layout.gap,
    fontSize: 24,
    textAlign: 'center',
  },
  avatar: {
    width: '32px !important',
    height: '32px !important',
    marginRight: '10px !important',
  },
  message: {
    margin: 0,
    flex: 1,
  },
  created: {
    color: 'rgb(153, 153, 153) !important',
    margin: '0 0 0 auto',
    paddingLeft: 10,
    textAlign: 'right',
  },
}));

function accessrequest(props) {
  const classes = useStyles();
  return (
    <>
      <JssProvider id={{ minify: true }}>
        <Layout toggleDarkMode={props.toggleDarkMode}>
          <div className={classes.root}>
            <div className={classes.content}>
              <div className={classes.activity}>
                <Text h2 className={classes.activityTitle}>
                  Pending Requests
                </Text>

                {/* <EventListItem
                  username='ofekashery'
                  avatar='/assets/avatar.png'
                  created='3d'
                >
                  <b>Koushith's</b>Requested your Portfolio access.
                  <Button size='small' auto type='success'>
                    Accept
                  </Button>
                  <Button size='small' auto>
                    Reject
                  </Button>
                </EventListItem> */}

                <Avatar
                  alt={`Avatar`}
                  className={classes.avatar}
                  src='/assets/avatar.png'
                />
                <Text className={classes.message}>
                  <b>Koushith's</b>Requested your Portfolio access.
                  <Button size='small' auto type='success'>
                    Accept
                  </Button>
                  <Button size='small' auto>
                    Reject
                  </Button>
                </Text>
              </div>
            </div>
          </div>
        </Layout>
      </JssProvider>
    </>
  );
}

export default accessrequest;

// rename the file name to [slug].js -----> /requests/:slug
