const mongoose = require('mongoose')
const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connect to database success!!!!')
    } catch (error) {
        console.log(error.message)
         console.log('Can not connect to database !!!!')
    }
}
module.exports = connect