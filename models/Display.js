const { timeStamp } = require('console');
const mongoose = require('mongoose');
const { stringify } = require('querystring');
// the database to take from when displaying the results to the user
const displaySchema = new mongoose.Schema({
    HRVrecord:{
        type:[Number],
        required:true,
    },
    email:
    {
        type: String,
        required:true, 
        unique:true
    },
    RMSSD:{
        type:[Number],
        required:true,
    },
    SDNN:{
        type:[Number],
        required:true,
    },
    PNN50:{
        type:[Number],
        required:true,
    },
    SD1SD2:{
        type:[Number],
        required:true,
    },
    bpm:{
        type:[Number],
        required:true,
    }
},{timestamps:true});


const Display = mongoose.model('display',displaySchema);
module.exports=Display;