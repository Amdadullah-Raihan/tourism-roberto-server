const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
const app = express();
const cors = require('cors')

//midleware 
app.use(cors())
app.use(express.json())

//root api
app.get('/', (req,res)=>{
    res.send('Responsing from tourism roberto server')
})
//listen 

app.listen(port, (req,res)=>{
    console.log("litsening to tourism roberto server port", port);
})


//mongodb connections

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xplq2xb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        console.log('database connected');
        const database = client.db("tourismRobertoDB");
        const roomsCollections = database.collection('rooms')
        const blogsCollections = database.collection('blogs')
        const bookingsCollections = database.collection('bookings')
        

        //post api for create blog
        app.post('/create-blog', async(req,res)=>{

            const result = await blogsCollections.insertOne(req.body)
            res.json(result)
        })
        //post api for create blog
        app.post('/create-room', async(req,res)=>{
            // console.log(req.body);
            const result = await roomsCollections.insertOne(req.body)
            res.json(result)
        })

        //get api for getting rooms from mongodb
        app.get('/rooms', async(req,res)=>{
            const result = await roomsCollections.find({}).toArray()
            res.json(result)
        })
        //get api for blogs
        app.get('/blogs', async(req,res)=>{
            const result = await blogsCollections.find({}).toArray()
            res.json(result)
        })
        //post api for single room by id
        app.get('/rooms/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: new ObjectId(id) }
            const room = await roomsCollections.findOne(query)
            // console.log(event);
            res.json(room)
        })

        //deleting a room by id
        app.delete("/delete-room/:id", async(req, res)=>{
            const id = (req.params.id);
            // console.log(req.params);
            const query = { _id: new ObjectId(id) }
            const room = await roomsCollections.deleteOne(query)
            // console.log(event);
            res.json(room)
        })

        // getting single blog by id
        app.get('/blogs/:id', async (req, res) => {
            const id = (req.params.id);
            const query = { _id: new ObjectId(id) }
            const blog = await blogsCollections.findOne(query)
            // console.log(event);
            res.json(blog)
        })

        // creating bookins
        app.post('/bookings', async(req, res)=>{
            
            const result = await bookingsCollections.insertOne(req.body)
            res.json(result)
            
        })

        // getting bookings by email
        app.get("/my-bookings", async(req, res)=>{
            const email = (req.query.email);
            const query = {userEmail: email}
            const myBookings = await bookingsCollections.find(query).toArray()
            res.json(myBookings)

        })
        //deleting booking by id
        app.delete('/delete-booking', async(req, res)=>{
            const id = (req.body.id);
            // console.log(req.params);
            const query = { _id: new ObjectId(id) }
            const result= await bookingsCollections.deleteOne(query)
            // console.log(event);
            res.json(result)
        })
        //getting bookings 
        app.get('/bookings', async(req, res)=>{
            const bookings = await bookingsCollections.find({}).toArray();
            res.json(bookings)
        })

        app.put('/manage-bookings/:id', async(req, res)=>{
            console.log(req.params, req.body);
            const filter = {_id: new ObjectId(req.params.id)};
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    approved: req.body.approved
                }
            };
            const result = await bookingsCollections.updateOne(filter, updateDoc, options);
            res.json(result)
        })

    }
    finally{
        //await client.close()
    }
}
run().catch(console.dir);
