// add this file to .gitignore

module.exports = {
    google: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    mongodb: {
        dbURI: process.env.DB_URL
    },
    session: {
        cookieKey: process.env.COOKIE_KEY
    }
};
