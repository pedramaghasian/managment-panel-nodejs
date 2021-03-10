const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  national_number: { type: Number, required: true, unique: true },
  gender: { type: String, required: true },
  isManager: { type: Boolean, default: false },
  birth_date: { type: Date, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

module.exports = mongoose.model('Employee', employeeSchema);
