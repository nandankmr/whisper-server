const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Message", MessageSchema);
