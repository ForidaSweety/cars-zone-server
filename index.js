const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5005;


// middleware
//app.use(cors());
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6hr4bdc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const allCarsCollection = client.db('carsZone').collection('carsInfo');
        const carsCollection = client.db('carsZone').collection('cars');
        const bikeCollection = client.db('carsZone').collection('bikes');
        const trucksCollection = client.db('carsZone').collection('trucks');

        // for searching
        const indexKeys = { name: 1, saller: 1 };
        const indexOptions = { name: "sallerName" };
        const result = await allCarsCollection.createIndex(indexKeys, indexOptions);
        console.log(result);

        ///get all the carsinfo
        app.get('/carsinfo', async (req, res) => {
            const cursor = allCarsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // ///sorting sorting
        // app.get('/carsinfo', async (req, res) => {
        //     const type = req.query.type === "ascending";
        //     const value = req.query.value;
        //     const sortObj ={};
        //     sortObj[value] = type ? 1 : -1 ;
        //     const carsinfo = await allCarsCollection.find({}).sort(sortObj).toArray();
        //     res.send(carsinfo);
        // })

        app.get('/carsinfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: { name: 1, price: 1, ratings: 1, saller: 1, description: 1, imag: 1 },
            };

            const result = await allCarsCollection.findOne(query, options);
            res.send(result);
        })


        //get cars
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //get specific cars details
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, price: 1, ratings: 1, description: 1, imag: 1 },
            };

            const result = await carsCollection.findOne(query, options);
            res.send(result);
        })



        //get bike
        app.get('/bikes', async (req, res) => {
            const cursor = bikeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //get specific bikes details
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, price: 1, ratings: 1, description: 1, imag: 1 },
            };

            const result = await bikeCollection.findOne(query, options);
            res.send(result);
        })


        //get truck
        app.get('/trucks', async (req, res) => {
            const cursor = trucksCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //get specific trucks details
        app.get('/trucks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, price: 1, ratings: 1, description: 1, imag: 1 },
            };

            const result = await trucksCollection.findOne(query, options);
            res.send(result);
        })

        // database e information pathanor jonno
        app.post('/carsinfo', async (req, res) => {
            const newToys = req.body;
            console.log(newToys);
            const result = await allCarsCollection.insertOne(newToys);
            res.send(result);
        });


        app.delete('/toysearch/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allCarsCollection.deleteOne(query);
            res.send(result);
        })


// search toys
app.get("/toysearch/:text", async (req, res) => {
    const text = req.params.text;
    const result = await allCarsCollection.find({
        $or: [
          { name: { $regex: text, $options: "i" } },
          { saller: { $regex: text, $options: "i" } },
        ],
      })
      .toArray();
    res.send(result);
  });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running...')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})