const mongoose=require('mongoose');

accountSchema=mongoose.Schema({
   username:{type:String,required:true},
   dailycount:{type:Number,default:1},
   dailyamount:{type:Number,default:0},
   monthlycount:{type:Number,default:1},
   monthlyamount:{type:Number,default:0},
},{versionKey:false})

module.exports=mongoose.model('Account',accountSchema);