import React, { useState, useEffect } from 'react';
import { GeistUIThemes, Text, Link, Button, Select, Spinner, Row, Col } from '@geist-ui/react';
import makeStyles from './makeStyles';
import EventListItem from './EventListItem.js';
import PortfolioCard from './PortfolioCard';
import Portfolio from './modals/Portfolio';
import Loader from './modals/Loader';
import {
  getLoginUser,
  getAllUsers,
  requestPortfolio,
  sharePortfolio,
} from '../lib/threadDb';
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
  textRoot: {
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
    padding: '10px 0px',
    alignItems: 'center',
    display: 'flex',
    fontSize: 14,
  },
  message: {
    fontSize: '14px !important',
    margin: 0,
    flex: 1,
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

const Content = ({idx, user, userData}) => {

  const [caller, setCaller] = useState(null)
  const [userArray, setUserArray] = useState([{}])
  const [selectedUser, setSelectedUser] = useState(0)
  const [requested, setRequested] = useState([])
  const [requests, setRequests] = useState([])
  const [sharedPortfolio, setSharedPortfolio] = useState([])
  const [selectedPortfolio, setSelectedPortfolio] = useState({})
  const [portfolioModal, setPortfolioModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaderData, setLoaderData] = useState({})

  useEffect(()=>{
    async function load(){
    
      if (idx && user===2) {
      setRequested(userData.requested)
      setRequests(userData.requests)   
      setSharedPortfolio(userData.sharedData) 

      const user = JSON.parse(localStorage.getItem('USER'))
      const {userArray, caller} = await getAllUsers(user.did)
      console.log("caller",caller)
      setCaller(userData)
      setUserArray(userArray)

      }
    }
    load()
  },[idx, user])

  const onClickCard = (portfolio) => {
    console.log(portfolio)
    setSelectedPortfolio(portfolio); 
    setPortfolioModal(true);
  }



  const handleClick = async () => {
    setLoaderData({heading: "Request Portfolio", content: "Requesting portfolio"})
    setLoading(true);
    const res = await requestPortfolio(caller, userArray[selectedUser]);
    if (res) {
      requested.push({
        receiverDid: userArray[selectedUser].did,
        name: userArray[selectedUser].name,
      });
    }
    setLoading(false);
  };

  const fetchUserDetails = async () => {
    setLoaderData({heading: "Fetch portfolio", content: "Fetching portfolio"})
    setLoading(true);
    const userData = await getLoginUser(idx.id)
    setRequested(userData.requested)
    setRequests(userData.requests)   
    setSharedPortfolio(userData.sharedData) 
    setLoading(false);

  }

  const handleAccept = async (receiver) => {
    
    setLoading(true)
    setLoaderData({heading: "Accept Portfolio Request", content: "Accepting portfolio request"})
    const docId = localStorage.getItem('docId');
    const user = JSON.parse(localStorage.getItem('USER'));
    const dec = await idx.ceramic.did.decryptDagJWE(user.aesKey);
    const encKey = await idx.ceramic.did.createDagJWE(dec, [
      receiver.senderDid,
    ]);
    await sharePortfolio(caller, receiver, docId, encKey);
    setLoading(false)
  };

  const handleReject = async () => {};

  const classes = useStyles();
  return (
    <>
      <Loader loading={loading} heading={loaderData.heading} content={loaderData.content} />
      <Portfolio state={portfolioModal} idx={idx} portfolio={selectedPortfolio} setPortfolioModal={setPortfolioModal}/>
      <div className={classes.root}>
        <div className={classes.content}>
          <Row>
          <Text h3>All portfolios</Text>
          <Button
              // aria-label='Toggle Dark mode'
              // className={classes.themeIcon}
              auto
              type='abort'
              onClick={fetchUserDetails}
            >
             <Icons.RefreshCcw size={16} />
            </Button>
            </Row>
          <div className={classes.row}>
            <div className={classes.projects}>
              {

                (sharedPortfolio.length>0 ?
                    sharedPortfolio.map((value => {
                      return(
                          <PortfolioCard
                              name={value.senderName}
                              address={value.senderDid}
                              email={value.senderEmail}
                              onClickCard={() => {onClickCard(value)}}
                          />
                      )
                    })) :
                    <Text>No shared portfolios</Text>)
              }
            </div>

            {/* right- */}

            <div className={classes.activity}>
              <Text h2 className={classes.inviteHeading}>
                Request User Portfolio
              </Text>
              <div className={classes.invite}>
                <Select
                  placeholder='Choose one'
                  style={{ width: '250px' }}
                  onChange={(value) => {
                    setSelectedUser(parseInt(value));
                  }}
                >
                  {userArray.length > 0
                    ? userArray.map((value, index) => {
                        return (
                          <Select.Option key={index} value={index.toString()}>
                            {value.email}
                          </Select.Option>
                        );
                      })
                    : null}
                </Select>
                <Button
                  size='small'
                  auto
                  icon={<Icons.Plus />}
                  type='secondary'
                  onClick={handleClick}
                >
                  Request
                </Button>
              </div>

              <Text h2 className={classes.activityTitle}>
                Recent Activities
              </Text>

              {requested.length > 0 ? (
                requested.map((value) => {
                  return (
                    <EventListItem
                      username='ofekashery'
                      avatar='/assets/avatar.png'
                      created='3d'
                    >
                      Requested <b>{value.name}'s</b> Portfolio access.
                    </EventListItem>
                  );
                })
              ) : (
                <Text className={classes.message}>No activity</Text>
              )}
              <Text className={classes.viewAll}>
                <Link color>View more</Link>
              </Text>

              <Text h2 className={classes.activityTitle}>
                All Requests
              </Text>

              {requests.length > 0 ? (
                requests.map((value) => {
                  return (
                    <EventListItem
                      username='ofekashery'
                      avatar='/assets/avatar.png'
                      created='3d'
                    >
                      <b>{value.name}</b> requested portfolio access.
                      <br />
                      <br />
                      <Button
                        size='small'
                        auto
                        type='success'
                        onClick={() => handleAccept(value)}
                      >
                        Accept
                      </Button>
                      <Button size='small' auto>
                        Reject
                      </Button>
                    </EventListItem>
                  );
                })
              ) : (
                <Text className={classes.message}>No activity</Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
