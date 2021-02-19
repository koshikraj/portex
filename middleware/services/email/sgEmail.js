const sgMail = require('@sendgrid/mail');
const sendDocTemplate = require('./templates/sendDocument');
const signedDocTemplate = require('./templates/signDocument')


module.exports = (app) => {

    app.post('/email/send', async (req, res) =>{

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
        to: req.body.recipients, // Change to your recipient
        from: 'signchain@consensolabs.com', 
        subject: 'Signchain - You have a new document to sign',
        html: sendDocTemplate(req.body.data.sender, req.body.data.docId),
        }
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
        res.send(JSON.stringify({status: true, msg: "Email sent successfully"}))
      })

    
      app.post('/email/sign', async (req, res) =>{

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
        to: req.body.recipients, // Change to your recipient
        from: 'signchain@consensolabs.com', 
        subject: 'Signchain - Your document is signed',
        html: signedDocTemplate(req.body.data.sender, req.body.data.docId),
        }
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
        res.send(JSON.stringify({status: true, msg: "Email sent successfully"}))
      })

      

}


