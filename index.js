const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config() // dot env for secured database intigration 


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qxen6yj.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        // const tourCollection = client.db('travelBod').collection('tours');
        // const carouselimgCollection = client.db('travelBod').collection('carouselimg');
        // const carouseldimgCollection = client.db('travelBod').collection('carouseldimg');
        // const destinationCollection = client.db('travelBod').collection('destination');
        // const bookingCollection = client.db('travelBod').collection('bookings');
        // const carouselCollection = client.db('travelBod').collection('testimonials');
        // const blogCollection = client.db('travelBod').collection('blogs');

        // API's that get data from DB ------------------------------
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/carousels', async (req, res) => {
            const cursor = carouselimgCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/carouselsd', async (req, res) => {
            const cursor = carouseldimgCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/testimonials', async (req, res) => {
            const cursor = carouselCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/destinations', async (req, res) => {
            const cursor = destinationCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        app.get('/destinations/:name', async (req, res) => {
            const name = req.params.name;
            const cursor = tourCollection.find();
            const result = await cursor.toArray();
            if (name === 'Every Destination') {
                res.send(result)
            }
            else {
                const newDestinations = result.filter(tour => tour.destination_name === name)
                res.send(newDestinations);
            }
        })

        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourCollection.findOne(query);
            res.send(result);
        })

        app.get('/', (req, res) => {
            res.send('TravelBod server is on :)');
        })

        // API's that related with Bookings -----------------------------
        // inserting single booking data to DB
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        //getting booking data from DB sorting with specific email
        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })
        //deleting booking data from DB and UI as well
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })
         //updating booking data from DB and UI AS WELL
         app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // API's that related with Adding Tours --------------------------
        app.post('/addtour', async (req, res) => {
            const addtour = req.body;
            const result = await tourCollection.insertOne(addtour);
            res.send(result);
        })


        app.listen(port, () => {
            console.log(`server is running on port:${port}`)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
