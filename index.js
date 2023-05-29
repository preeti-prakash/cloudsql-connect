require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');
const connection = require('./external_modules/database');
const productRoutes = require('./routes/products');

// app.use(cors);
app.use(cors({
    origin: 'http://localhost:4200'
  }));
app.use(bodyParser.json());
// this is a simple GET request
app.use('/', productRoutes);
app.use('/products', productRoutes);
app.use('/add/product',productRoutes);
app.use('/products/:id',productRoutes);

// configure the PORT number.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

