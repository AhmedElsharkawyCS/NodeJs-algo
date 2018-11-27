const prompt=require('prompt');
const mongoose=require('mongoose');
const Account=require('./dbSchema');
const  Banklimits=require('./UsersLimitions')
   
//connecte to db
mongoose
.connect("mongodb://ahmed:ahmed1996@ds121163.mlab.com:21163/emaily-developer",{useNewUrlParser:true})//keys.db_UR
.then(() => {
        // console.log("W're connected to db");
}).catch((err) => {
    console.log("Authentication Failed OR Connection Error\n");
});
//check for user fun
async function  userCHecker_Or_getUser(username,type='check'){
   const find=await Account.findOne({username:username});
   if(find){
       if(type==='check')
           return true;
       else   
           return find;
   }else
       return false;     
}
//update user account
function updateUser(userObject){
    return Account.findOne({username:userObject.username}).
      then((userAccount) => {
          if(userAccount)
              {
                userAccount.dailycount=userAccount.dailycount+1;
                userAccount.dailyamount=userAccount.dailyamount+userObject.dailyamount;
                userAccount.monthlycount=userAccount.monthlycount+1;
                userAccount.monthlyamount=userAccount.monthlyamount+userObject.dailyamount;

                //save new data
                userAccount.save();
                return true;
              }else{
                return false;
              }
      }).catch((err) => {
              return false;
      });
}
//crate new user account
function createNewUser(userObject){
    var newUser={};
  if(userObject.dailyamount){      
     newUser= new Account({
        username:userObject.username,
        dailyamount:userObject.dailyamount,
        monthlyamount:userObject.dailyamount,
    });
  }else{
     newUser= new Account({
        username:userObject.username
});
    return newUser.save().then(function(newuser){
        if(newuser){
            return newuser;
        }else{
            return false;
        }
    });
}
}

//////////////////////////////////Build Bank Algorthim////////////////////////////////////
//start prompt
console.log('Please enter the users')
prompt.get(['Fusername','Susername'],function(err,result){
    userCHecker_Or_getUser(result.Fusername,type="data").then(function(user1){
      if(user1){
        userCHecker_Or_getUser(result.Fusername,type="data").then(function( user2){
            if(user2){
                const user1Conditon=user1.dailycount<=Banklimits.dailycount&&user1.dailyamount<=Banklimits.dailyamount&&user1.monthlycount<=Banklimits.monthlycount&&user1.monthlyamount<=Banklimits.monthlyamount;
                const user2Conditon=user1.dailycount<=Banklimits.dailycount&&user1.dailyamount<=Banklimits.dailyamount&&user1.monthlycount<=Banklimits.monthlycount&&user1.monthlyamount<=Banklimits.monthlyamount;
                if(user1Conditon&user2Conditon){
                    console.log('Note:the amount available for today is :'+(Banklimits.dailycount-user1.dailycount)+'\nplease enter Name and Amount ')
                    prompt.get(['SenderName','Amount'],function(err,result){
                        const userObject={
                            username:result.SenderName,
                            dailyamount:result.Amount
                        }
                         updateUser(userObject).then(function(result){
                             if(result){
                                  console.log('The operation completed successfully');
                                  prompt.stop();
                             }else{
                                  console.log('System error and TRY AGAIN...');
                                  prompt.stop();
                             }
                         });
                             
                    })
                }else{
                     console.log('Sorry Our customers!\nOne user or two users not have the necessary conditions to perform the process...')
                }  
            }else{
                console.log("Recived user not found!!!\nPlease enter the correct username of reciver.");
            }
        });
       }else{
           console.log('Sender name not found in our System!!!\n Do you want to create new user:YES or NO');
           prompt.get(['YES','NO'],function(err,result){
                  if(result.NO==='NO'||result.NO==='no'||result.NO==='No'){
                      console.log('Now system will close\nBye...');
                      prompt.stop();
                  }else{
                       console.log('now you will create acount and send money to another user');
                        prompt.get(['Sendername','Recivername','Amount'],function(err,result){
                            userCHecker_Or_getUser(result.Recivername,type="data").then(function( user2){
                                if(user2){
                                    const user2Conditon=user2.dailycount<=Banklimits.dailycount&&user2.dailyamount<=Banklimits.dailyamount&&user2.monthlycount<=Banklimits.monthlycount&&user2.monthlyamount<=Banklimits.monthlyamount;
                                    if(user2Conditon){
                                        const userObject={
                                            username:result.SenderName,
                                            dailyamount:result.Amount
                                        }
                                        createNewUser(userObject).then(function(user){
                                           if(user){
                                            console.log('The operation completed successfully');
                                            prompt.stop();
                                           }else{
                                            console.log('System error and TRY AGAIN...');
                                            prompt.stop();
                                           }
                                        });
                                    }else{
                                        console.log('Sorry Our customers!\nRecived user not has the necessary conditions to perform the process...')
                                    }
                                }else{
                                    console.log('Recived user not found!!!\n Just try to create new account...');
                                    prompt.get(['username'],function(err,result){
                                        const userObject={
                                            username:result.SenderName,
                                        }
                                        createNewUser(userObject).then(function(user){
                                            if(user){
                                                console.log('User Created.');
                                                prompt.stop();
                                            }else{
                                                console.log('System erorr!!!');
                                                prompt.stop();
                                            }
                                        })
                                    });

                                }
                            });
                        });
                      }
                  });
                }
            });
     });

