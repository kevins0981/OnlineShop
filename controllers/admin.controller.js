const Product = require("../models/products.model");
const Order = require('../models/order.model');
async function getProducts(req, res, next) {
    try{
        const products = await Product.findAll();
        res.render('admin/products/all-products', {products: products});
    }
    catch(e){
        next(e);
        return;
    }
}

function getNewProducts(req, res) {
    res.render('admin/products/new-products');
}

async function createNewProduct(req, res) {
    const product = new Product ({
        ...req.body,
        image: req.file.filename
    });

    try{
        await product.save();
    }
    catch(e){
        next(e);
        return;
    }
    

    res.redirect('/admin/products')
}

async function toUpdateProduct(req, res, next){
    try{
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-products', {product: product});
    }
    catch(e){
        next(e)
    }
}

async function updateProduct(req, res){
    const product = new Product({
        ...req.body,
        _id: req.params.id
    });

    if(req.file){
        product.replaceImage(req.file.filename);
    }

    try{
        await product.save();
    }
    catch(e){
        next(e);
        return;
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
    let product;
    try {
      product = await Product.findById(req.params.id);
      await product.remove();
    } catch (error) {
      return next(error);
    }
  
    res.json({ message: 'Deleted product!' });
}

async function getOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      res.render('admin/orders/admin-orders', {
        orders: orders
      });
    } catch (error) {
      next(error);
    }
  }
  
  async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;
  
    try {
      const order = await Order.findById(orderId);
  
      order.status = newStatus;
  
      await order.save();
  
      res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    getProducts: getProducts,
    getNewProducts: getNewProducts,
    createNewProduct: createNewProduct,
    toUpdateProduct: toUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
  updateOrder: updateOrder
}