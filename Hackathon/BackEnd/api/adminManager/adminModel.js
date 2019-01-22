const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    user: {type: String, unique: true},
    pass: {type: String, unique: true},
    role: {type: String, unique: true, default: "user"}
})

module.exports = mongoose.Schema("Admin",AdminSchema)