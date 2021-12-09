const Product = require('../models/products.model')

async function getAllProduct(req, res){
    try{
        const products = await Product.findAll();
        res.render('customer/products/all-products', {products: products});
    }
    catch(err){
        next(err);
    }
}

async function getProductDetails(req, res, next){
    try{
        const product = await Product.findById(req.params.id);
        res.render('customer/products/products-details', {product: product});
    }
    catch(err){
        next(err);
    }
}

module.exports ={
    getAllProduct: getAllProduct,
    getProductDetails: getProductDetails
}