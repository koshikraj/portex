const fs = require('fs')
const {initializeNewThreadDb, getThreadId} = require("./hub-helpers");

module.exports = (app) => {

    app.get('/initializeDb', async (req, res) => {
        const thread = await initializeNewThreadDb();
        const threadID = Array.from(thread)
        console.log("Writing to file...")
        fs.writeFile(process.env.DB_FILE_NAME, JSON.stringify({
            threadId: threadID
        }), (err) => {
            if (err)
                console.log("Err:", err)
            console.log("ThreadId stored in file!!!")
        })
        res.send({message: 'New db created!!'})
    })

    app.get('/getId', async (req, res) => {
        const threadId = await getThreadId()
        res.send({threadId: threadId})
    })

}