import React from 'react';
import { Avatar, Text, Button } from '@geist-ui/react';
import makeStyles from './makeStyles';

const useStyles = makeStyles((ui) => ({
  root: {
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
    padding: '10px 0px',
    alignItems: 'center',
    display: 'flex',
    fontSize: 14,
  },
  avatar: {
    width: '36px !important',
    height: '36px !important',
    marginRight: '10px !important',
    display: 'flex !important',
    alignItems: 'flexStart',
    marginLeft: '40px',
  },
  message: {
    marginBottom: '4px',
    flex: 1,
  },
  created: {
    color: 'rgb(153, 153, 153) !important',
    margin: '0 0 0 auto',
    paddingLeft: 10,
    textAlign: 'right',
  },
  search: {
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    marginLeft: 14,
  },
}));

const SearchResults = ({ children, username, avatar }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <Avatar
          alt={`${username} Avatar`}
          className={classes.avatar}
          src={avatar}
        />
        <Text as p>
          <b>Name</b>
        </Text>
        <Button
          size='small'
          auto
          type='success'
          className={classes.requestButton}
        >
          Request
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;
