const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://billManager:5aqEgCjlbM8LlGSw@orioncluster.vzkshzy.mongodb.net/?appName=orionCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("Bill-Management");
    const billCollection = db.collection("bills");

    app.get("/", async (req, res) => {
      try {
        const result = await billCollection
          .find()
          .sort({ date: -1 })
          .limit(6)
          .toArray();
        console.log(result);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.get("/all-bills", async (req, res) => {
      try {
        const result = await billCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.get("/bills/:id", async (req, res) => {
      const id = req.params.id ;
      try {
        const result = await billCollection.findOne({_id:new ObjectId(id)});
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.listen(port, () => console.log("Server running on port", port));
  } catch (error) {
    console.error(error);
  }
}
run();
