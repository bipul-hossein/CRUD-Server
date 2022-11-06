const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')
const port = 5000

// middle ware
app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})
/* 
dbUserName:dbUser2
password:22aqIv8MxjDcYUkJ
*/
const uri = 'mongodb://localhost:27017'
//const uri = "mongodb+srv://dbUser2:22aqIv8MxjDcYUkJ@cluster0.8gaczek.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    const UserCollection = client.db("databaseChick").collection("users");

    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = UserCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const user = await UserCollection.findOne(query);
      res.send(user);
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await UserCollection.insertOne(user);
      console.log(result);
      user.id = result.insertedId
      res.send(user)
    })


    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const user = req.body;
      const option = { upsert: true }
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email

        },
      };
      const result = await UserCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    })


    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId }
      const result = await UserCollection.deleteOne(query)
      console.log(result);
      res.send(result)
    })
  } finally { }
}
run().catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})