const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
    },
    email_primary:{
        type: String,
    },
    email_secondary:{
        type: String,
    },
    fax:{
        type: Number,
    },
    role:{
        type:String,
        enum:['self']
    },
    avatar:{
        type: String,
    },
    password:{
        type: String,
        required:true,
    },
    confirm_password: {
        type: String,
        required:true
    },
    active_status:{
        type: Boolean,
        default:false
    },
    contacts:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'contacts'
        }
    ],
    notes:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'notes'
        }
    ],
    tasks: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'tasks'
        }
    ],

})

const user = mongoose.model("user", userSchema);
module.exports = user
