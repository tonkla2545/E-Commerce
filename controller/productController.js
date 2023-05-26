const User = require('../model/User/user')
const Product = require('../model/Product/product')

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

const { ObjectId } = require('mongodb')

class Products {

    static index(req, res, next) {
        User.find().then(user => {
            res.json(user)
        }).catch(err => {
            next(err)
        })
    }

    static insertProduct(req,res,next){
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.error('Error uploading image:', err);
                res.status(500).json({ error: 'Error uploading image' });
            } else {
                const { name, price, size ,category ,sex ,description} = req.body
                const image = req.file ? req.file.filename : null

                const token = req.session.token;

                if (token) {
                    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
                        if (err) {
                            console.log('Failed to verify token:', err);
                            return res.status(404).send('Failed to verify token');
                        }

                        const userId = new ObjectId(data.user_id);

                        Product.create({ name, price, size:size, category ,sex ,image ,description}).then((post) =>{
                            res.status(200).send(post)
                        }).catch(err => {
                            res.status(400).send('Cannot update');
                            console.log(err);
                        });
                    });
                }

            }
        })
    }

}

module.exports = Products