const User = require('../model/User/user')
const Address = require('../model/User/address')
const CredirCard = require('../model/User/creditCard')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/image/user');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg'); // Change file name to include timestamp
    },
});

const upload = multer({
    storage: storage,
});


const { TOKEN_KEY } = process.env
const { ObjectId } = require('mongodb')

class Users {

    // static index(req, res, next) {
    //     User.find().then(user => {
    //         res.json(user)
    //     }).catch(err => {
    //         next(err)
    //     })
    // }

    static signUp(req, res, next) {
        const { email, password, Cpassword, firstname, lastname, birthday, sex } = req.body

        if (email && password && Cpassword && firstname && lastname && birthday) {
            if (password === Cpassword) {
                User.findOne({ email }).then((oldEmail) => {
                    if (oldEmail) {
                        // throw new Error("User already exists. Please login.")
                        return res.status(409).send("User already exists. Please login.")
                    } else {
                        return bcrypt.hash(password, 10)
                    }
                }).then((hash) => {
                    return User.create({
                        email: email,
                        password: hash,
                        firstname: firstname,
                        lastname: lastname,
                        image: null,
                        birthday: birthday,
                        sex: null,
                        role: "user"
                    })
                }).then((user) => {
                    const token = jwt.sign(
                        { user_id: user._id, email, role: user.role },
                        process.env.TOKEN_KEY,
                        { expiresIn: "5m" }
                    )
                    user.token = token
                    res.status(200).send(user)
                    // return res.redirect('/login')
                }).catch((err) => {
                    req.flash('validationError', err.message); // Store the error message in flash
                    // return res.redirect('/register');
                })
            } else {
                console.log('Passwords do not match')
                res.status(404).send('Passwords do not match')
                // req.flash('validationError','Password is incorrect')
            }
        } else {
            console.log('Please enter all information.')
            res.status(404).send('Please enter all information.')
        }
    }

