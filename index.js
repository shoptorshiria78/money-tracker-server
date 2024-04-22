const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7bvfsss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection


    const incomeCollections = client.db("MoneyTracker").collection("income");
    const expenseCollections = client.db("MoneyTracker").collection("expense");

    // post income
    app.post('/income', async (req, res) => {

      try {
        const income = req.body;
        const result = await incomeCollections.insertOne(income)
        res.send(result);
      }
      catch (error) {
        console.log(error)
      }
    })
    //   post expense
    app.post('/expense', async (req, res) => {

      try {
        const expense = req.body;
        const result = await expenseCollections.insertOne(expense)
        res.send(result);
      }
      catch (error) {
        console.log(error)
      }
    })
    //   get income

    app.get('/getIncome/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email }
        const result = await incomeCollections.find(query).toArray();
        res.send(result);

      }
      catch (error) {
        console.log(error)
      }
    })
    //  get expense

    app.get('/getExpense/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email }
        const result = await expenseCollections.find(query).toArray();
        res.send(result);

      }
      catch (error) {
        console.log(error)
      }
    })
    // get single expense
    app.get('/getSingleExpenseId/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await expenseCollections.findOne(query);
        res.send(result);

      }
      catch (error) {
        console.log(error)
      }
    })

    // get single income
    app.get('/getSingleIncomeId/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await incomeCollections.findOne(query);
        res.send(result);

      }
      catch (error) {
        console.log(error)
      }
    })

    // delete expense

    app.delete('/deleteExpense/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await expenseCollections.deleteOne(query);
        res.send(result)

      }
      catch (error) {
        console.log(error)
      }
    })

    // delete Income

    app.delete('/deleteIncome/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await incomeCollections.deleteOne(query);
        res.send(result)

      }
      catch (error) {
        console.log(error)
      }
    })

    // update income
    app.put('/updateIncome/:id', async (req, res) => {
      try {
        const updateIncome = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            income: updateIncome.income,
            date: updateIncome.date

          }
        }

        const result = await incomeCollections.updateOne(filter, updateDoc)
        res.send(result);


      } catch (error) {
        console.log(error)
      }
    })

    // update expense
    app.put('/updateExpense/:id', async (req, res) => {
      try {
        const updateExpense = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            expense: updateExpense.expense,
            date: updateExpense.date,
            category: updateExpense.category,

          }
        }

        const result = await expenseCollections.updateOne(filter, updateDoc)
        res.send(result);


      } catch (error) {
        console.log(error)
      }
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})