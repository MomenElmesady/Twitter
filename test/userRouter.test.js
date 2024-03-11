// const express = require("express")
// const axios = require("axios")
// const request = require("supertest")
// const dotenv = require("dotenv")
// dotenv.config({ path: "./.env" })
// const userRouter = require("../routes/userRouter")
// const app = express()
// app.use(express.json())

// app.use("/tweeter/users/", userRouter)

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: err.statusText || "error",
//     message: err.message
//   })
// })

// describe('Just test', () => {
//   it('Get me', async () => {
//     // Step 1: Login
//     const loginURL = "http://localhost:3939/tweeter/users/login";
//     const loginResponse = await axios.post(loginURL, {
//       email: "follower1@gmail.com",
//       password: "13579net"
//     });

//     const bearerToken = loginResponse.data.accessToken;

//     const url = `http://localhost:3939/tweeter/users/getMe`;
//     console.log("Bearer Token:", bearerToken);

//     const response = await axios.get(url,{}, {
//       headers: {
//         Authorization: `Bearer ${bearerToken}`,
//         'Content-Type': 'application/json',
//       }
//     });

//     const { status, data } = response;

//     expect(status).toBe(200);
//     expect(data.status).toBe("success");
//     // Add more assertions if needed
//   });
// });
