const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
var jwt = require('jsonwebtoken');
app.use(cors())
app.use(express.json())
require('dotenv').config()

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.cv9zbqw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    const productCollection = client.db('accesories_hero').collection('products')
    const userCollection = client.db('accesories_hero').collection('users')
    const cartProductCollection = client.db('accesories_hero').collection('cartProducts')
    try {
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.send({ token })
        })
        app.post('/users', async (req, res) => {
            const products = req.body;
            const result = await userCollection.insertOne(products)
            res.send(result)
        })
        app.get('/users', verifyJWT, async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const newrole = req.body.role;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: newrole
                },
            };
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query)
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
        app.get('/products/:type', async (req, res) => {
            const id = req.params.type;
            const query = { category: id }
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/product/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
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