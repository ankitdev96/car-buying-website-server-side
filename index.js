const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');


app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mixgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;            

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run() {
    try {
      await client.connect();
      console.log('database connected successfully');
      const database = client.db("car");
      const orders = database.collection('services-car');
      const reviews = database.collection('reviews');
      const models = database.collection('models');
      const purchase = database.collection('purchased');
      const all_products = database.collection('all-Products');
      const users = database.collection('users');

      // Query for a movie that has the title 'The Room'
      // console.log(orders);

      app.get('/service',async(req,res) => {
        const cursor = orders.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      app.get('/service/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};

        const service = await orders.findOne(query);
        res.json(service);
    })

    app.get('/products/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)};

      const service = await all_products.findOne(query);
      res.json(service);
  })


      app.get('/review',async(req,res) => {
        const cursor = reviews.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      app.get('/models',async(req,res) => {
        const cursor = models.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      app.get('/products',async(req,res) => {
        const cursor = all_products.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      app.get('/purchased', async (req, res) => {
        const email = req.query.email;

        const query = { email: email }

        const cursor = purchase.find(query);
        const orders = await cursor.toArray();
        res.json(orders);
    })

    app.get('/purchasedAll', async (req, res) => {
      // const email = req.query.email;

      // const query = { email: email }

      const cursor = purchase.find({});
      const orders = await cursor.toArray();
      res.json(orders);
  })

    app.delete('/purchased/:id',async(req,res) => {
      const id = req.params.id;

      const query = {_id:ObjectId(id)};
      const result = await purchase.deleteOne(query);

      res.json(result);


    })

    app.delete('/products/:id',async(req,res) => {
      const id = req.params.id;

      const query = {_id:ObjectId(id)};
      const result = await all_products.deleteOne(query);

      res.json(result);


    })


      app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await users.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })


      app.post('/orders',async(req,res) => {
        const order = req.body;
        console.log('hit the post api');
        const result = await purchase.insertOne(order);
        console.log(result);


        res.json(result);
      })

      app.post('/users',async(req,res) => {
        const user = req.body;
        // console.log('hit the post api');
        const result = await users.insertOne(user);
        console.log(result);


        res.json(result);
      })

      app.post('/review',async(req,res) => {
        const user = req.body;
        // console.log('hit the post api');
        const result = await reviews.insertOne(user);
        console.log(result);


        res.json(result);
      })

      app.post('/products',async(req,res) => {
        const user = req.body;
        // console.log('hit the post api');
        const result = await all_products.insertOne(user);
        console.log(result);


        res.json(result);
      })

      app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await users.updateOne(filter, updateDoc, options);
        res.json(result);
    });

    app.put('/users/admin', async (req, res) => {
      const user = req.body;
    
              const filter = { email: user.email };
              const updateDoc = { $set: { role: 'admin' } };
              const result = await users.updateOne(filter, updateDoc);
              res.json(result);
    

  });

  app.put('/purchasedAll/status', async (req, res) => {
    const user = req.body;
  console.log(user);
            const filter = { status: 'pending' };
            const updateDoc = {  $set: {status: 'shipped'}  };
            const result = await purchase.updateOne(filter, updateDoc);
            res.json(result);
  

});








    } 
    finally {
    //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Car server!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})