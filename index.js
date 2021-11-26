const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssiqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("perfectTime");
    const productCollection = database.collection("product");
    const orderCollection = database.collection("order");
    const reviewCollection = database.collection("review");
    const userCollection = database.collection("user");

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.json(result);
    });
    // get single item
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await productCollection.findOne(query);
      res.json(order);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });

    // update Product
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const updateAction = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updateAction.title,
          price: updateAction.price,
          model: updateAction.model,
          category: updateAction.category,
          description: updateAction.description,
          image: updateAction.image,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //order

    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find({});
      const order = await cursor.toArray();
      res.send(order);
    });

    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.json(order);
    });

    app.put("/order/:id", async (req, res) => {
      const id = req.params.id;
      const updateAction = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateAction.status,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // delete order
    app.delete("/order/:orderId", async (req, res) => {
      const id = req.params.orderId;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    // review
    app.post("/review", async (req, res) => {
      const order = req.body;
      const result = await reviewCollection.insertOne(order);
      res.json(result);
    });
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // admin

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.json(result);
    });
    //add admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //find admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // admin
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Prefect Watch Server");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
