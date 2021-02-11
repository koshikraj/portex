
const crypto = require('crypto')
const { Client, Where, ThreadID, createUserAuth, PrivateKey } = require('@textile/hub')

const keyInfo ={
    key:'bltodj5aqh47yxfcyhnbd2h7vja',
    secret:'bdns2q5lbnlqpyuwxrvj5n4ovqvcb764xokqsxyy',
}

export const solveChallenge = (identity) => {
    return new Promise((resolve, reject) => {

        const socket = io(process.env.REACT_APP_API_SERVER_URL);

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

const calculateHash = function(file){
    return crypto.createHash('sha256').update(file.toString()).digest()
}

export const getCredentials = async function(){
    // const credentials = JSON.parse(localStorage.getItem('payload'))
    // const threadDb = credentials.threadDbId
    // const client = Client.withUserAuth(credentials.payload)

    const threadDB = [1, 85, 198, 206, 167, 177, 224, 246, 180, 61, 82, 48, 209, 49, 177, 5, 46, 141, 115, 157, 64,
        191, 191, 250, 42, 70, 114, 237, 185, 71, 139, 172, 193, 79]

    const userAuth = await createUserAuth(keyInfo.key, keyInfo.secret)
    const seed = calculateHash("password")
    const seedPhase = new Uint8Array(Buffer.from(seed))
    const identity = PrivateKey.fromRawEd25519Seed(seedPhase)
    const privateKey = await PrivateKey.fromString(identity.toString())
    const client = await Client.withUserAuth(userAuth)
    await client.getToken(privateKey)
    const threadDb = Uint8Array.from(threadDB)
    return {client, threadDb}
}

export const registerNewUser = async function(did, name, email, encryptedKey){
    try {
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
            aesKey: encryptedKey,
            docID: "0"
        }

        const query = new Where('did').eq(did)
        const result = await client.find(threadId, 'RegisterUser', query)
        if (result.length<1){
            await client.create(threadId, 'RegisterUser', [data])
            localStorage.setItem("USER", JSON.stringify(data))
            return true
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
        console.log("ThreadDb:", typeof threadDb)
        console.log("Don:", threadId, typeof threadId)
        const result = await client.find(threadId, 'RegisterUser', query)
        console.log("result:",result)
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



export const sharePortfolio = async function(senderDid, receiverDid, portfolioData, documentId, encKey){
    try{
        const {threadDb, client} = await getCredentials()
        const threadId = ThreadID.fromBytes(threadDb)

        // update sender sharedWith array
        let query = new Where('did').eq(senderDid)
        let user = await client.find(threadId, 'RegisterUser', query)
        if(user[0].docID === '0'){
            user[0].docID = documentId
        }
        if (user[0].sharedWith.length===0){
            user[0].sharedWith = [receiverDid]
        }else {
            user[0].sharedWith.push(receiverDid)
        }
        await client.save(threadId,'RegisterUser',[user[0]])
        console.log("Updated!!1:")

        // update receiver sharedData array
        query = new Where('did').eq(receiverDid)
        user = await client.find(threadId, 'RegisterUser', query)
        if (user[0].sharedData.length===0){
            user[0].sharedData = [{
                encryptedKey: encKey,
                documentId: documentId,
                sender: senderDid
            }]
        }else {
            user[0].sharedData.push({
                encryptedKey: encKey,
                documentId: documentId,
                sender: senderDid
            })
        }
        await client.save(threadId,'RegisterUser',[user[0]])
        console.log("Updated!!2:")
        return true
    }catch (e) {
        console.log("Err:",e)
        return false
    }

}

export const getSharedPortfolios = async function(did){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(did)
    let user = await client.find(threadId, 'RegisterUser', query)
    if (user[0].sharedData.length===0) {
        return []
    }
    return user[0].sharedData
}

export const getAllRequests = async function(did){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(did)
    let user = await client.find(threadId, 'RegisterUser', query)
    if (user[0].requests.length===0) {
        return []
    }
    return user[0].requests
}

export const requestPortfolio = async function(senderDid, receiverDid){
    const {threadDb, client} = await getCredentials()
    const threadId = ThreadID.fromBytes(threadDb)

    // update sender sharedWith array
    let query = new Where('did').eq(receiverDid)
    let user = await client.find(threadId, 'RegisterUser', query)
    if (user[0].requests.length===0) {
        user[0].requests = [senderDid]
        return true
    }
    user[0].requests.push(senderDid)
    return true
}

/**
 * Create symmetric key for file encryption
 * @returns {null|Buffer}
 */
export const generateCipherKey = function(){
    try {
        const seed = crypto.randomBytes(32).toString()
        console.log(seed)
        return new Promise((resolve)=>{
            const cipherKey = crypto.createHash('sha256').update(seed).digest();
            console.log("AES Key:",cipherKey)
            resolve(cipherKey)
        })
    }catch (err) {
        console.error("Error while generating symmetric key:",err)
        return null
    }
}
