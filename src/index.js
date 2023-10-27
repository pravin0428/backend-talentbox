import express from "express"
import connectToDatabase from "./connect/db.js"
import authRoutes from "./routes/authRoutes.js"
import cors from "cors"
import passport from "passport"
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express()
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors());
app.get("/allusers" , authRoutes.GetAllUser)
app.post("/signup",authRoutes.Signup)
app.post("/login",authRoutes.Login) 
 
app.get("/" , (req , res) =>{
    res.send("server on....")
})

//authentication with google
 
passport.use(new GoogleStrategy({
    clientID:"514724056504-hin1bmu3dl7eag5c3a19hjggnig84qgv.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {

      const email = profile._json.email 

        const User = new UserModel({
            email : email, 
            password : uuidv4()
          })
        await User.save()
          return cb(null, User);
  }
));


app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    
    res.redirect('/');
  }
);

app.listen(8080 , ()=>{
    connectToDatabase()
    console.log("listning on","http://localhost:8080")
})

 