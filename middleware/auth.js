const jwt = require('jsonwebtoken')
const User = require('../model/User/user')


class Vertify{
    
    static vertityToken(req,res,next){
        const token = req.session.token

        if(!token){
            return res.status(401).send("Please login")
        }

        try{
            const decoded = jwt.verify(token,process.env.TOKEN_KEY)
            req.user= decoded
        } catch(err){
            req.session.destroy(() =>{
                res.status(401)
            })
        }

        return next()
    }

    static admin(req,res,next){
        const token = req.session.token

        if(token){
            try{
                const decoded = jwt.verify(token,config.TOKEN_KEY)
                const role = decoded.role
                if(role !== 'admin')
                {
                    return res.status(401).send("คุณไม่มีสิทธิ์ในการแก้ไขข้อมูล")
                }
                req.user= decoded
            } catch(err){
                res.status(err)
            }
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