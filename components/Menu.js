import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  GeistUIThemes,
  Avatar,
  Button,
  Tabs,
  useTheme,
  Popover,
  Link,
} from '@geist-ui/react';
import Connect from './modals/Connect';
import makeStyles from './makeStyles';
import * as Icons from 'react-feather';

const useStyles = makeStyles((ui) => ({
  header: {
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    margin: '0 auto',
    backgroundColor: ui.palette.background,
    fontSize: 16,
    height: 60,
    zIndex: 15,
  },
  headerContent: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${ui.layout.pageMargin}`,
  },
  headerTitle: {
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
  },
  nav: {
    position: 'sticky',
    top: 0,
    backgroundColor: ui.palette.background,
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
    zIndex: 15,
  },
  navFixed: {
    borderBottom: ui.type === 'light' && 'none',
    boxShadow: ui.type === 'light' && 'rgba(0, 0, 0, 0.1) 0 0 15px 0',
  },
  navContent: {
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    height: '100%',
    margin: '0 auto',
    '& .tabs header': {
      padding: `0 ${ui.layout.pageMargin}`,
      borderBottom: 'none !important',
      flexWrap: 'nowrap !important',
      overflowY: 'hidden',
      overflowX: 'auto',
      overflow: '-moz-scrollbars-none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '& .content': {
      display: 'none !important',
    },
    '& .tab': {
      padding: '12px !important',
      margin: '0 !important',
      fontSize: '14px !important',
    },
  },
  sidebar: {
    display: 'flex',
    alignItems: 'center !important',
  },
  themeIcon: {
    width: '40px !important',
    height: '40px !important',
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    marginRight: 5,
    padding: '0 !important',
  },
  popover: {
    width: '180px !important',
  },
}));

const popoverContent = () => (
  <>
    <Popover.Item title>
      <span>User Settings</span>
    </Popover.Item>
    <Popover.Item>
      <Link>Teams</Link>
    </Popover.Item>
    <Popover.Item>
      <Link href='https://github.com/koshikraj/portex'>GitHub</Link>
    </Popover.Item>
    <Popover.Item line />
    <Popover.Item>
      <Link>Logout</Link>
    </Popover.Item>
  </>
);

const Menu = ({ toggleDarkMode, connectUser, provider, user }) => {
  
  const [modal, setModal] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [fixed, setFixed] = useState(false);
  const [tab, setTab] = useState(router.pathname);
  const isDark = theme.type === 'dark';

  useEffect(() => {
    const scrollHandler = () => {
      const shouldFixed = document.documentElement.scrollTop > 60;
      if (fixed !== shouldFixed) setFixed(shouldFixed);
    };
    document.addEventListener('scroll', scrollHandler);
    return () => document.removeEventListener('scroll', scrollHandler);
  }, [fixed]);

  const changeTab = (val) => {
    router.push(val);
    setTab(val);
  };

  return (
    <>
      <Connect modal={modal} setModal={setModal} connectUser={connectUser} userConnected={user}/>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <div style={{ display: 'flex' }}>
            <div className={classes.headerTitle}> Portex</div>
          </div>
          <div className={classes.sidebar}>
            <Button
              aria-label='Toggle Dark mode'
              className={classes.themeIcon}
              auto
              type='abort'
              onClick={toggleDarkMode}
            >
              {isDark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
            </Button>

            <Popover
              content={popoverContent}
              placement='bottomEnd'
              portalClassName={classes.popover}
            >
              <Avatar text='CL' />
            </Popover>
            <Button
              auto
              type='abort'
              onClick={setModal}
            >
            {provider ?  "Disconnect" : "Connect" }
            </Button>
          </div>
        </div>
      </div>
      <nav className={classes.nav + ' ' + (fixed ? classes.navFixed : '')}>
        <div className={classes.navContent}>
          <Tabs
            initialValue={tab}
            onChange={(val) => {
              changeTab(val);
            }}
          >
            <Tabs.Item label='Overview' value='/' />
            {/* replace path with :id -> /requests/:id */}
            <Tabs.Item
              label='Pending Request'
              value='/requests/accessrequest'
            />
            <Tabs.Item label='My Profile' value='/profile' />
          </Tabs>
        </div>
      </nav>
    </>
  );
};

export default Menu;
