import React, { useState } from 'react';
import { GeistUIThemes, Text, Link, Button, Select } from '@geist-ui/react';
import makeStyles from './makeStyles';
import EventListItem from './EventListItem.js';
import ProjectCard from './ProjectCard';
import SignUp from './auth/SignUp';

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
}));

const Content = () => {

  const classes = useStyles();
  return (
    <>
      {/* testing purpose */}
      <div className={classes.root}>
        <div className={classes.content}>
          <Text h3>Portfolio’s shared with me</Text>
          <div className={classes.row}>
            <div className={classes.projects}>
              <ProjectCard
                name='Koushith'
                address='0xf584a190E5210f3d98654EF6792FA40fb4519332'
                email='koushith97@gmail.com'
              />
              <ProjectCard
                name='Koushith'
                address='0xf584a190E5210f3d98654EF6792FA40fb4519332'
                email='koushith97@gmail.com'
              />
              <ProjectCard
                name='Koushith'
                address='0xf584a190E5210f3d98654EF6792FA40fb4519332'
                email='koushith97@gmail.com'
              />
            </div>

            {/* right- */}

            <div className={classes.activity}>
              <Text h2 className={classes.inviteHeading}>
                Search User
              </Text>
              <div className={classes.invite}>
                <Select placeholder='Choose one' style={{ width: '250px' }}>
                  <Select.Option value='1'>Option 1</Select.Option>
                  <Select.Option value='2'>Option 2</Select.Option>
                </Select>
                <Button
                  size='small'
                  auto
                  icon={<Icons.Plus />}
                  type='secondary'
                >
                  Request
                </Button>
              </div>

              <Text h2 className={classes.activityTitle}>
                Recent Activity
              </Text>

              <EventListItem
                username='ofekashery'
                avatar='/assets/avatar.png'
                created='3d'
              >
                Requested <b>Koushith's</b> Portfolio access.
              </EventListItem>

              <EventListItem
                username='ofekashery'
                avatar='/assets/avatar.png'
                created='9d'
              >
                Requested <b>Koushith's</b> Portfolio access.
              </EventListItem>
              <Text className={classes.viewAll}>
                <Link color>View My Profile Access Request lists</Link>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
