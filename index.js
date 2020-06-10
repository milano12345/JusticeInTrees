const app = require("./index.js");

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`\n=== Server listening on port ${PORT} ===\n`);
});

if (process.env.NODE_ENV !== "production") {
  dotenv = require("dotenv");
  dotenv.config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const bodyParser = require("body-parser");
const helmet = require("helmet");
const express = require("express");

const app = express();
const fs = require("fs");
app.use(helmet());
app.use(express.static(__dirname));
console.log(__dirname);
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/materials", (req, res) => {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("store2.ejs", {
        items: JSON.parse(data),
        stripePublicKey: stripePublicKey,
      });
    }
  });
});

app.get("/", function (req, res) {
  res.render("index.html", {});
});

app.post("/purchase", (req, res) => {
  fs.readFile("items.json", function (error, data) {
    if (error) {
      res.status(500).json({ message: "error" }).end();
    } else {
      console.log("purchased");
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach(function (item) {
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });
    }
  });
});

module.exports = app;
