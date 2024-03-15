# Twitter API 

## Technologies 
JavaScript, Node.js, Express.js, JWT, Nodemon, MongoDB, Mongoose 

## Description
The Twitter API is a backend service that provides endpoints for various social media operations, including user registration, authentication, tweeting, following, liking, commenting, and retweeting.

## Key Features 
- User registration and authentication
- Tweet creation, retrieval, update, and deletion
- Following and unfollowing other users
- Liking tweets
- Posting and retrieving comments on tweets
- Retweeting tweets

## Routes

### User Routes

- **POST /api/v1/user/register**: Register a new user.
- **POST /api/v1/user/login**: Log in an existing user.
- **POST /api/v1/user/logout**: Log out the current user.
- **GET /api/v1/user/getMe**: Get current user details.
- **PATCH /api/v1/user/updateMe**: Update current user details.
- **DELETE /api/v1/user/:userId**: Delete a user.

### Tweet Routes

- **POST /api/v1/tweet**: Create a new tweet.
- **GET /api/v1/tweet/:tweetId**: Get a specific tweet.
- **PATCH /api/v1/tweet/:tweetId**: Update a tweet.
- **DELETE /api/v1/tweet/:tweetId**: Delete a tweet.

### Follow Routes

- **POST /api/v1/follow/:followedId**: Follow a user.
- **DELETE /api/v1/follow/:followedId**: Unfollow a user.
- **GET /api/v1/follow/getFollowers/:userId**: Get followers of a user.
- **GET /api/v1/follow/getFollowings/:userId**: Get users followed by a user.

### Like Routes

- **POST /api/v1/like/:tweetId**: Like a tweet.
- **GET /api/v1/like/getAllLikes/:tweetId**: Get likes for a tweet.

### Comment Routes

- **POST /api/v1/comment/:tweetId**: Post a comment on a tweet.
- **GET /api/v1/comment/getAllComments/:tweetId**: Get comments for a tweet.

### Retweet Routes

- **POST /api/v1/retweet/:tweetId**: Retweet a tweet.
- **DELETE /api/v1/retweet/:retweetId**: Delete a retweet.
- **GET /api/v1/retweet/:userId**: Get retweets by a user.

### Authentication

The API uses JSON Web Tokens (JWT) for authentication. After registering or logging in, users receive a JWT token that they need to include in the headers of subsequent requests for protected routes.

