import React, { useState } from 'react';
import {
  Avatar,
  Text,
  Button,
  Loading,
  Modal,
  Row,
  Table,
} from '@geist-ui/react';
import { requestPortfolio } from '../../lib/threadDb';
import Loader from './Loader';

const SearchResultsModal = ({
  userEmail,
  avatar,
  setSearchResults,
  searchResults,
  reciverDetails,
  requested,
  caller,
}) => {
  const [loading, setLoading] = useState(false);
  const [loaderData, setLoaderData] = useState({});

  // request portfolio

  async function handelRequest() {
    setLoaderData({
      heading: 'Requesting Portfolio',
      content: 'Requesting Portfolio',
    });
    setLoading(true);
    const res = await requestPortfolio(caller, reciverDetails);
    if (res) {
      requested.push({
        receiverDid: reciverDetails.did,
        name: reciverDetails.name,
      });
    }
    setSearchResults(false);
    setLoaderData({
      heading: 'Portfolio Requested successfully',
      content: 'Portfolio Requested Successfully',
    });
    setLoading(false);
  }

  const data = [
    {
      email: userEmail,
      actions: (
        <Button auto type='success' size='mini' onClick={handelRequest}>
          Request
        </Button>
      ),
    },
  ];
  return (
    <>
      <Loader
        loading={loading}
        heading={loaderData.heading}
        content={loaderData.content}
      />
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
