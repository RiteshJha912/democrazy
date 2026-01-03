const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  pollId: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  votes: [{ type: Number }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);
