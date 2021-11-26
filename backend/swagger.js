const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'RentMe API',
    description: '',
  },
  host: 'api.rentme.games',
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
        "name": "Auth",
        "description": "Auth endpoints"
    },
    {
        "name": "Users",
        "description": "Users endpoints"
    },
    {
      "name": "Services",
      "description": "Services endpoints"
    },
    {
        "name": "Players",
        "description": "Players endpoints"
    },
    {
        "name": "Dev",
        "description": "Dev endpoints"
    },
    {
      "name": "Conversations",
      "description": "Conversations endpoints"
    },
    {
      "name": "Managements",
      "description": "Managements endpoints"
  },
],
  securityDefinitions: {
    Authorization: {
      type: 'apiKey',
      name: 'Authorization',
      description: 'Value: Bearer ',
      in: 'header',
      scheme: 'bearer',
    },
  },
  definitions: {
    CreateUser: {
      $username: "test123", 
      $password: "Test!Passw0rd",
      $email: "test123@gmail.com", 
      $fullName: "test", 
      $role: 3
    },
    UpdateUserInfo: {
      $fullName: "", 
      $nickname: "", 
      $birthDate: "", 
      $gender: "", 
      $province: ""
    },
    UpdatePassword: {
      $password: "", 
      $newPassword: ""
    },
    PerformTransaction: {
      $money: 1,
      $type: 'deposit', 
      $paymentMethod: 'momo'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['routes/index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
