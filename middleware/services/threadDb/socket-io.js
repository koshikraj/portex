const Emittery = require('emittery')
const {getAPISig, newClientDB, getThreadId} = require("./hub-helpers");

// const threadDbId = [1, 85, 2, 162, 50, 48, 209, 242, 140, 224, 92, 53, 163, 197, 239, 228, 119, 247, 83, 123, 70, 224,
//   215, 43, 215, 103, 142, 189, 149, 148, 228, 164, 171, 38]

module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New user connected');

      socket.on('authInit', async (msg) => {
        const emitter = new Emittery();
        console.log('message: ' + msg);
        try {
          const data = JSON.parse(msg);
          switch (data.type) {

            case 'token': {
              if (!data.pubKey) {
                throw new Error('missing pubkey')
              }

              const db = await newClientDB()

              const token = await db.getTokenChallenge(
                data.pubKey,
                (challenge) => {
                  return new Promise((resolve, reject) => {

                    //send challenge to client
                    io.emit('authMsg', JSON.stringify({
                      type: 'challenge',
                      value: Buffer.from(challenge).toJSON(),
                    }))

                    //wait for challenge to get solved
                    socket.on('challengeResp', (sig) => {
                      resolve(Buffer.from(sig))
                    });

                  })
                })

              console.log("token:", token)

              /** Get API authorization for the user */
              const auth = await getAPISig(3600)

              /** Include the token in the auth payload */
              const payload = {
                ...auth,
                token: token,
                key: process.env.USER_API_KEY,
              };

              // send token to client
              const threadDbId = await getThreadId()
              io.emit('authMsg', JSON.stringify({
                type: 'token',
                value: {
                  payload: payload,
                  threadDbId: threadDbId
                },

              }))
              console.log("DONE!!!")
              break;
            }

            case 'challenge': {
              if (!data.sig) {
                throw new Error('missing signature (sig)')
              }
              await emitter.emit('challengeResp', data.sig);
              break;
            }
          }
        } catch (error) {
          console.error("Error:", error)
          /** Notify our client of any errors */
          io.emit('authMsg',JSON.stringify({
            type: 'error',
            value: error.message,
          }))
        }
      });

    });

    io.on('disconnect', socket =>{
      console.log('Socket disconnected!!!')
    })
}