    static logIn(req, res, next) {
        const { email, password } = req.body

        User.findOne({ email }).then((user) => {
            if (user) {
                bcrypt.compare(password, user.password).then((match) => {
                    if (match) {
                        const token = jwt.sign(
                            { user_id: user._id, email, role: user.role },
                            process.env.TOKEN_KEY,
                            { expiresIn: "5m" }
                        )
                        user.token = token
                        req.session.regenerate((err) => {
                            if (err) {
                                console.error('Failed to regenerate session:', err)
                                // return res.redirect('/login')
                            }
                            req.session.token = token
                            console.log("Login successfully")
                            res.status(202).send(user)
                            // res.redirect('/home')
                        })
                    } else {
                        console.log('Password is incorrect')
                        res.status(404).send('Password is incorrect')
                        // req.flash('validationError','Password is incorrect')
                        // res.redirect('/login')
                    }
                })
            } else {
                console.log('Not found Email')
                res.status(404).send('Not found Email')
                // req.flash('validationError','Not found Email')
                // res.redirect('/login')
            }
        }).catch((err) => {
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

    static changPass(req, res, next) {
        const token = req.session.token
        const { Cpassword, Npassword, CNpassword } = req.body

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    // return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id); //

                if (Npassword === CNpassword) {
                    User.findById(userId).then((user) => {
                        if (!user) {
                            // req.flash('validationError', "User not found.");
                            res.status(400).send('User not found')
                        }
                        bcrypt.compare(Cpassword, user.password).then((CMatch) => {
                            if (CMatch) {
                                bcrypt.compare(Npassword, user.password).then((NMatch) => {
                                    if (!NMatch) {
                                        bcrypt.hash(Npassword, 10, (err, hashedPassword) => {
                                            if (err) {
                                                next(err)
                                                res.status(500).send('Internal server error');
                                            }

                                            User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true }).then((updateUser) => {
                                                if (!updateUser) {
                                                    // req.flash('validationError', "User not found.");
                                                    // res.redirect('/changePass')
                                                    res.status(404).send('User not found');
                                                }
                                                // res.status(200).send('Change password successfully')
                                                res.status(200).json(updateUser);
                                                // res.redirect('/home')
                                            }).catch((err => {
                                                next(err)
                                            }))
                                        })
                                    } else {
                                        // req.flash('validationError', "รหัสผ่านนี้เป็นรหัสผ่านเดิม.");
                                        // res.redirect('/changePass')
                                        res.status(400).send('รหัสผ่านนี้เป็นรหัสผ่านเดิม')
                                    }
                                }).catch(err => {
                                    next(err)
                                })
                            } else {
                                // req.flash('validationError', "กรุณากรองรหัสผ่านให้ถูกต้อง.");
                                // res.redirect('/changePass')
                                res.status(400).send('รหัสผ่านนี้เป็นรหัสผ่านเดิม')
                            }
                        }).catch(err => {
                            next(err)
                        })

                    }).catch(err => {
                        next(err)
                    })
                } else {
                    // req.flash('validationError', "รหัสผ่านไม่ตรงกัน.");
                    // res.redirect('/changePass')
                    res.status(400).send('รหัสผ่านไม่ตรงกัน')
                }
            }
            )
        }
    }

    static editProfile(req, res, next) {
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else {
                const { firstname, lastname, birthday, sex } = req.body
                const image = req.file ? req.file.filename : null

                const token = req.session.token;

                if (token) {
                    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                        if (err) {
                            console.log('Failed to verify token:', err);
                            return res.status(404).send('Failed to verify token');
                        }

                        const userId = new ObjectId(data.user_id);

                        User.findByIdAndUpdate({ _id: userId }, { firstname, lastname, image, birthday, sex })
                            .then((post) => {
                                res.status(200).send(post);
                            })
                            .catch(err => {
                                res.status(400).send('Cannot update');
                                console.log(err);
                            });
                    });
                }

            }
        })
    }

    static insertAddress(req, res, next) {
        const { firstname, lastname, address, county, province, country, zipCode, phoneNumber } = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Address.create({ firstname: firstname, lastname: lastname, address: address, county: county, province: province, country: country, zipCode: zipCode, phoneNumber: phoneNumber, U_Id: userId }).then((post) => {
                    return res.json(post)
                }).catch(err => {
                    console.log(err)
                    next(err)
                })
            })
        }
    }

    static editAddress(req, res, next) {
        const { A_Id, address, phoneNumber } = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Address.findById(req.params.id).then((match) => {
                    // Address.findById({ _id: A_Id }).then((match) => {
                    if (match) {
                        Address.findOneAndUpdate({ U_Id: userId }, { address: address, phoneNumber: phoneNumber }).then((post) => {
                            return res.json(post)
                        }).catch(err => {
                            console.log(err)
                            next(err)
                        })
                    } else {
                        res.status(404).send('Can not edit information')
                        next()
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }

    static deleteAddress(req, res, next) {
        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Address.findByIdAndDelete(req.params.id).then(() => {
                    res.status(200).send('Delete successfully')
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }

    static insertCreditCard(req, res, next) {
        const { name, cardNumber, expDate, CVV, } = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                bcrypt.hash(CVV, 10).then(hash => {
                    CredirCard.create({ name: name, cardNumber: cardNumber, expDate: expDate, CVV: hash, U_Id: userId }).then((post) => {
                        return res.json(post)
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }

    static editCreditCard(req, res, next) {
        const { C_id, name, cardNumber, expDate, CVV, } = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                CredirCard.findById({ _id: C_id }).then((match) => {
                    if (match) {
                        bcrypt.hash(CVV, 10).then(hash => {
                            CredirCard.findOneAndUpdate({ U_Id: userId }, { name: name, cardNumber: cardNumber, expDate: expDate, CVV: hash, U_Id: userId }).then((post) => {
                                return res.json(post)
                            }).catch(err => {
                                console.log(err)
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        res.status(404).send('Can not edit information')
                        next()
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }

    static deleteCreditCard(req, res, next) {
        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                CredirCard.findByIdAndDelete(req.params.id).then(() => {
                    res.status(200).send('Delete successfully')
                }).catch(err => {
                    console.log(err)
                })
            })
        }
    }
}

module.exports = Users