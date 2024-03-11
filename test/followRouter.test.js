// const express = require("express")
// const axios = require("axios")
// const request = require("supertest")
// const dotenv = require("dotenv")
// const userRouter = require("../routes/userRouter")
// const cookieParser = require("cookie-parser")
// dotenv.config({ path: "./.env" })
// const followRouter = require("../routes/followRouter")
// const app = express()
// app.use(express.json())


// app.use("/tweeter/follows/", followRouter)
// app.use("/tweeter/users/", userRouter)

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: err.statusText || "error",
//     message: err.message
//   })
// })

// describe('Test', () => {
//   it('follow', async () => {
//     // Step 1: Login
//     const loginURL = "http://localhost:3939/tweeter/users/login";
//     const loginResponse = await axios.post(loginURL, {
//       email: "follower1@gmail.com",
//       password: "13579net"
//     });

//     const bearerToken = loginResponse.data.accessToken;

//     // Step 2: Create Follow
//     const url = "http://localhost:3939/tweeter/tweets/like/65eb060e54ff2f64206ca90b"

//     const response = await axios.post(url, {}, { /////// error 
//       headers: {
//         Authorization: `Bearer ${bearerToken}`, /////// error
//         'Content-Type': 'application/json',
//       }
//     })
//     const body = response.data
//     const statusCode = response.status

//     expect(statusCode).toBe(400);
//     expect(body.status).toBe('error');
//   });

// })