const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  }
});

module.exports = SubProductSchema;
