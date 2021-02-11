import React, { useState, useEffect } from 'react';
import { GeistUIThemes, Text, Link, Button, Select } from '@geist-ui/react';
import makeStyles from './makeStyles';
import EventListItem from './EventListItem.js';
import PortfolioCard from './PortfolioCard';
import SignUp from './auth/SignUp';
import {
  getAllRequested,
  getAllUsers,
  requestPortfolio,
  getAllRequests,
  sharePortfolio,
  getSharedPortfolios,
    decryptData
} from "../lib/threadDb";
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

const Content = ({idx}) => {

  const [caller, setCaller] = useState(null)
  const [userArray, setUserArray] = useState([{}])
  const [selectedUser, setSelectedUser] = useState(0)
  const [requested,setRequested] = useState([])
  const [requests,setRequests] = useState([])
  const [sharedPortfolio, setSharedPortfolio] = useState([])

  useEffect(()=>{
    async function load(){
      const user = JSON.parse(localStorage.getItem('USER'))
      const {userArray, caller} = await getAllUsers(user.did)
      setCaller(caller)
      setUserArray(userArray)

      const requestedArray = await getAllRequested(user.did)
      //console.log("Array:",requestedArray)
      setRequested(requestedArray)

      const requests = await getAllRequests(user.did)
      setRequests(requests)

      const userPortfolios = await getSharedPortfolios(user.did)

      let portfolios = []
      if (idx) {
        userPortfolios.map(async (value) => {
          const aesKey = await idx.ceramic.did.decryptDagJWE(value.encryptedKey)
          const encData = await idx.ceramic.loadDocument(value.documentId)
          const decryptedData = await decryptData(Buffer.from(encData._state.content.portfolio, "hex"), aesKey)
          const res = JSON.parse(decryptedData.toString("utf8"))
          console.log("Decryp:", res)
          portfolios.push({
            name: value.senderName,
            email: value.senderEmail,
            did: value.senderDid,
            portfolio: res
          })
        })
        setSharedPortfolio(portfolios)
      }
    }
    load()
  },[idx])

  console.log("Port:",sharedPortfolio)

  const handleClick = async ()=>{
    const res = await requestPortfolio(caller, userArray[selectedUser])
    if (res){
      requested.push({
        receiverDid:userArray[selectedUser].did,
        name: userArray[selectedUser].name
      })
    }
  }

  const handleAccept = async (receiver)=>{
    // get the key from local-> dec-> enc-> push to threadDb
    const docId = localStorage.getItem("docId")
    const user = JSON.parse(localStorage.getItem("USER"))
    const dec = await idx.ceramic.did.decryptDagJWE(user.aesKey)
    const encKey = await idx.ceramic.did.createDagJWE(dec, [receiver.senderDid])
    await sharePortfolio(caller,receiver, docId,encKey);
  }

  const handleReject = async ()=>{

  }

  const classes = useStyles();
  return (
    <>
      {/* testing purpose */}
      <div className={classes.root}>
        <div className={classes.content}>
          <Text h3>Portfolio’s shared with me</Text>
          <div className={classes.row}>
            <div className={classes.projects}>
              {
                sharedPortfolio.length>0 ?
                    sharedPortfolio.map((value => {
                      return(
                          <PortfolioCard
                              name={value.name}
                              address={value.did}
                              email={value.email}
                          />
                      )
                    })) :
                    <h3> No shared portfolio </h3>
              }
            </div>

            {/* right- */}

            <div className={classes.activity}>
              <Text h2 className={classes.inviteHeading}>
                Search User
              </Text>
              <div className={classes.invite}>
                <Select placeholder='Choose one' style={{ width: '250px' }}
                        onChange={(value)=> {setSelectedUser(parseInt(value))}}>
                  {
                    userArray.length>0 ?
                        userArray.map((value,index) => {
                          return (
                              <Select.Option key={index} value={index.toString()}>{value.name}</Select.Option>
                          )
                        })
                        : null
                  }
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
                Recent Activity
              </Text>

              {
                requested.length>0 ?
                    requested.map((value => {
                      return(
                          <EventListItem
                              username='ofekashery'
                              avatar='/assets/avatar.png'
                              created='3d'
                          >
                            Requested <b>{value.name}'s</b> Portfolio access.
                          </EventListItem>
                      )
                    })):
                    <h5>No activity</h5>
              }
              <Text className={classes.viewAll}>
                <Link color>View My Profile Access Request lists</Link>
              </Text>

              <Text h2 className={classes.activityTitle}>
                Requests
              </Text>

              {
                requests.length>0 ?
                    requests.map((value => {
                      return(
                          <EventListItem
                              username='ofekashery'
                              avatar='/assets/avatar.png'
                              created='3d'
                          >
                            <b>{value.name}</b> requested portfolio access.<br/>
                            <Button size='small' auto type='success' onClick={()=>handleAccept(value)}>
                              Accept
                            </Button>
                            <Button size='small' auto>
                              Reject
                            </Button>
                          </EventListItem>
                      )
                    })):
                    <h5>No requests</h5>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
