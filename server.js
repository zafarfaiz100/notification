require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
const http = require("http");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger.json");
const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};

app.use(cors());

app.use("/api/public", express.static(path.join(__dirname, "public")));

// parse requests increase
app.use(bodyParser({ limit: "50mb" }));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "User API",
      description: "User API Information",
      contact: {
        name: "Amazing Developer",
      },

      servers: ["http://localhost:5000"],
    },
  },
  // ['.routes/*.js']
  apis: ["server.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// database
const db = require("./app/models");

require("./app/routes/notification.routes")(app);

//#endregion

//seagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
