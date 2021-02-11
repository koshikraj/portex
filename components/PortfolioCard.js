import React from 'react';
import {
  GeistUIThemes,
  Button,
  Text,
  Link,
  Card,
  Dot,
  Tag,
} from '@geist-ui/react';
import makeStyles from './makeStyles';

import * as Icons from 'react-feather';

const useStyles = makeStyles((ui) => ({
  card: {
    padding: '0 !important',
    marginBottom: `calc(${ui.layout.gap}*1.5) !important`,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ui.layout.gap,
    '& h3': {
      margin: 0,
    },
  },
  created: {
    fontSize: 14,
    color: 'rgb(153, 153, 153) !important',
    margin: `0 0 0 ${ui.layout.gapHalf}`,
    textAlign: 'right',
  },
  visitButton: {},
  '@media screen and (max-width: 540px)': {
    created: {
      display: 'none !important',
    },
    visitButton: {
      display: 'none !important',
    },
  },
  dot: {
    display: 'flex !important',
    marginTop: ui.layout.gapQuarter,
    '& .icon': {
      backgroundColor: '#50e3c2 !important',
      color: `${ui.palette.accents_5} !important`,
    },
    '& .label': {
      textTransform: 'none !important',
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    '& .label a': {
      display: 'inline-block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: 14,
      lineHeight: 'normal',
    },
    '& .link': {
      fontWeight: 500,
      color: `${ui.palette.accents_5} !important`,
    },
  },
  tag: {
    display: 'flex !important',
    alignItems: 'center',
    textTransform: 'capitalize !important',
    fontSize: '12px !important',
    padding: '3px 7px !important',
    borderRadius: '16px !important',
    height: 'unset !important',
    marginLeft: 8,
    color: `${ui.palette.foreground} !important`,
  },
  footer: {
    display: 'flex !important',
    alignItems: 'center !important',
    height: 50,
    width: '100% !important',
  },
  mail: {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: '6px !important',
    color: `${ui.palette.accents_5} !important`,
  },
}));

const PortfolioCard = ({ name, created, email, address }) => {
  const classes = useStyles();

  return (
    <>
      <Card shadow className={classes.card}>
        <div className={classes.title}>
          <Text h3>{name}</Text>
          <Button className={classes.visitButton} size='small' auto>
            Visit
          </Button>
        </div>
        <div className={classes.content}>
          <Dot type='success' className={classes.dot}>
            <Link>{address}</Link>
          </Dot>
        </div>
        <Card.Footer className={classes.footer}>
          <Icons.Mail size={14} />
          <Text className={classes.mail}>{email}</Text>
        </Card.Footer>
      </Card>
    </>
  );
};

export default PortfolioCard;
