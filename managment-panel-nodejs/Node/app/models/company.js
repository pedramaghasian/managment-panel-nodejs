const mongoose = require('mongoose');
const Employee = require('./employee');

const companySchema = mongoose.Schema({
  company_name: { type: String, required: true },
  registration_number: { type: Number, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone_number: { type: Number, required: true },
  date_of_registration: { type: Date, required: true },
});

companySchema.pre('deleteOne', { document: true }, function (next) {
  Employee.deleteMany({ companyId: this._id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(new Error(err));
    });
});

module.exports = mongoose.model('Company', companySchema);
