const Controller = require('./controller');
const Company = require('../../models/company');
const Employee = require('../../models/employee');
const moment = require('moment');

class ComapanyController extends Controller {



  getCompany(req, res, next) {
    if (this.objectLength(req.query) === 2 && this.isValidQuery(req.query)) {
      return this.getSearch(req, res, next);
    }
    Company.find({})
      .then((companies) => {
        return res.render('company/company', { companies, date: moment });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  getNew(req, res) {
    res.render('company/new', { alert: '' });
  }

  postNew(req, res, next) {
    Company.findOne({
      registration_number: req.body.registration_number,
      company_name: req.body.company_name,
    })
      .then((company) => {
        if (company) {
          return res.render('company/new', {
            alert: 'این شرکت قبلا ثبت شده است',
          });
        }
        const newCompany = new Company({
          company_name: req.body.company_name,
          registration_number: req.body.registration_number,
          city: req.body.city,
          state: req.body.state,
          phone_number: req.body.phone_number,
          date_of_registration: new Date(req.body.date_of_registration),
        });
        newCompany.save((error) => {
          if (error) {
            return res.render('company/new', {
              alert: 'ثبت شرکت با خطا مواجه شد لطفا دوباره سعی کنید',
            });
          }
          res.redirect('/company');
        });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  getSingle(req, res, next) {
    Company.findOne({ _id: req.params.id })
      .then((company) => {
        if (!company) {
          return res.render('company/company', { date: moment });
        }
        Employee.find({ companyId: company._id }).then((employee) => {
          res.render('company/single', { company, employee, date: moment });
        });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  postEdit(req, res, next) {
    Company.findOne({ _id: req.body.companyId })
      .then((company) => {
        if (!company) {
          return res.redirect('/company');
        }
        company.company_name = req.body.company_name;
        company.registration_number = req.body.registration_number;
        company.city = req.body.city;
        company.state = req.body.state;
        company.phone_number = req.body.phone_number;
        company.date_of_registration =
          req.body.date_of_registration || company.date_of_registration;
        return company.save().then(() => {
          res.redirect('/company');
        });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  postDelete(req, res) {
    Company.findOne({ _id: req.body.companyId })
      .then((company) => {
        if (!company) {
          return res.render('company/company', {
            alert: 'همچین شرکتی وجود ندارد',
            date: moment,
          });
        }
        company.deleteOne().then(() => {
          return res.redirect('/company/');
        });
      })
      .catch(() => {
        return res.render('company/company', {
          alert: 'مشکلی پیش آمده لطفا دویاره امتحان کنید',
          date: moment,
        });
      });
  }


  //search 
  getSearch(req, res, next) {
    const start = new Date(req.query['start-date']);
    const end = new Date(req.query['end-date']);
    Company.find({ date_of_registration: { $gt: start, $lt: end } })
      .then((companies) => {
        return res.render('company/company', { companies, date: moment });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  //helper Methode
  objectLength(obj) {
    let size = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }
  isValidQuery(obj) {
    if ('start-date' in obj && 'end-date' in obj) {
      if (obj['start-date'] < obj['end-date']) {
        return true;
      }
      return false;
    }
    return false;
  }
}

module.exports = new ComapanyController();
