const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.cv9zbqw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    const productCollection = client.db('accesories_hero').collection('products')
    const userCollection = client.db('accesories_hero').collection('users')
    const cartProductCollection = client.db('accesories_hero').collection('cartProducts')
    try {
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const products = req.body;
            const result = await userCollection.insertOne(products)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const status = req.body.advertise
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    advertise: status
                },
            };
            const result = await productCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.post('/cartproducts', async (req, res) => {
            const products = req.body;
            const result = await cartProductCollection.insertOne(products)
            res.send(result)
        })

        app.get('/cartproducts/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await cartProductCollection.find(query).toArray()
            res.send(result)
        })
        app.patch('/cartproduct/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body.quantity;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: data
                },
            };
            const result = await cartProductCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.delete('/cartproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartProductCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})