const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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
        const blogCollections = database.collection('blogs')


        //post api for create blog
        app.post('/create-blog', async(req,res)=>{

            const result = await blogCollections.insertOne(req.body)
            res.json(result)
        })

    }
    finally{
        //await client.close()
    }
}
run().catch(console.dir);
