require('dotenv').config();
const userRouter = require('./routes');

module.exports = (app) => {
    app.use('/api', userRouter);
}