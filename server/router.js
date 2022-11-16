const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // (url, middleware operations..., controller)
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getImages', mid.requiresLogin, controllers.MoodImage.getImages);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/upload', mid.requiresLogin, controllers.MoodImage.uploadPage);
  app.post('/upload', mid.requiresLogin, controllers.MoodImage.uploadFile);

  // app.post('/deleteMoodImage', mid.requiresLogin, controllers.Domo.deleteDomo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
