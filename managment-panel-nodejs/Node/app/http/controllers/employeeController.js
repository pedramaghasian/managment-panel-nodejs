const Controller = require('./controller');
const Employee = require('../../models/employee');
const Company = require('../../models/company');
const moment = require('moment');
const company = require('../../models/company');

class EmployeeController extends Controller {
  getEmployee(req, res, next) {
    Employee.find({})
      .then((employees) => {
        res.render('employee/employee', { employees, date: moment });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  getNew(req, res) {
    return res.render('employee/new', { alert: '' });
  }

  postNew(req, res, next) {
    Employee.findOne({
      national_number: req.body.national_number,
    })
      .then((employee) => {
        if (employee) {
          return res.render('employee/new', {
            alert: 'این کارمند قبلا ثبت شده است',
          });
        }
        if (this.validation(req)) {
          return res.render('employee/new', {
            alert: 'فیلدهای خالی را پر کنید',
          });
        }
        Company.findOne({ _id: req.body.companyId }).then((company) => {
          if (!company) {
            return res.render('employee/new', {
              alert: 'لطفا شرکت خود را به درستی انتخاب نمایید',
            });
          }
          const newEmployee = new Employee({
            first_name: req.body.first_name,
            national_number: req.body.national_number,
            last_name: req.body.last_name,
            isManager: req.body.isManager === 'manager' ? true : false,
            gender: req.body.gender,
            birth_date: new Date(req.body.birth_date),
            companyId: req.body.companyId,
          });
          newEmployee.save((error) => {
            if (error) {
              return res.render('employee/new', {
                alert: 'ثبت شرکت با خطا مواجه شد لطفا دوباره سعی کنید',
              });
            }
            res.redirect(`/company/${req.body.companyId}`);
          });
        });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  getSingle(req, res, next) {
    Employee.findOne({ _id: req.params.id })
      .populate('companyId',{company_name:1})
      .then((employee) => {
        if (!employee) {
          return res.render(`/company/${employee.companyId}`);
        }
        res.render('employee/single', { employee, date: moment });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  postEdit(req, res, next) {
    Employee.findOne({ _id: req.body.employeeId })
      .then((employee) => {
        if (!employee) {
          return res.redirect(`/employee/${employee._id}`);
        }
        employee.first_name = req.body.first_name;
        employee.national_number = req.body.national_number;
        employee.last_name = req.body.last_name;
        employee.birth_date = req.body.birth_date || employee.birth_date;
        employee.isManager = this.checkIsManager(req, employee);
        employee.companyId = req.body.companyId || employee.companyId;
        return employee.save().then(() => {
          res.redirect(`/employee/${employee._id}`);
        });
      })
      .catch((err) => {
        return next(new Error(err));
      });
  }

  postDelete(req, res) {
    Employee.deleteOne({ _id: req.body.employeeId })
      .then(() => {
        return res.redirect(`/company/${req.body.companyId}`);
      })
      .catch(() => {
        return res.render('company/company', {
          alert: 'مشکلی پیش آمده لطفا دویاره امتحان کنید',
        });
      });
  }

  checkIsManager(req, employee) {
    let result = employee.isManager;
    switch (req.body.isManager) {
      case 'manager':
        result = true;
        break;
      case 'employee':
        result = false;
        break;
      default:
        result;
        break;
    }
    return result;
  }

  validation(req) {
    if (
      req.body.first_name.trim() === '' ||
      req.body.last_name.trim() === '' ||
      req.body.gender.trim() === '' ||
      req.body.national_number.trim() === '' ||
      req.body.birth_date.trim() === '' ||
      req.body.companyId.trim() === ''
    ) {
      return true;
    }
    return false;
  }
}

module.exports = new EmployeeController();
