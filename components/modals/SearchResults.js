import React from 'react';
import {
  Avatar,
  Text,
  Button,
  Loading,
  Modal,
  Row,
  Table,
} from '@geist-ui/react';
import makeStyles from '../makeStyles';

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

const SearchResultsModal = ({
  userEmail,
  avatar,
  setSearchResults,
  searchResults,
}) => {
  const classes = useStyles();

  const data = [
    {
      email: userEmail,
      actions: (
        <Button auto type='success' size='mini'>
          Request
        </Button>
      ),
    },
  ];
  return (
    <>
      <Modal open={searchResults} disableBackdropClick={true}>
        <Modal.Title>Search Results</Modal.Title>

        <Modal.Content>
          <Table data={data}>
            <Table.Column prop='email' label='email' />

            <Table.Column prop='actions' label='Actions' width={150} />
          </Table>
        </Modal.Content>
        <Modal.Action passive onClick={() => setSearchResults(false)}>
          Close
        </Modal.Action>
      </Modal>
    </>
  );
};

export default SearchResultsModal;
