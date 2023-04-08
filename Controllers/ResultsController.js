const User = require("../models/User");
const Patient_History = require("../models/Patient_History");
const Display = require("../models/Display");
const mongoose = require("mongoose");


module.exports.SaveAdditionalInfo = async (req, res) => {
  const {
    FamilyHistory_hypertension,
    FamilyHistory_diabetes,
    Stress,
    Diabetes,
    Smoking,
    Obesity,
    ExcessSaltIntake,
    KidneyDisease,
    ResipiratoryProblems,
    medications,
    Pregnancy,
    user_id
  } = req.body;

  const userID = res.locals.user._id;
  console.log("MY USER IS NOW ", user_id , "AND MY USER ID IS ",userID);
  try {
    const user_history = await Patient_History.create({
      FamilyHistory_hypertension,
      FamilyHistory_diabetes,
      Stress,
      Diabetes,
      Smoking,
      Obesity,
      ExcessSaltIntake,
      KidneyDisease,
      ResipiratoryProblems,
      medications,
      Pregnancy,
    });

    console.log("history document has been created", user_history);
    User.findOneAndUpdate(
      { _id: userID },
      { Medical_History: user_history._id }
    )
      .then((doc) => {
        res.status(201).json({ msg: "User Information saved", user_id });
      })
      .catch((err) => {
        res.status(400).json({ msg: err });
      });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

module.exports.GetReport = async (req, res) => {
  // const { email } = req.body;
  // let userEmail=email;
  const userEmail = res.locals.user.email;
  console.log("MY USER IS NOW ", userEmail);
  try { 
      const user = await User.findOne({ email: userEmail }).populate("Results").populate("Medical_History");
      delete user['_doc'].password; 
      delete user['_doc'].__v;
      delete user['_doc'].createdAt;
      let fields = Object.keys(user['_doc']);
      //console.log("----------------",user['_doc']);
      let user_report_info = {};
      for(let i = 1; i < fields.length; i++) {
          if (fields[i]=="Medical_History") {
              let User_medicalHistory_keys=Object.keys(user['_doc']['Medical_History']['_doc']);
              let User_medicalHistory_values=Object.values(user['_doc']['Medical_History']['_doc']);
              for(let j = 1; j < User_medicalHistory_keys.length; j++)
              {     
                if(User_medicalHistory_keys[j]!="__v")
                {
                  if (User_medicalHistory_keys[j]=="updatedAt")
                  {
                    user_report_info["Medical history was last updated at"] =User_medicalHistory_values[j];
                  }
                  else{
                    
                    user_report_info[User_medicalHistory_keys[j]] =User_medicalHistory_values[j];
                  }
                }
              }
              continue;
          }
          else if  (fields[i]=="Results") {
            let User_Results_keys=Object.keys(user['_doc']['Results']['_doc']);
            let User_Results_values=Object.values(user['_doc']['Results']['_doc']);
            for(let j = 1; j < User_Results_keys.length; j++)
            {     
                if(User_Results_keys[j]!="__v")
                {
                  if (User_Results_keys[j]=="updatedAt")
                  {
                    user_report_info["Results was last updated at"] =User_Results_values[j];
                  }
                  else{
                    user_report_info[User_Results_keys[j]] =User_Results_values[j];
                  }
                }
            }
            continue;
          }
          user_report_info[fields[i]]=user[fields[i]];
    }
      console.log("MY DATA TO BE SENT ARE ",user_report_info);
      res.status(200).json({user_report_info});
    
  } catch (error) {
    res.status(400).json({ msg: error });
  }
  
};

module.exports.Delete_Results = async (req, res) => {
  const { email , target } = req.body;
  let userEmail=email;
  //const userEmail = res.locals.user.email;
  console.log("MY USER IS NOW ", userEmail);
  try { 
      const user = await User.findOne({ email: userEmail }).populate("Results");
      if (Object.values(user.Results.HRVrecord).indexOf(target) > -1) {
        let delete_target_index= Object.keys(user.Results.HRVrecord).find(key => user.Results.HRVrecord[key] == target);
        console.log("my target index",delete_target_index);
        console.log(user.Results._id);
        let doc_id=user.Results._id;
        let updated_Hrv_Records=user.Results.HRVrecord.splice(delete_target_index, 1);
        let updated_RMSSD_Records=user.Results.RMSSD.splice(delete_target_index, 1);
        let updated_SDNN_Records=user.Results.SDNN.splice(delete_target_index, 1);
        let updated_PNN50_Records=user.Results.PNN50.splice(delete_target_index, 1);
        let updated_SD1SD2_Records=user.Results.SD1SD2.splice(delete_target_index, 1);
        let updated_bpm_Records=user.Results.bpm.splice(delete_target_index, 1);

        console.log("my updated record", updated_Records);
        await user.Results.save({ _id : doc_id, 
          HRVrecord : updated_Hrv_Records , 
          RMSSD:updated_RMSSD_Records , 
          SDNN:updated_SDNN_Records, 
          PNN50:updated_PNN50_Records, 
          SD1SD2:updated_SD1SD2_Records, 
          bpm:updated_bpm_Records});
        res.status(200).json({msg:"Deletion of that record has been accomplished successfully"});
     }
     else {
      res.status(404).json({msg:"HRV record of that value can't be found , Deletion is unsuccessfull"});
     }
    
  } catch (error) {
    res.status(400).json({ msg: error });
  }
  
};


module.exports.test = async (req, res) => {
  const { email} = req.body;
  let userEmail=email;
  //const userEmail = res.locals.user.email;
  console.log("MY USER IS NOW ", userEmail);
  
  try { 
      const user = await User.findOne({ email: userEmail }).populate("Results");
      
      user.Results.HRVrecord.push(950,707);
      user.Results.PNN50.push(5,60);
      user.Results.RMSSD.push(30.3,77);
      user.Results.SD1SD2.push(0.437,0.9);
      user.Results.SDNN.push(41.64,96);
      user.Results.bpm.push(70,106);
           
      await user.Results.save(); 
      console.log("MY USER IS NOW ", user['_doc']['Results']['_doc']['HRVrecord']);
      res.status(200).json({msg:"Deletion of that record has been accomplished successfully"});
     }
     
  
   catch (error) {
    res.status(400).json({ msg: error });
  }
  
};