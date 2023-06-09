const User = require('../model/User/user')
const Address = require('../model/User/address')
const Product = require('../model/Product/product')
const Cart = require('../model/Product/cart');
const Favorlite = require('../model/Product/favorlite')
const Order = require('../model/Product/order')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { ObjectId } = require('mongodb');
const product = require('../model/Product/product');

class Page {
    static index(req, res, next) {
        Product.find().then((product) => {
            res.status(200).send(product)
        }).catch(err => {
            console.log(err);
            res.status(500).send('Error fetching items');
        });
    }

    static home(req, res, next) {
        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                }

                const userId = new ObjectId(data.user_id);

                User.findById(userId).then((userData) => {
                    Product.find().then((product) => {
                        res.status(200).send(product,userData)
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send('Error fetching items');
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).send('Not found user');
                });
            })
        }
    }

    static item(req, res, next) {
        const item_Id = req.params.id

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                }

                const userId = new ObjectId(data.user_id);

                User.findById(userId).then((userData) => {
                    Product.findById(item_Id).then((item) => {
                        res.status(200).send(item)
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send('Error fetching items');
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).send('Not found user');
                });
            })
        }
    }

    static favorlite(req,res,next){
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Favorlite.aggregate([
                    {
                        $match: { U_Id: userId },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'U_Id',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'P_Id',
                            foreignField: '_id',
                            as: 'product',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            'user.firstname': 1,
                            'user.lastname': 1,
                            'product.name': 1,
                            'product.priceUnit': 1,
                        },
                    },
                ]).then((result) => {
                    result.forEach((item) => {
                        // console.log(item.product[0].price);
                        res.status(200).send(item);
                    });
                    // res.status(200).send(item);
                }).catch((err) => {
                    console.log(err)
                    next(err)
                })
            })
        }
    }

    static pageCart(req, res, next) {
        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Cart.aggregate([
                    {
                        $match: { U_Id: userId },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'U_Id',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'P_Id',
                            foreignField: '_id',
                            as: 'product',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            Quantity: 1,
                            priceTotel: 1,
                            'user.firstname': 1,
                            'user.lastname': 1,
                            'product.name': 1,
                            'product.priceUnit': 1,
                        },
                    },
                ]).then((result) => {
                    result.forEach((item) => {
                        // console.log(item.product[0].price);
                        res.status(200).send(item);
                    });
                    // res.status(200).send(result);
                }).catch((err) => {
                    console.log(err)
                    next(err)
                })
            })
        }
    }

    static pageOrder(req, res, next) {
        const token = req.session.token

        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                if (err) {
                    console.error('Failed to verify token:', err);
                    return res.redirect('/login');
                }

                const userId = new ObjectId(data.user_id);

                Order.aggregate([
                    {
                        $match: { U_Id: userId },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'U_Id',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        $lookup: {
                            from: 'products',
                            localField: 'P_Id',
                            foreignField: '_id',
                            as: 'product',
                        },
                    },
                    {
                        $lookup: {
                            from: 'addresses',
                            localField: 'A_Id',
                            foreignField: '_id',
                            as: 'address',
                        },
                    },
                    {
                        $lookup: {
                            from: 'creditcards',
                            localField: 'CD_Id',
                            foreignField: '_id',
                            as: 'creditcard',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            Quantity: 1,
                            priceTotel: 1,
                            'user.firstname': 1,
                            'user.lastname': 1,
                            'product.name': 1,
                            'product.priceUnit': 1,
                        },
                    },
                ]).then((result) => {
                    result.forEach((order) => {
                        // console.log(item.product[0].price);
                        res.status(200).send(order);
                    });
                    // res.status(200).send(result);
                }).catch((err) => {
                    console.log(err)
                    next(err)
                })
            })
        }
    }
}

module.exports = Page