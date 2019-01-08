const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let logSchema = new Schema({
    userId: { type: Number },
    userName: { type: String },
    action: { type: String, /*required: [true, 'Action is required']*/ },
    actionToRoute: { type: String },
    actionToId: { type: Number },
    date: { type: String },
    hour: { type: String },
    email: { type: String },
    status: { type: Boolean }
});


module.exports = mongoose.model('Log', logSchema);