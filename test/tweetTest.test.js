// const express = require("express")
// const axios = require("axios")
// const request = require("supertest")
// const dotenv = require("dotenv")
// dotenv.config({ path: "./.env" })
// const followRouter = require("../routes/followRouter")
// const app = express()
// app.use(express.json())

// app.use("/tweeter/follows/", followRouter)

// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//       status: err.statusText || "error",
//       message: err.message
//   })
// })
// describe('Test', () => {
//   it('Get User Followers', async () => {
//     const id = '65dcc67593fe9f5170311708';
//     const url = `http://localhost:3939/tweeter/follows/getFollowers/${id}`; // Replace yourPortNumber with the actual port number

//     try {
//       const response = await axios.get(url);

//       const body = response.data;
//       const statusCode = response.status;

//       console.log('Response:', body);
//       console.log('Status Code:', statusCode);

//       // Add assertions based on your endpoint's expected behavior
//       expect(statusCode).toBe(200);
//       expect(body["status"]).toBe("success")
//       // Add more assertions if needed
//     } catch (error) {
//       console.error('Error:', error.message);
//       // Handle the error or rethrow it based on your needs
//       throw error;
//     }
//   });

//   // it is error becouse we dont allowed to send body with get request 
//   it('Search in followers', async () => {
//     const id = '65dcc67593fe9f5170311708';
//     const url = `http://localhost:3939/tweeter/follows/searchInFollowers/${id}`; // Replace yourPortNumber with the actual port number

//     try {
//       const response = await axios.get(url,{name:"meme Ashraf"});

//       const body = response.data;
//       const statusCode = response.status;

//       console.log('Response:', body);
//       console.log('Status Code:', statusCode);

//       // Add assertions based on your endpoint's expected behavior
//       expect(statusCode).toBe(200);
//       // Add more assertions if needed
//     } catch (error) {
//       console.error('Error:', error.message);
//       // Handle the error or rethrow it based on your needs
//       throw error;
//     }
//   });

//   it("Like tweet", async()=>{
//     const loginURL = "http://localhost:3939/tweeter/users/login";
//     const loginResponse = await axios.post(loginURL, {
//       email: "follower1@gmail.com",
//       password: "13579net"
//     });
//     const bearerToken = loginResponse.data.accessToken;

//     const url = "http://localhost:3939/tweeter/tweets/like/65eb060e54ff2f64206ca90b"

//     const response = await axios.post(url,{},{ /////// error 
//       headers: {
//         Authorization: `Bearer ${bearerToken}`, /////// error
//         'Content-Type': 'application/json',
//       }
//     })
//     const body = response.data
//     const statusCode = response.status

//     expect(statusCode).toBe(200)
//     expect(body["status"]).toBe("success")
//   })
// });