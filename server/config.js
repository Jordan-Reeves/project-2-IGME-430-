// read in all the .env inog
require('dotenv').config();

const connections = {
    development :{
        http: {
            port: process.env.PORT || process.env.NODE_PORT || 3000,
        },
        mongo:  'mongodb://127.0.0.1/project2Database'|| process.env.MONGODB_URI,
        redis: process.env.REDISCLOUD_URL,
    },
    production: {
        http: {
            port: process.env.PORT || process.env.NODE_PORT || 3000,
        },
        mongo: process.env.MONGODB_URI,
        redis: process.env.REDISCLOUD_URL,
    },
}


module.exports = {
    connections: connections[process.env.NODE_ENV],
    secret: process.env.SECRET,
}