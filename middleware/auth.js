const jwt = require('jsonwebtoken')
const User = require('../model/User/user')

const config = process.env

class Vertify{
    
    static vertityToken(req,res,next){
        const token = req.session.token

        if(!token){
            return res.status(401).send("Please login")
        }

        try{
            const decoded = jwt.verify(token,config.TOKEN_KEY)
            req.user= decoded
        } catch(err){
            req.session.destroy(() =>{
                res.status(401)
            })
        }

        return next()
    }

    static redirect(req,res,next){
        const token = req.session.token;
        if(token){
            return res.status(401).send("Logged in")
            // return res.redirect('/home')
        }
        
        next()
    }
}

module.exports = Vertify