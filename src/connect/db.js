import mongoose from "mongoose"
 
 const connectToDatabase = () =>{
     try{
        mongoose.connect(process.env.DB_URL , {useNewUrlParcer : true})
        console.log("sucessfully connected to database")
     }catch(err){
       console.log("connection error" , err)    
     }

     return mongoose.connect(process.env.DB_URL)

 }

 export default connectToDatabase