const User = require('../model/User/user')
const UserDetail = require('../model/User/userDetail')
const CredirCard = require('../model/User/creditCard')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { TOKEN_KEY } = process.env
const { ObjectId } = require('mongodb')

class Users {

    static index(req,res,next){
        User.find().then(user =>{
            res.json(user)
        }).catch(err =>{
            next(err)
        })
    }

    static signUp(req,res,next){
        const {email ,password ,Cpassword ,firstname ,lastname ,birthday} = req.body
        
        if(email && password && Cpassword && firstname && lastname && birthday){
            if(password === Cpassword){
                User.findOne({email}).then((oldEmail) =>{
                    if(oldEmail){
                        // throw new Error("User already exists. Please login.")
                        return res.status(409).send("User already exists. Please login.")
                    } else{
                        return bcrypt.hash(password, 10)
                    }
                }).then((hash) =>{
                    return User.create({
                        email: email,
                        password: hash,
                        firstname: firstname,
                        lastname: lastname,
                        image: null,
                        birthday: birthday,
                        role: "user"
                    })
                    // .then((post) =>{
                    //     return UserDetail.create({
                    //         address: '',
                    //         phoneNumber: '',
                    //         U_Id: post._id
                    //     }).then(() => {
                    //         return post;
                    //     });
                    // })
                }).then((user) =>{
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY,
                        {expiresIn: "5m"}
                    )
                    user.token = token
                    res.status(200).send(user)
                    // return res.redirect('/login')
                }).catch((err) =>{
                    req.flash('validationError', err.message); // Store the error message in flash
                    // return res.redirect('/register');
                })
            }else{
                console.log('Passwords do not match')
                res.status(404).send('Passwords do not match')
                // req.flash('validationError','Password is incorrect')
            }
        }else{
            console.log('Please enter all information.')
            res.status(404).send('Please enter all information.')
        }
    }

    static logIn(req,res,next){
        const {email ,password} = req.body

        User.findOne({ email}).then((user) =>{
            if(user){
                bcrypt.compare(password, user.password).then((match) =>{
                    if(match){
                        const token = jwt.sign(
                            {user_id: user._id, email},
                            process.env.TOKEN_KEY,
                            {expiresIn: "5m"}
                        )
                        user.token = token
                        req.session.regenerate((err) =>{
                            if(err){
                                console.error('Failed to regenerate session:', err)
                                // return res.redirect('/login')
                            }
                            req.session.token = token
                            console.log("Login successfully")
                            res.status(202).send(user)
                            // res.redirect('/home')
                        })
                    }else {
                        console.log('Password is incorrect')
                        res.status(404).send('Password is incorrect')
                        // req.flash('validationError','Password is incorrect')
                        // res.redirect('/login')
                    }
                })
            }else{
                console.log('Not found Email')
                res.status(404).send('Not found Email')
                // req.flash('validationError','Not found Email')
                // res.redirect('/login')
            }
        }).catch((err) =>{
            console.log(err)
            res.status(404).send('Not found Email')
            // req.flash('validationError','Not found Email')
            // res.redirect('/login')
        })
    }

    static logout(req, res, next) {
        req.session.destroy(() => {
            res.send("Logout")
        })
    }
    
    static editProfile(req,res,next){
        
    }

    static insertAddress(req,res,next){
        const {address,phoneNumber} = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                UserDetail.create({address:address,phoneNumber:phoneNumber,U_Id:userId}).then((post) =>{
                    return res.json(post)
                }).catch(err =>{
                    console.log(err)
                    next(err)
                })
            })
        }
    }

    static editAddress(req,res,next){
        const {A_Id,address,phoneNumber} = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                UserDetail.findById({_id : A_Id}).then((match) =>{
                    if(match){
                        UserDetail.findOneAndUpdate({U_Id : userId},{address:address,phoneNumber:phoneNumber}).then((post) =>{
                            return res.json(post)
                        }).catch(err =>{
                            console.log(err)
                            next(err)
                        })
                    }else{
                        res.status(404).send('Can not edit information')
                        next()
                    }
                }).catch(err =>{
                    console.log(err)
                })
            })
        }
    }

    static insertCreditCard(req,res,next){
        const {firstname,lastname,cardNumber,expDate,CVV,} = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                bcrypt.hash(CVV, 10).then(hash =>{
                    CredirCard.create({firstname:firstname,lastname:lastname,cardNumber:cardNumber,expDate:expDate,CVV:hash,U_Id:userId}).then((post) =>{
                        return res.json(post)
                    }).catch(err =>{
                        console.log(err)
                    })
                }).catch(err =>{
                    console.log(err)
                })
            })
        }
    }

    static editCreditCard(req,res,next){
        const {C_id,firstname,lastname,cardNumber,expDate,CVV,} = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                CredirCard.findById({_id : C_id}).then((match) =>{
                    if(match){
                        bcrypt.hash(CVV, 10).then(hash =>{
                            CredirCard.create({firstname:firstname,lastname:lastname,cardNumber:cardNumber,expDate:expDate,CVV:hash,U_Id:userId}).then((post) =>{
                                return res.json(post)
                            }).catch(err =>{
                                console.log(err)
                            })
                        }).catch(err =>{
                            console.log(err)
                        })
                    }else{
                        res.status(404).send('Can not edit information')
                        next()
                    }
                }).catch(err =>{
                    console.log(err)
                })
            })
        }
    }
}

module.exports = Users