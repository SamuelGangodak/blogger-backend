// import express from "express"
// import multer from "multer";
// // import db from "./db/connection.js"
// import cors from "cors"

// import dotenv from 'dotenv';

// dotenv.config();

// import pkg from 'pg';
// const { Pool } = pkg;

// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });

// const app=express();

// const port=process.env.PORT || 3000;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}.${file.originalname}`)
//     }
// })
  
// const upload = multer({ storage: storage })

// app.use(express.json())
// app.use(cors()) 
// app.use('/uploads', express.static('uploads'))

// app.get("/", (req, res)=>{
//     res.set('Access-Control-Allow-Origin', '*');
//     res.json({"message":"Hello World!"});
// })

// app.get("/blog/:cat", async (req, res)=>{
//     res.set('Access-Control-Allow-Origin', '*');
//     const result=await pool.query(
//         req.params.cat!='all' ? `SELECT * FROM blogs where category = '${req.params.cat}' ORDER by id DESC` : 'SELECT * FROM blogs ORDER by id DESC'
//     );
//     res.json({"data": result.rows});
// })

// app.get("/blog/id/:id", async (req, res)=>{
//     res.set('Access-Control-Allow-Origin', '*');
//     const result=await pool.query(`SELECT * FROM blogs WHERE id = ${req.params.id} ORDER by id DESC`);
//     res.json({"data": result.rows});
// })

// app.post("/blog", async (req, res)=>{
//     res.set('Access-Control-Allow-Origin', '*');
//     const result=await pool.query('INSERT INTO blogs (title, image, post, category) VALUES($1, $2, $3, $4)', [req.body.title, req.body.image, req.body.post, req.body.category]);
//     res.json({"message": "Added a new blog", "desc": result.rowCount});
// })

// app.post('/blogimage', upload.single('file'), function (req, res, next) {
//     res.set('Access-Control-Allow-Origin', '*');
//     res.json(req.file)
// })

// app.listen(port, ()=>{
//     console.log(`Listening on port ${port}`);
// })


import express from "express";
import multer from "multer";
import cors from "cors";
// import dotenv from 'dotenv';
// import pkg from 'pg';
import pool from "./db/connection.js"

// dotenv.config();

// const { Pool } = pkg;

// const pool = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.json({ "port" : port, "message": "Hello World!" });
});

app.get("/blog/:cat", async (req, res) => {
  try {
    const category = req.params.cat !== 'all' ? req.params.cat : '%';
    const result = await pool.query(
      'SELECT * FROM blogs WHERE category LIKE $1 ORDER BY id DESC',
      [category]
    );
    res.json({ "data": result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/blog/id/:id", async (req, res) => {
    console.log("hello");
  try {
    const id = parseInt(req.params.id, 10);
    console.log(id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const result = await pool.query(
      'SELECT * FROM blogs WHERE id = $1 ORDER BY id DESC',
      [id]
    );
    res.json({ "data": result.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ "port" : port,  error: err.message });
  }
});

app.post("/blog", async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO blogs (title, image, post, category) VALUES($1, $2, $3, $4)',
      [req.body.title, req.body.image, req.body.post, req.body.category]
    );
    res.json({ "message": "Added a new blog", "desc": result.rowCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ "port" : port,  error: err.message });
  }
});

app.post('/blogimage', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json(req.file);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
