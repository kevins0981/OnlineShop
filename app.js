const express = require('express');
const authRoutes = require("./routes/auth.routes");
const app = express();
const path = require('path');
const db = require("./data/database");
const csurf = require("csurf");
const addCsurfToken = require('./middlewares/csurf-token');
const errorHandler = require("./middlewares/error-handler");
const cart = require("./middlewares/cart");
const createSessionConfig = require("./config/session");
const expressSession = require("express-session");
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require("./routes/base.routes");
const checkAuthStatus = require('./middlewares/check-auth');
const adminRoutes = require("./routes/admin.routes");
const protectRoutes = require("./middlewares/protect-routes");
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/orders.routes');
const updateCartPrices = require('./middlewares/update-cart-prices');
const notFound = require('./middlewares/not-found');

let PORT = 3000;

if(process.env.PORT){
    PORT = process.env.PORT;
}

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/files',express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
app.use(csurf());
app.use(cart);
app.use(updateCartPrices);
app.use(addCsurfToken);
app.use(checkAuthStatus);
app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutes, orderRoutes);
app.use('/admin', protectRoutes,adminRoutes);
app.use(notFound);
app.use(errorHandler);

db.connectToDatabase()
    .then(function(){
        app.listen(PORT,  () => {console.log(`app listening on port ${PORT}!`)});
    })
    .catch(function(e){
        console.log("Failed to connect to database");
        console.log(e);
    });
