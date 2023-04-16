const User = require("../models/User");
const util = require('util');
const Display = require("../models/Display");
const execFile = util.promisify(require('child_process').execFile);


module.exports.haveDiabetes=(req,res)=>{
    const {increased_apetite , Night_urination ,dried_mouth , Much_drinks , 
    slow_wounds_healing , glasses , Hand_Feet_numbness , dizzness} = req.body;
    if (increased_apetite =="True" &&  
        Night_urination =="True" && 
        dried_mouth=="True" && 
        Much_drinks=="True" && 
        slow_wounds_healing =="True" && 
        glasses=="True" && 
        Hand_Feet_numbness=="True" && 
        dizzness=="True" )
    {
        res.status(200).json({msg:'True'});
    }
    else {res.status(200).json({msg:'False'});}
}
module.exports.isObese=(req,res)=>{
    let { height , mass } = req.body ; 
    height=parseInt(height)/100; // to change it to meter
    const BMI = parseInt(mass) / Math.pow(height, 2) ; 
    if (BMI>=30 && BMI<=39.9){
        res.status(200).json({msg:'True'});
    }
    else{
        res.status(200).json({msg:'False'});
    }
}
function between(x, min, max) {
    return x >= min && x <= max;
}
function age_calculation(birthdate)
{
    let user_birthdate = birthdate.split("-");
    console.log(user_birthdate);
    let current_year=new Date().getFullYear()  
    let current_month= new Date().getMonth() +1;
    let age = current_year-parseInt(user_birthdate[0]);
    if (Math.abs(current_month-parseInt(user_birthdate[1])) >=6)
    {
      age++;
    } 
    return age;
}
function percentage_of_risk_hypertension(questions,Hypertension)
{
    let high_risk_hypertension=0;
    delete questions["FamilyHistory_diabetes"];
    delete questions["Diabetes"];
    for (const [key, value] of Object.entries(questions)) {
        if (value === "True")
        {
            high_risk_hypertension+=10; 
        }
    }
    if (Hypertension)
    {
        high_risk_hypertension+=10;
    }
    return high_risk_hypertension;
}
module.exports.User_condition_according_to_HRV = async (req, res) => {
    const { email } = req.body;
    //const email = res.locals.user.email;    
  
    try {
      
      const user = await User.findOne({ email: email }).populate("Results");
      const hrv_result = user.Results.HRVrecord; // story = user      author=patient history
      console.log(typeof(hrv_result[0]));
      if (hrv_result.length>20)
      {
          res.status(400).json({msg:"Sorry but you have exceeded the max length of HRV readings , in order to proceed please delete some of your old records"});
      }
      else 
      {
          
          let age = age_calculation(user.birthDate);          
          console.log("my hrv",user);
          console.log("user's age",age);
          if (hrv_result) 
          {
            switch (true)
            {
                case(user.gender=="Male"):
                    switch (true) {
                        case (age >= 25 && age < 35):
                            if (between(user.Results.HRVrecord,810,1068)&& 
                                between(user.Results.RMSSD,19.8,59.6)&&
                                between(user.Results.SDNN,29.1,70.9) &&
                                between(user.Results.PNN50*100,3,37)&&
                                between(user.Results.SD1SD2,0.32,0.56) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 330 male in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 35 && age < 45):
                            if (between(user.Results.HRVrecord,787,1063)&& 
                                between(user.Results.RMSSD,15.5,48.5)&&
                                between(user.Results.SDNN,27.8,61.4) &&
                                between(user.Results.PNN50*100,-2,28)&&
                                between(user.Results.SD1SD2,0.26,0.52) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 292 male in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 45 && age < 55):
                            if (between(user.Results.HRVrecord,789,1057)&& 
                                between(user.Results.RMSSD,12.1,33.9)&&
                                between(user.Results.SDNN,22.2,51.4) &&
                                between(user.Results.PNN50*100,-2,14)&&
                                between(user.Results.SD1SD2,0.21,0.47) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 235 male in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 55 && age < 65):
                            if (between(user.Results.HRVrecord,781,1027)&& 
                                between(user.Results.RMSSD,8.8,31)&&
                                between(user.Results.SDNN,18.1,47.5) &&
                                between(user.Results.PNN50*100,-3,11)&&
                                between(user.Results.SD1SD2,0.21,0.43) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 183 male in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 65 && age < 75):
                            if (between(user.Results.HRVrecord,783,1029)&& 
                                between(user.Results.RMSSD,8.4,29.8)&&
                                between(user.Results.SDNN,16.4,42.8) &&
                                between(user.Results.PNN50*100,-3,11)&&
                                between(user.Results.SD1SD2,0.17,0.55) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 84 male in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;     
                    }
                break;
                case(user.gender=="Female"):
                    switch (true) {
                        case (age >= 25 && age < 35):
                            if (between(user.Results.HRVrecord,784,1016)&& 
                                between(user.Results.RMSSD,20.1,65.7)&&
                                between(user.Results.SDNN,29.7,67.7) &&
                                between(user.Results.PNN50*100,3,43)&&
                                between(user.Results.SD1SD2,0.33,0.65) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 208 female in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 35 && age < 45):
                            if (between(user.Results.HRVrecord,781,1025)&& 
                                between(user.Results.RMSSD,16.9,53.9)&&
                                between(user.Results.SDNN,24.9,65.9) &&
                                between(user.Results.PNN50*100,-1,33)&&
                                between(user.Results.SD1SD2,0.28,0.58) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 259 female in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 45 && age < 55):
                            if (between(user.Results.HRVrecord,794,1012)&& 
                                between(user.Results.RMSSD,12.7,39.9)&&
                                between(user.Results.SDNN,23.1,50.7) &&
                                between(user.Results.PNN50*100,-4,20)&&
                                between(user.Results.SD1SD2,0.26,0.52) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 158 female in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 55 && age < 65):
                            if (between(user.Results.HRVrecord,750,986)&& 
                                between(user.Results.RMSSD,9.5,33.3)&&
                                between(user.Results.SDNN,18.2,43) &&
                                between(user.Results.PNN50*100,-3,13)&&
                                between(user.Results.SD1SD2,0.22,0.54) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 95 female in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                        case (age >= 65 && age < 75):
                            if (between(user.Results.HRVrecord,763,983)&& 
                                between(user.Results.RMSSD,7.3,30.9)&&
                                between(user.Results.SDNN,16,39.6) &&
                                between(user.Results.PNN50*100,-2,10)&&
                                between(user.Results.SD1SD2,0.21,0.51) )
                            {
                                res.status(200).json({msg:'Congratulation your HRV parameters is within your age category healthy range according to a study made on over 62 female in your age'});
                            }
                            else
                            {
                                res.status(200).json({msg:'Unfortunately your HRV parameters is not within your age category healthy range please proceed to answer our questions for diagnosis'});
                            }
                            break;
                    }
                break;
            }

            res.status(200).json({msg: "hrv result data to that user is found",hrv_result: hrv_result});
          } 
          else 
          {
            res.status(404).json({ msg: "hrv result to that user is not found" });
          }

      }
    } catch (error) {
      res.status(400).json({ msg: error });
    }
};
module.exports.User_diagnosis_according_to_HRV = async(req,res)=>{
    console.log("INSIDE THE DIAGNOSIS CONTROLLER **********");
    let Coronary_heart_disease=false;
    let Hypertension=false;
    let Sudden_Cardiac_death=false;
    let high_risk_diabetes=false;
    let hypertension_percentage;
    // the following ranges is based on published papers 


    const email = res.locals.user.email;
    console.log("the recieved email is " , email);
    //const email = res.locals.user.email; 
    try {
      
        const user = await User.findOne({ email: email }).populate("Results").populate("Medical_History");
        const hrv_result = user.Results.HRVrecord; // story = user      author=patient history
        console.log("MY HRV RESULTS AFTER POPILEATE IS ", hrv_result);
        if (hrv_result.length>20)
        {
            res.status(400).json({msg:"Sorry but you have exceeded the max length of HRV readings , in order to proceed please delete some of your old records"});
        }
        else 
        {
            let age = age_calculation(user.birthDate); 
            console.log("my hrv",user);
            console.log("user's age",age);
            if (hrv_result) 
            { 
                if (between(user.Results.HRVrecord,559,853)&& 
                    between(user.Results.RMSSD,51.4,57.8)&&
                    between(user.Results.SDNN,59.9,68.5) &&
                    between(user.Results.PNN50*100,-3.22,17.78)&&
                    between(user.Results.SD1SD2,0.14,0.58) )
                {
                    Sudden_Cardiac_death=true;
                    // paper link : https://storage.googleapis.com/plos-corpus-prod/10.1371/journal.pone.0081896/1/pone.0081896.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=wombat-sa%40plos-prod.iam.gserviceaccount.com%2F20210610%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210610T205312Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=a8a39b78f0e70b2a41cffd4aeb9559ae4dd6cdb9636425b06fd9279429edea626ec10d94fe9d0b07e0f2bae6439e3b8b5157a5f38c0a439d38e6ea6bcd550eacd442a1dc0a496206d28f6d12ff24e5df259d487b9942c66442f077eb8ff4aa3da51d5ddc9e787833fa7c034a0d5077c7f82bc810b3ff02e7d1dca153c1b076f6ba47d8b62f01b9346cc7223535e5dd1a2fb7f973f1fd83ab79d453aafa0c6fb1a3261babdd41bea5d5584033999f1ea574ab52f8e0911feb596494c34977a4ef7ee82b05ce1065b1af892582b48dd77de8f449742480059c113ebc5d5b8767c4e7ef3ee7c2d6100f786523b5ea2621790ee723329a9e0763ff6fef8f2d480778
                }
                
                

                if (age>=45 && age<=65)
                {
                    if (between(user.Results.RMSSD,10,34)&&
                        between(user.Results.SDNN,17,51) &&
                        between(user.Results.PNN50*100,-4,20)&&
                        between(user.Results.bpm,58,78) )
                    {
                        Coronary_heart_disease=true;
                        // paper name : Low Heart Rate Variability in a 2-Minute Rhythm Strip Predicts Risk of Coronary Heart Disease and Mortality From Several Causes The ARIC Study
                    }
                }

                if (between(user.Results.HRVrecord,931.5,982.5)&& 
                    between(user.Results.RMSSD,22.1,25.4)&&
                    between(user.Results.SDNN,28.7,31) )
                {
                    Hypertension=true;
                    // paper link : https://www.ahajournals.org/doi/full/10.1161/01.HYP.0000100444.71069.73
                }

                
                if(user.Medical_History.FamilyHistory_diabetes=="True" || 
                   user.Medical_History.Diabetes=="True" || 
                   user.Medical_History.Obesity=="True" )
                {
                    high_risk_diabetes=true;
                }
                hypertension_percentage=percentage_of_risk_hypertension(user.Medical_History,Hypertension);

                res.status(200).json({msg:"Your diagnosis is" , hypertension_percentage , high_risk_diabetes , Coronary_heart_disease ,Sudden_Cardiac_death });  
            } 
            else 
            {
              res.status(404).json({ msg: "hrv result to that user is not found" });
            }
        }
      } catch (error) {
        res.status(400).json({ msg: error });
      }
};
module.exports.Calculate_HRV= async(req,res)=>{
    
        let user_ecg = req.body;
        console.log("INSIDE THE CONTROLLER " , user_ecg);
        let {stdout} = await execFile('python', ['Controllers/HRV_calculation.py',[user_ecg]]);
        stdout=stdout.split('\r\n');
        console.log("*******************************============" , stdout);
        console.log("****************" , stdout.pop()); // output of the python file 
        // res.status(200).json({msg:"output of the python",stdout});

        // fill the display scheme parameters
        let HRVrecord= stdout.findIndex((str) => str.includes("Mean RR (ms)"));
        HRVrecord = [parseFloat(stdout[HRVrecord].split(":")[1].trim())];
        console.log("----------------->" , HRVrecord);
        let email = res.locals.user.email; 

        let RMSSD = stdout.findIndex((str) => str.includes("RMSSD (ms):"));
        RMSSD =[parseFloat(stdout[RMSSD].split(":")[1].trim())];

        let SDNN = stdout.findIndex((str) => str.includes("SDNN :"));
        SDNN =[parseFloat(stdout[SDNN].split(":")[1].trim())];
        
        let PNN50 = stdout.findIndex((str) => str.includes("pNN50:"));
        PNN50 =[parseFloat(stdout[PNN50].split(":")[1].trim())];
        
        let SD1SD2 = stdout.findIndex((str) => str.includes("sd1sd2 (ms):"));
        SD1SD2 =[parseFloat(stdout[SD1SD2].split(":")[1].trim())];


        
        let bpm = stdout.findIndex((str) => str.includes("Mean HR (beats/min):"));
        bpm =[parseFloat(stdout[bpm].split(":")[1].trim())];

        console.log("MY USER ID IS ", HRVrecord , RMSSD , SDNN , PNN50 , SD1SD2 , bpm);
        try {
            const user_readings= await Display.create({
            HRVrecord,
            email,
            RMSSD,
            SDNN,
            PNN50,
            SD1SD2,
            bpm
            });
        
            console.log("user readings document has been created", user_readings);
            const userID = res.locals.user._id;
            User.findOneAndUpdate(
              { _id: userID },
              { Results: user_readings._id }
            )
              .then((doc) => {
                console.log("my doc is ", doc);
                res.status(201).json({ msg: "User HRV Information saved", userID });
              })
              .catch((err) => {
                res.status(400).json({ msg: err });
              });
          } catch (error) {
            res.status(400).json({ msg: error });
          }
}
