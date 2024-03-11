// const express = require("express")
// const axios = require("axios")
// const request = require("supertest")
// const dotenv = require("dotenv")
// const cookieParser = require("cookie-parser")
// dotenv.config({ path: "./.env" })
// const followRouter = require("../routes/followRouter")
// const app = express()
// app.use(express.json())


// app.use("/tweeter/follows/", followRouter)

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: err.statusText || "error",
//     message: err.message
//   })
// })

// describe('Test', () => {
//   it('login first to get accessToken and use it to ligin and the create tweet', async () => {

//     const loginURL = "http://localhost:3939/tweeter/users/login"
//     const loginResponse = await axios.post(loginURL, {
//       "email": "Abdo@gmail.com",
//       "password": "13579net"
//     })



//     const bearerToken = loginResponse["data"]["accessToken"]
//     const url = 'http://localhost:3939/tweeter/tweets/createTweet';

//     try {
//       const response = await axios.post(url, {}, {
//         headers: {
//           'Authorization': `Bearer ${bearerToken}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const body = response.data;
//       const statusCode = response.status;

//       console.log('Response:', body);
//       console.log('Status Code:', statusCode);

//       // Add assertions based on your endpoint's expected behavior
//       expect(statusCode).toBe(200);
//       expect(body.status).toBe('success');
//       // Add more assertions if needed
//     } catch (error) {
//       console.error('Error:', error.message);
//       throw error;
//     }
//   });

//   it('Delete tweet', async () => {

//     const loginURL = "http://localhost:3939/tweeter/users/login"
//     const loginResponse = await axios.post(loginURL, {
//       "email": "Abdo@gmail.com",
//       "password": "13579net"
//     })



//     const bearerToken = loginResponse["data"]["accessToken"]
//     const createTweetURL = 'http://localhost:3939/tweeter/tweets/createTweet';

//     const createTweetResponse = await axios.post(createTweetURL, {}, {
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const tweet = createTweetResponse["data"]["data"];
//     console.log("tweeeet",tweet["_id"])

//     const url = `http://localhost:3939/tweeter/tweets/deleteTweet/${tweet["_id"]}`;
//     const Response = await axios.delete(url, {}, {
//       headers: {
//         'Authorization': `Bearer ${bearerToken}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const body = Response.data
//     const statusCode = Response.statusCode
//     console.log('Response:', body);
//     console.log('Status Code:', statusCode);

//     // Add assertions based on your endpoint's expected behavior
//     expect(statusCode).toBe(200);
//     expect(body.status).toBe('success');
//     // Add more assertions if needed
//   });
// });
