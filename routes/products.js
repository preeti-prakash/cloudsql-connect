const express = require("express");
const app = express.Router();
// const uuid = require('uuid');
const mysqlConnection = require("../external_modules/database");
const config = require("config");
const { createCanvas } = require('canvas');
const Barcode = require('jsbarcode');
const { nanoid } = require("nanoid");


//Default get method
app.get("/", (req, res) => {
  res.send("welcome to the GoodTimezz Community");
})


//Display the list of products added
app.get("/products", (req, res) => {
  mysqlConnection.query('SELECT * FROM products', (err, rows) => {
    if (!err) {
      res.send(rows);
    } else
      res.send("Could not get the list of records", err);
  })
});


app.post("/add/product", (req, res) => {
  var productId = nanoid();
  let productObject = {
    pno: req.body.pno,
    pcategory: req.body.pcategory,
    pmodelname: req.body.pmodelname,
    pheight: req.body.pheight,
    pweight: req.body.pweight,
    pwidth: req.body.pwidth,
    productId: productId
  }
  
  console.log("product is :", productObject);
  let addProductQuery = "INSERT INTO products (pno,pcategory,pmodelname,pheight,pweight,pwidth,productId) VALUES (?,?,?,?,?,?,?)";
  let data = [productObject.pno, productObject.pcategory, productObject.pmodelname, productObject.pheight, productObject.pweight, productObject.pwidth, productObject.productId];

  mysqlConnection.query(addProductQuery, data, (err, result) => {
    if (err) throw err;
    if (result.affectedRows) {
      res
        .send({ message: "Successfully added a product ", data });
    }
  });
});


app.delete("/products/:id", (req, res) => {
  deleteMessage = "Product deleted successfully";
  mysqlConnection.query(
    `DELETE FROM products WHERE pno = ${req.params.id}`,
    (err, result) => {
      if (!err) {
        if (result.affectedRows > 0) {
          console.log("success delete", result);
          res.json({
            value: deleteMessage
          });
        } else {
          res.status(404).send("Product not found");
        }
      } else {
        res.status(500).send("Error deleting product");
      }
    }
  );
});


app.put("/products/:id", (req, res) => {
  const id = req.params.id;

  let productObject = {
    pno: req.body.pno,
    pcategory: req.body.pcategory,
    pmodelname: req.body.pmodelname,
    pheight: req.body.pheight,
    pweight: req.body.pweight,
    pwidth: req.body.pwidth,
  };

  let updateProductQuery =
    "UPDATE products SET pno = ?, pcategory = ?, pmodelname = ?, pheight = ?, pweight = ?, pwidth = ? WHERE pno = ?";

  let data = [
    productObject.pno,
    productObject.pcategory,
    productObject.pmodelname,
    productObject.pheight,
    productObject.pweight,
    productObject.pwidth,
    id
  ];

  mysqlConnection.query(updateProductQuery, data, (err, result) => {
    if (err) {
      res.status(500).send("Error updating product");
    } else {
      if (result.affectedRows > 0) {
        res.send({ message: "Product updated successfully" });
      } else {
        res.status(404).send({ message: "Product not found" });
      }
    }
  });
});


app.put('/barcode/:id', (req, res) => {
  console.log("barcode");
  const canvas = createCanvas();
  // console.log(canvas);
  Barcode(canvas, req.params.id, {
    format: "CODE128",
    fontSize: 10,
    textMargin: 10,
    width: 2
  });
  res.type('image/png');
  const stream = canvas.createPNGStream();
  stream.pipe(res);
  console.log(res);
})





module.exports = app;