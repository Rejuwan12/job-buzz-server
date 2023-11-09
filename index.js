
const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId }=require('mongodb');
const port = process.env.PORT || 5000

//parsers

app.use(express.json())
app.use(cors())

// DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anrbjpf.mongodb.net/jobBuzz?retryWrites=true&w=majority`;

// Create a MongoClient 
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

    const cetegoryCollection =
       client.db('jobBuzz').collection('cetegorys');
    const appliedCollection =  
       client.db('jobBuzz').collection('appliedJob');

        

     app.get('/api/v1/cetegorys', async (req,res)=>{
      console.log(req.query.email);
      let query = {}
    if (req.query?.email) {
        query = { email: req.query.email }
    }
    const cursor = cetegoryCollection.find(query)
        // const cursor = cetegoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
        
      });
        
     app.get('/api/v1/cetegorys/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id) };
       const result = await cetegoryCollection.findOne(query);
       res.send(result);
      });

      app.put("/api/v1/cetegorys/:id",  async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updateJob = req.body;
        const newJob = {
          $set: {
    
          posted_the_job: updateJob.posted_the_job,
          Job_Title: updateJob.Job_Title,
          cetegory: updateJob.cetegory,
          Posting_Date: updateJob.Posting_Date,
          Application_Deadline: updateJob.Application_Deadline,
          Salary_range: updateJob.Salary_range,
          img_url: updateJob.img_url,
          Details_Button: updateJob.Details_Button
          },
        }
        const result = await cetegoryCollection.updateOne(query, newJob, options)
        res.send(result)
      })

      app.delete("/api/v1/cetegorys/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id : new ObjectId(id) }
        const result = await cetegoryCollection.deleteOne(query)
        console.log(id);
        res.send(result)
      })

     app.post('/api/v1/cetegorys', async(req, res) => {
        const product = req.body;
        const result = await cetegoryCollection.insertOne(product);
        res.send(result);
      });

     // applied job related
     app.get('/api/v1/user/applied', async (req,res)=>{
      const cursor = appliedCollection.find();
      const result = await cursor.toArray();
        res.send(result);
      });

      // my job
      app.get('/api/v1/user/applied/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id) };
        const result = await appliedCollection.findOne(query);
        res.send(result);
       });

     app.post('/api/v1/user/applied', async(req, res) => {
        const appliedJob = req.body;
        const result = await appliedCollection.insertOne(appliedJob);
        res.send(result);
      });
     
      // post related
      // app.get('/api/v1/cetegorys/:email', async(req, res)=>{
      //   const email = req.params.email;
      //   const query = {  email: email };
      //   const result = await cetegoryCollection.findOne(query);
      //   res.send(result);
      //  });
     

     app.delete('/api/v1/user/delete-job/:jobId', async(req, res) => {
        const id = req.params.jobId;
        const query = { _id: new ObjectId(id) };
        const result = await cetegoryCollection.deleteOne(query);
        res.send(result)
      });
     



      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


 //server created 
     app.get('/', (req, res) => {
       res.send('Jobs Site Server Is Running!')
     })

     app.listen(port, () => {
       console.log(`Example app listening at port ${port}`)
     })