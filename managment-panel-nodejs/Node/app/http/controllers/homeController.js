const Controller = require('./controller');

class HomeController extends Controller {
  getHome(req, res) {
    res.render('home');
  }
}

module.exports = new HomeController();
