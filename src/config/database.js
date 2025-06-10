const DB = require('mongoose')


const db_connection = async () => {
    await DB.connect('mongodb+srv://smcc89:9NZWozUtp5CVn3sQ@clusterx.5ycdph1.mongodb.net/practice');  
}

module.exports = db_connection;
