const { createAPISig, Client, createUserAuth, PrivateKey } = require('@textile/hub')
const fs = require('fs')
const UserRegistration = require('../../models/UserRegistration')
const DocumentStorage = require('../../models/Document')
const SignatureDetails = require('../../models/SignatureDetails')

const getAPISig = async (seconds = 300) => {
  const expiration = new Date(Date.now() + 1000 * seconds)
  return await createAPISig(process.env.USER_API_SECRET, expiration)
}

const newClientDB = async () => {
  const API = process.env.API || undefined
  const db = await Client.withKeyInfo({
    key: process.env.USER_API_KEY,
    secret: process.env.USER_API_SECRET
  }, API)
  return db;
}

const initializeNewThreadDb = async () =>{
  console.log("Authorizing...")
  const userAuth = await createUserAuth(process.env.USER_API_KEY,process.env.USER_API_SECRET)
  const privateKey = await PrivateKey.fromRandom()
  const dbClient = await Client.withUserAuth(userAuth)
  await dbClient.getToken(privateKey)

  console.log("Creating db...")
  const threadID = await dbClient.newDB()
  console.log("DB created!!!")

  console.log("Creating tables...")
  await dbClient.newCollection(threadID, {name:'RegisterUser', schema: UserRegistration})
  await dbClient.newCollection(threadID, {name:'Document', schema: DocumentStorage})
  await dbClient.newCollection(threadID, {name:'SignatureDetails', schema: SignatureDetails})
  console.log("Tables created!!:")

  return threadID.buf
}

const getThreadId = async () =>{
  const fileData = await fs.readFileSync(process.env.DB_FILE_NAME)
  const thread = JSON.parse(fileData)
  return thread.threadId
}

module.exports = {
  getAPISig,
  newClientDB,
  initializeNewThreadDb,
  getThreadId
}
