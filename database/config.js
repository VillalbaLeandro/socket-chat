
const mongoose = require('mongoose')
require('colors')
const dbConnection = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CNN)

        console.log('     Base de datos online    '.bold.bgGreen);
    } catch (error) {
        console.log(error);
        throw new Error('-  Error al iniciar la base de datos  -'.bgRed)
    }
}


module.exports = {
    dbConnection
}