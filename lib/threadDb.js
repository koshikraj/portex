
const crypto = require('crypto')
const { Client, Where, ThreadID } = require('@textile/hub')
const io = require('socket.io-client');

export const solveChallenge = (identity) => {
    return new Promise((resolve, reject) => {

        const socket = io(process.env.NEXT_PUBLIC_MIDDLEWARE_URL);
        socket.on("connect", () => {
            const publicKey = identity.public.toString();

            // Send public key to server
            socket.emit('authInit', JSON.stringify({
                pubKey: publicKey,
                type: 'token'
            }));

            socket.on("authMsg", async (event) => {
                const data = JSON.parse(event)
                switch (data.type) {
                    case 'error': {
                        reject(data.value);
                        break;
                    }

                    //solve the challenge
                    case 'challenge': {
                        const buf = Buffer.from(data.value)
                        const signed = await identity.sign(buf)
                        socket.emit("challengeResp", signed);
                        break;
                    }

                    //get the token and store it
                    case 'token': {
                        resolve(data.value)
                        socket.disconnect();
                        break;
                    }
                }
            })
        });
    });
}

export const loginUserWithChallenge = async function(id){
    if (!id) {
        throw Error('No user ID found')
    }

    /** Use the identity to request a new API token when needed */
    const credentials = await solveChallenge(id);
    localStorage.setItem('payload',JSON.stringify(credentials))
    const client = await Client.withUserAuth(credentials.payload)
    console.log('Verified on Textile API!!')
    return client
}

export const getCredentials = async function(){
    const credentials = JSON.parse(localStorage.getItem('payload'))
    const threadDB = credentials.threadDbId
    const client = Client.withUserAuth(credentials.payload)
    const threadDb = Uint8Array.from(threadDB)
    return {client, threadDb}
}

export const checkEmailExists = async function(email){
    try{
        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)
        const query = new Where('email').eq(email)
        const result = await client.find(threadId, 'RegisterUser', query)
        return result.length===1
    }catch (e){
        console.log("Error:",e)
        return false
    }
}

export const registerNewUser = async function(did, name, email, encryptedKey, signUpMode){
    try {
        console.log("mode:",signUpMode)
        //generate aes key for the user
        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)
        const data = {
            did:did,
            name: name,
            email: email,
            sharedWith: [],
            requests: [],
            sharedData: [],
            requested: [],
            aesKey: encryptedKey,
            docID: "0",
            signUpMode: signUpMode
        }

        const query = new Where('did').eq(did)
        const result = await client.find(threadId, 'RegisterUser', query)
        if (result.length<1){
            await client.create(threadId, 'RegisterUser', [data])
            localStorage.setItem("USER", JSON.stringify(data))
            return data
        }
        console.log("User already exists!!")
        return false
    }catch(err){
        console.log("err:",err)
        return false
    }
}

export const getLoginUser = async function(did){
    try {
        const {client, threadDb} = await getCredentials()
        const query = new Where('did').eq(did)
        const threadId = ThreadID.fromBytes(threadDb)
        const result = await client.find(threadId, 'RegisterUser', query)

        if (result.length<1){
            console.log("Please register user!")
            return null
        }
        return result[0]
    }catch (err) {
        console.log("err:",err)
        return null
    }
}

export const getAllUsers = async function(did){
    try {
        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)
        const registeredUsers = await client.find(threadId, 'RegisterUser', {})
        let caller
        let userArray = []

        for (let i=0;i<registeredUsers.length;i++){
            const result = registeredUsers[i]
            const value = {
                name: result.name,
                email: result.email,
                did: result.did
            }
            if (did.toLowerCase() === result.did.toLowerCase()) {
                caller = value
            }
            else {
                userArray.push(value)
            }
        }

        return {
            userArray: userArray,
            caller: caller
        }
    }catch (e){
        console.log("err:",e)
        return null
    }
}

