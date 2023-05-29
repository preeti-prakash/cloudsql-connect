const express = require("express");
const app = express.Router();
// const uuid = require('uuid');
const mysqlConnection = require("../external_modules/database");
const config = require("config");

// console.log("This is mysqlConnection", mysqlConnection);

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

    let productObject = {
        pno: req.body.pno,
        pcategory: req.body.pcategory,
        pmodelname: req.body.pmodelname,
        pheight: req.body.pheight,
        pweight: req.body.pweight,
        pwidth: req.body.pwidth
    }

    let addProductQuery = "INSERT INTO products (pno,pcategory,pmodelname,pheight,pweight,pwidth) VALUES (?,?,?,?,?,?)";
    let data = [productObject.pno, productObject.pcategory, productObject.pmodelname, productObject.pheight, productObject.pweight, productObject.pwidth];

    mysqlConnection.query(addProductQuery, data, (err, result) => {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRowsssa);
        if (result.affectedRows) {
            res
              .send({ message: "Successfully added a product " });
          }
    });
});


app.delete("/products/:id", (req, res) => {
  deleteMessage = "Product deleted successfully";
  console.log("Delete route");
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




module.exports = app;