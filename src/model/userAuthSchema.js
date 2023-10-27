import mongoose, { Schema , model } from "mongoose";

const userAuthSchema = new Schema({
     
    name : {type : String , require : true},
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    // role : {
    //     type : String,
    //     enum : ["user" , "admin"],
    //     default : "user"
    // },
    timeStamp : {
        type : String,
        require : true
    }

})

const userAuthModel = mongoose.model("userauthdata" , userAuthSchema)
export default userAuthModel
