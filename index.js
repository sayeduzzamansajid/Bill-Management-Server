const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({origin: "*", credentials: true}));
app.use(express.json());

const uri =
  "mongodb+srv://billManager:5aqEgCjlbM8LlGSw@orioncluster.vzkshzy.mongodb.net/?appName=orionCluster";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("Bill-Management");
    const billCollection = db.collection("bills");

    app.get("/", async (req, res) => {
      try {
        const result = await billCollection
          .find()
          .sort({ date: -1 })
          .limit(6)
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    // Update a bill by ID (PUT)
    app.put("/bills/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const result = await billCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Bill not found" });
        }
        res.send({ message: "Bill updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating bill" });
      }
    });

    // Delete a bill by ID (DELETE)
    app.delete("/bills/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const result = await billCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Bill not found" });
        }
        res.send({ message: "Bill deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error deleting bill" });
      }
    });

    app.get("/bills/all-bills", async (req, res) => {
      try {
        const result = await billCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.post("/bills/all-bills", async (req, res) => {
      try {
        const newBill = req.body;
        const result = await billCollection.insertOne(newBill);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    //my bills
    app.post("/bills/my-bills", async (req, res) => {
      try {
        const { email } = req.body;

        // console.log("Searching for:", email);
        const query = { email: email };

        const result = await billCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.get("/bills/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await billCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    app.listen(port, () => console.log("Server running on port", port));
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`database connected `);
  }
}
run();
