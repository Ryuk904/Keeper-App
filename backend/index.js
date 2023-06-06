import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://keeperApp:12345@cluster0.lnctqop.mongodb.net/?retryWrites=true&w=majority";

// Optional Mongoose connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

const keeperSchema = mongoose.Schema({
  title: String,
  description: String,
});

const Keeper = mongoose.model("Keeper", keeperSchema);

// to fetch the data of keeper object
app.get("/api/getAll", async (req, res) => {
  try {
    const keeperList = await Keeper.find({});
    res.status(200).send(keeperList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// to add a new keeper card
app.post("/api/addNew", async (req, res) => {
  try {
    const { title, description } = req.body;
    const keeperObj = new Keeper({
      title,
      description,
    });
    await keeperObj.save();
    const keeperList = await Keeper.find({});
    res.status(200).send(keeperList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// to delete the keeper object
app.post("/api/delete", async (req, res) => {
  try {
    const { id } = req.body;
    await Keeper.deleteOne({ _id: id });
    const keeperList = await Keeper.find({});
    res.status(200).send(keeperList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3001, () => {
  console.log("Backend created at port 3001");
});
