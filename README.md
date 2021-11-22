# BACKEND
## Folder Structure

```
backend\
 |--controllers\    # Route controllers and handle business logic
 |--middlewares\    # Custom express middlewares
 |--managements\    # Route controllers for admin usage
 |--test\           # test function
 |--models\         # Mongoose models 
 |--routes\         # Routes
 |--utils\          # Utility classes and functions
 |--main.js         # Entry point
 ```

## API Documentation
To view the list of available APIs and their specifications, run the server and go to `http://localhost:4000/api/docs` in your browser.
- username: admin
- password: 25e4e931ee67c97bc504dc18c2574495139e63c18790f9e3b7418d49143d0f68
## Start
- To install dependencies, run `yarn install`
- To start the server, run `yarn start`
- To start the server in development mode, run `yarn dev`
## Test
- To run the test suite, run `yarn test`
# FRONTEND
## Folder Structure

```
src\
 |--app\            # Store of redux that includes all of reducers
 |--assets\         #It includes images
 |--component\      # Components that can be used in other place in the features
 |--constants\      # Declare const variable and routes for app.js
 |--features\       # It includes all of features of the rentme project. It also can be called PAGES.
    |--About\       # Content about the privacy of the rentme.
    |--Admin\       # All function of the admin - "update, delete, insert, manage profit, chart profit".
    |--Auth\        # It includes Sign In, Sign Up, and Forgot password pages".
    |--BecomePlayer\  # Form to user can register becombe to the professional player.
    |--ChatRoom\    # User can interact with the player together when rent player trading is success.
    |--Home\    # Layout root in the home page.
    |--PrivateChat\ # Layout likes the messenger that help user can chat the players whom user want.
    |--RentPlayer\  # It includes layout card contains short information of players. Besides, it includes details page - it shows more details of each that player. 
    |--Setting\     # Setting helps user can Update user's information. Moreover, it includes Withdraw, Deposit, Setting privacy, and can see history of wallet as well as transaction.
    |--Streamhub\   # The function will update in the future.
 |--utils\          # Utility functions
 |--style.scss\     # Setup scss style
 |--index.js        # Entry point
 ```

## Start
- To install dependencies, run `yarn install`
- To start the server, run `yarn start`

# Link demo: 
-Website: https://rentme.games
-API docs: https://rentme.games/api/docs
