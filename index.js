const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kydip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("istiakTravel");

    const usersCollection = database.collection("users");
    const tourCollection = database.collection("tours");

    //users added
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.json(result);
    });

    app.get("/tours", async (req, res) => {
      const cursor = tourCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    app.post("/tours", async (req, res) => {
      const tour = req.body;
      // console.log("hit the post api", drone);
      const result = await tourCollection.insertOne(tour);
      console.log(result);
      console.log(tour);
      res.json(result);
    });

    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tourCollection.deleteOne(query);
      res.json(result);
    });

    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.find(filter).toArray();
      if (result) {
        const documents = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
        console.log(documents);
      }
      // else {
      //   const role = "admin";
      //   const result3 = await usersCollection.insertOne(req.body.email, {
      //     role: role,
      //   });
      // }

      // console.log(result);
    });
  } finally {
    //await client.close()
  }
}

app.get("/checkAdmin/:email", async (req, res) => {
  const result = await usersCollection
    .find({ email: req.params.email })
    .toArray();
  // console.log(result);
  res.send(result);
});

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Istiak Travels and Blogs!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
