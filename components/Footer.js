import React from 'react';
import { GeistUIThemes, Text, Link, Image } from '@geist-ui/react';
import makeStyles from './makeStyles';

const useStyles = makeStyles((ui) => ({
  root: {
    padding: '8px 42px',
    borderTop: `solid 1px ${ui.palette.accents_2}`,
    textAlign: 'center',
    display: 'flex',
    flexdirection: 'row',
    alignItems: 'center',
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
  logo: {
    // border: `1px solid ${ui.palette.accents_2}`,
    // borderRadius: '50% !important',
    margin: '0 6px 0 0 !important',
  },
  [`@media screen and (min-width: ${ui.layout.pageWidthWithMargin})`]: {
    root: {
      textAlign: 'start !important',
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Image className={classes.logo} src='/logo.png' title='Portex' />
        <Text>
          &copy;{new Date().getFullYear()}
          <Link
            href='https://github.com/consensolabs'
            target='_blank'
            rel='noopener'
            pure
            underline
          ></Link>
          .
        </Text>
      </div>
    </div>
  );
};

export default Footer;
