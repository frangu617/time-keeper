// models/workLog.js

const mongoose = require('mongoose');

const WorkLogSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const WorkLog = mongoose.model('WorkLog', WorkLogSchema);

module.exports = WorkLog;
