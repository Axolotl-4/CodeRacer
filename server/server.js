const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser')

const app = express();

const oauthController = require('./controllers/oauthController')
const sessionController = require('./controllers/sessionController')
const cookieController = require('./controllers/cookieController')
const PORT = 3000;
const apiRouter = require('./routes/api')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser());






if (process.env.NODE_ENV === 'production') {

  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}  

app.get('/callback',
  oauthController.getGithubToken,
  oauthController.getUser,
  sessionController.createSession,
  (req, res) => {
    if(process.env.NODE_ENV === 'development'){
      console.log("WE ARE IN DEV ENVIRONMENT")
      res.redirect("localhost:8080");
    
    }
    else{
    res.sendFile(path.join(__dirname, '../index.html'))
    }
});

app.get('/verify', sessionController.verify, (req, res) => {
  res.status(200).send();
})

app.use('/api', apiRouter)

app.use('*', (req, res, next) => {
  res.status(404).send('YOU TRIED A NON EXISTENT PATH')
})

app.use(function(err, req, res, next) {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  }
  const errorObj = Object.assign({}, defaultErr, err)
  console.log(errorObj.log)
  res.status(errorObj.status).send(JSON.stringify(errorObj.message))
})
  
  
app.listen(PORT, ()=> console.log('listening on port 3000'))
module.exports = app;