export const sharePortfolio = async function(sender, receiver, documentId, encKey, requestId){
    try{

        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)

        // update sender sharedWith array
        let query = new Where('did').eq(sender.did)
        let user = await client.find(threadId, 'RegisterUser', query)
        if(user[0].docID === '0'){
            user[0].docID = documentId
        }
        if (user[0].sharedWith.length===0){
            user[0].sharedWith = [receiver.senderDid]
        }else {
            user[0].sharedWith.push(receiver.senderDid)
        }

        user[0].requests = user[0].requests.filter((item) => item.requestId !== requestId)
        console.log("Removed!!")

        await client.save(threadId,'RegisterUser',[user[0]])

        // update receiver sharedData array
        query = new Where('did').eq(receiver.senderDid)
        user = await client.find(threadId, 'RegisterUser', query)
        if (user[0].sharedData.length===0){
            user[0].sharedData = [{
                encryptedKey: encKey,
                documentId: documentId,
                senderName: sender.name,
                senderEmail: sender.email,
                senderDid: sender.did
            }]
        }else {
            user[0].sharedData.push({
                encryptedKey: encKey,
                documentId: documentId,
                senderName: sender.name,
                senderEmail: sender.email,
                senderDid: sender.did
            })
        }
        await client.save(threadId,'RegisterUser',[user[0]])
        return true
    }catch (e) {
        console.log("Err:",e)
        return false
    }

}

export const rejectPortfolioRequest = async function(sender, requestId){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    try{
        // update sender sharedWith array
        let query = new Where('did').eq(sender.did)
        let user = await client.find(threadId, 'RegisterUser', query)
        user[0].requests = user[0].requests.filter((item) => item.requestId !== requestId)
        console.log("Removed!!")
        await client.save(threadId,'RegisterUser',[user[0]])
        return true
    }catch (e) {
        console.log("Error:",e)
        return false
    }
}

// not used
export const getSharedPortfolios = async function(did){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(did)
    let user = await client.find(threadId, 'RegisterUser', query)

    if (user.length === 0 || user[0].sharedData.length===0) {
        return []
    }
    return user[0].sharedData
}

// Not used
export const getAllRequests = async function(did){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(did)
    let user = await client.find(threadId, 'RegisterUser', query)
    if (user.length === 0 ||user[0].requests.length===0) {
        return []
    }
    return user[0].requests
}

// Not Used
export const getAllRequested = async function(did){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(did)
    let user = await client.find(threadId, 'RegisterUser', query)

    if (user.length === 0 || user[0].requested.length===0) {
        return []
    }
    return user[0].requested
}

export const requestPortfolio = async function(sender, receiver){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)
    let query = new Where('did').eq(receiver.did)
    let user = await client.find(threadId, 'RegisterUser', query)
    if (user[0].requests.length===0) {
        user[0].requests = [{
            senderDid:sender.did,
            name: sender.name,
            requestId: user[0].requests.length+1
        }]
    }else {
        user[0].requests.push({
            senderDid:sender.did,
            name: sender.name,
            requestId: user[0].requests.length+1
        })
    }
    await client.save(threadId,'RegisterUser',[user[0]])

    query = new Where('did').eq(sender.did)
    user = await client.find(threadId, 'RegisterUser', query)
    if (user[0].requested.length===0) {
        user[0].requested = [{
            receiverDid:receiver.did,
            name: receiver.name
        }]
    }else {
        user[0].requested.push({
            receiverDid:receiver.did,
            name: receiver.name
        })
    }
    await client.save(threadId,'RegisterUser',[user[0]])
    return true
}

export const generateCipherKey = function(){
    try {
        const seed = crypto.randomBytes(32).toString()
        return new Promise((resolve)=>{
            const cipherKey = crypto.createHash('sha256').update(seed).digest();
            resolve(cipherKey)
        })
    }catch (err) {
        console.error("Error while generating symmetric key:",err)
        return null
    }
}

export const encryptData = function(data,cipherKey){
    return new Promise((resolve)=>{
        let iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes256', cipherKey, iv);
        const encryptedData= Buffer.concat([
            iv,
            cipher.update(data),
            cipher.final()
        ]);
        resolve(encryptedData)
    })
}

export const decryptData = async function(encryptedData,cipherKey){
    const iv = encryptedData.slice(0,16)
    encryptedData = encryptedData.slice(16)
    return new Promise((resolve)=>{
        const decipher = crypto.createDecipheriv("aes256",cipherKey,iv)
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
        resolve(decryptedData)
    })
}
