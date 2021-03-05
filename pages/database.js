import React from 'react'
import { createAPISig, Client, createUserAuth, PrivateKey }  from '@textile/hub'
import {getLoginUser, registerNewUser, getAllUsers, sharePortfolio} from "../lib/threadDb";

export default function database(){

    const registrationSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'RegisterUser',
        type: 'object',
        properties: {
            _id: {type:'string'},
            did: {type:'string'},
            name: {type: 'string'},
            email: {type: 'string'},
            sharedWith: {type:'array'},     // contains user with whom data is shared
            requests: {type:'array'},       // contains all incoming requests
            sharedData: {type:'array'},     // contains all shared portfolios
            requested: {type:'array'},      // contains all outgoing requests
            aesKey: {type:'object'}
        },
    }

    const keys ={
        USER_API_KEY:'bltodj5aqh47yxfcyhnbd2h7vja',
        USER_API_SECRET:'bdns2q5lbnlqpyuwxrvj5n4ovqvcb764xokqsxyy',
    }

    const initializeNewThreadDb = async () =>{
        console.log("Authorizing...")
        const userAuth = await createUserAuth(keys.USER_API_KEY,keys.USER_API_SECRET)
        const privateKey = await PrivateKey.fromRandom()
        const dbClient = await Client.withUserAuth(userAuth)
        await dbClient.getToken(privateKey)

        console.log("Creating db...")
        const threadID = await dbClient.newDB()
        console.log("DB created!!!")
        console.log("ThreadId:",threadID.buf)

        console.log("Creating tables...")
        await dbClient.newCollection(threadID, {name:'RegisterUser', schema: registrationSchema})
        console.log("Tables created!!:")

        return threadID.buf
    }

    const register = async ()=>{
        console.log("Registering new user!!")
        const status = await registerNewUser('did2','shubham','s@gmail.com')
        if(status)
            console.log("User registered!!")
        else
            console.log("Some error!!")
    }

    const loginUser = async ()=>{
        console.log("Getting login user!!")
        const user = await getLoginUser('did2')
        if(user!==null) {
            console.log("User login!!", user)
        }
        else
            console.log("Some error!!")
    }


    const allUser = async ()=>{
        console.log("getting all user!!")
        const {caller,userArray} = await getAllUsers('did1')
        if(caller!==null && userArray!==null) {
            console.log("all users!!")
            console.log("Caller:",caller)
            console.log("userArray:",userArray)
        }
        else
            console.log("Some error!!")
    }

    const shareProfile = async ()=>{
        console.log("Sharing portfolio!!")
        const status = await sharePortfolio('did1','did2', "portfolio")
        if (status)
            console.log("Shared!!")
        else
            console.log("Some error!!")
    }

    const getProfile = async ()=>{

    }

    return(
        <div>
            <h1> Thread DB</h1><br/>
            <button onClick={initializeNewThreadDb}>Initialize DB</button><br/><br/>
            <button onClick={register}>Register</button><br/><br/>
            <button onClick={loginUser}>Login User</button><br/><br/>
            <button onClick={allUser}>All User</button><br/><br/>
            <button onClick={shareProfile}>share</button><br/><br/>
            <button onClick={getProfile}>Get Portfolio</button><br/><br/>

        </div>
    )
}