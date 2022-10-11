const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/error_response");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const cartCtrl = {
  //CREATE
  createCart: async (req, res) => {
    try {
      const newCart = new Cart(req.body);
      const user = await User.findById(newCart.userId);
      if (!user) {
        return res.status(401).json("Login false");
      }
      if (newCart) {
        var check = true;
        newCart.products.forEach(async function (value) {
          if (value.productId) {
            var product = await Product.findById(value.productId);
            if (
              Number(value.quantity) > Number(product.numberofproducts) ||
              product.numberofproducts < 1
            ) {
              check = false;
              res.status(404).json(check);
            }
          } else {
            res.status(404).json("false");
          }
        });
      }
      // if (check) {
      //   newCart.products.forEach(async function (value) {
      //     if (value.productId) {
      //       var product = await Product.findById(value.productId);
      //       product.numberofproducts =
      //         product.numberofproducts - value.quantity;
      //       await product.save();
      //       res.status(200).json("ok");
      //     }
      //   });
      //   await newCart.save();
      //   res.status(200).json(check);
      // } else {
      //   res.status(404).json("false");
      // }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE
  updateCart: async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE
  deleteCart: async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //GET USER CART
  getUserCart: async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // //GET ALL
  getAllCart: async (req, res) => {
    try {
      const carts = await Cart.find();
      res.status(200).json(carts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = cartCtrl;
