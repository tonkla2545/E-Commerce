const User = require('../model/User/user')
const Address = require('../model/User/address')
const Product = require('../model/Product/product')
const Cart = require('../model/Product/cart');
const CredirCard = require('../model/User/creditCard')
const Order = require('../model/Product/order');
const Favorlite = require('../model/Product/favorlite')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/image/product');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg'); // Change file name to include timestamp
    },
});

const upload = multer({
    storage: storage,
});

const { ObjectId } = require('mongodb');



class Products {


    // static index(req, res, next) {
    //     User.find().then(user => {
    //         res.json(user)
    //     }).catch(err => {
    //         next(err)
    //     })
    // }

    static insertProduct(req, res, next) {
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else {
                const { name, brand, priceUnit, size, sex } = req.body
                const image = req.file ? req.file.filename : null

                Product.create({ name, brand, priceUnit, size, sex, image, date: Date.now() }).then((post) => {
                    res.status(200).send(post)
                }).catch(err => {
                    res.status(400).send('Cannot update');
                    console.log(err);
                });

            }
        })
    }

    static addInCart(req, res, next) {
        const { Quantity, size } = req.body
        const P_Id = new ObjectId(req.params.id)

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Cart.findOne({ U_Id: userId, P_Id: P_Id }).then((match) => {
                    if (match) {
                        Product.findById(P_Id).then((product) => {
                            const QuantityNew = match.Quantity + Quantity
                            const priceTotelNew = product.priceUnit * QuantityNew
                            Cart.findOneAndUpdate({ P_Id: P_Id }, { size: size, Quantity: QuantityNew, priceTotel: priceTotelNew }).then((cart) => {
                                res.status(200).send(cart)
                            }).catch((err) => {
                                console.log(err);
                                next(err);
                            });
                        }).catch((err) => {
                            console.log(err);
                            next(err);
                        });
                    } else {
                        Product.findById(P_Id).then((product) => {
                            if (!product) {
                                res.status(400).send('Product not found')
                            } else {
                                const priceTotel = product.priceUnit * Quantity;

                                Cart.create({ U_Id: userId, P_Id: P_Id, size: size, Quantity: Quantity, priceTotel: priceTotel }).then((post) => {
                                    return res.status(200).send(post);
                                }).catch(err => {
                                    console.log(err)
                                    next(err)
                                })
                            }
                        }).catch((err) => {
                            console.log(err);
                            next(err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    next(err);
                });
            })
        }
    }

    static deleteCart(req, res, next) {
        // const C_Id = req.body
        const C_Id = new ObjectId(req.params.id)

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);


                Cart.findByIdAndDelete(C_Id).then((cart) => {
                    if (!cart) {
                        res.status(400).send('Product not found')
                    } else {
                        res.status(222).send('Delete successfully')
                    }
                }).catch((err) => {
                    console.log(err);
                    next(err);
                });
            })
        }
    }


    static checkOut(req, res, next) {
        const { A_Id, CD_Id, } = req.body
        const C_Id = new ObjectId(req.params.id)

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Cart.findById(C_Id).then((cartData) => {
                    if (!cartData) {
                        // Cart data not found
                        return res.status(400).send('Cart not found');
                    }
                    Order.create({ U_Id: userId, P_Id: cartData.P_Id, A_Id: A_Id, CD_Id: CD_Id, size: cartData.size, Quantity: cartData.Quantity, priceTotel: cartData.priceTotel, date: Date.now() }).then((order) => {
                        Cart.findByIdAndDelete(C_Id).then((post) => {
                            res.status(200).send('สั่งซื้อเสร็จสิ้น')
                        }).catch((err) => {
                            console.log(err);
                            next(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        next(err);
                    });
                }).catch((err) => {
                    console.log(err);
                    next(err);
                });
            })
        }
    }

    static cancelOrder(req, res, next) {
        const { O_Id } = req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Order.findByIdAndUpdate(O_Id, { status: 'ยกเลิก' }).then((order) => {
                    res.status(200).send(order)
                }).catch((err) => {
                    console.log(err);
                    next(err);
                });
            })
        }
    }

    static addFavorlite(req,res,next){
        const { P_Id } =req.body

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Favorlite.create({ U_Id: userId, P_Id: P_Id}).then((favorlite =>{
                    res.status(200).send(favorlite)
                }))
            })
        }
    }

    static deleteFavorlite(req,res,next){
        const { F_ID } = req.body
        // const { F_Id } = new ObjectId(req.params.id)

        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Favorlite.findByIdAndDelete(F_Id).then((deleteF =>{
                    res.status(200).send(deleteF)
                }))
            })
        }
    }

}

module.exports = Products