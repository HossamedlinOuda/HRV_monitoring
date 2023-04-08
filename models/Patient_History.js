const { timeStamp } = require('console');
const mongoose = require('mongoose');
const validator =require('validator');
// the database to collect the patient history 
const PatientHistorySchema = new mongoose.Schema({
    
    FamilyHistory_hypertension:{
        type:String,
        required:[true, "Please specify whether you have family history in hypertension"],
    },
    FamilyHistory_diabetes:{
        type:String,
        required:[true,"Please specify whether you have family history in diabetes"],
    },
    Stress:{
        type:String,
        required:[true,"Please specify whether you are stressed or not"]
    },
    Diabetes:{
        // if he doesnt know then we ask if he has increased apetite - increase urination at night - dried mouth or he drinks too much 
        // -his wounds dont heal fast - wearing glasses -  hand or feet numbness - dizzness 
        type:String,
        required:true
    },
    Smoking:{
        type:String,
        required:[true,"Please specify whether you are smoker or not"]
    },
    Obesity:{
        /* if he below 18.5 – you're in the underweight range
            between 18.5 and 24.9 – you're in the healthy weight range
            between 25 and 29.9 – you're in the overweight range
            between 30 and 39.9 – you're in the obese range */
        type:String,
        required:true
    },
    ExcessSaltIntake:{
        type:String,
        required:[true,"Please specify whether you eat with so much salt or not"]
    },
    KidneyDisease:{
        type:String,
        required:true
    },
    ResipiratoryProblems:{
        type:String,
        required:[true,"Please specify whether you have respiratory problems like (Pronnchial Asthma-Cronoic obstructive Plamonary disease (COPD)) or not"]
    },
    medications:{
        type:String, 
        /* medication for analgsitics , anti-inflamatory, autoimune diseases , arthritis , respirtaroy problems, antithyrode
        Contraceptive pills */
        required:true
    },
    Pregnancy:{
        type:String,
        required:[true,"Please specify whether you are pregnant or not"]
    },

},{timestamps:true});
const Patient_History = mongoose.model('Patient_History',PatientHistorySchema);
module.exports=Patient_History;