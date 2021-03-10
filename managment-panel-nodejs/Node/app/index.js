const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Company = require('./models/company');

class Application {
  constructor() {
    this.setExpressServer();
    this.setMongooseConnection();
    this.setConfig();
    this.setRoutes();
  }
  setExpressServer() {
    app.listen(process.env.PORT_NUMBER , () => {
      console.log(`listening on port ${process.env.PORT_NUMBER}`);
    });
  }

  setMongooseConnection() {
    mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(
        () => {
          console.log('MongoDB Connected!');
        },
        () => {
          console.log('MongoDB Failed!');
        }
      );
  }

  setConfig() {
    app
      .use(express.static('public'))
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .set('view engine', 'ejs')
      .set('views', path.resolve('./resource/views'))
      .use((req, res, next) => {
        res.locals.path = req.url;
        next();
      })
      .use((req, res, next) => {
        Company.find({}).then((companiess) => {
          res.locals.companies = companiess;
          next();
        });
      });
  }

  setRoutes() {
    app.use('/', require('./routes/web'));
    app.use((req, res) => {
      res.render('error/404');
    });
    app.use((error, req, res) => {
      res.render('error/500');
    });
  }
}

module.exports = Application;
