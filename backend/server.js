// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 🟢 رابط MongoDB Atlas
const uri = "mongodb+srv://tareklogab1000_db_user:rRF67HtnzxHC5vsN@cluster0.jjfm7xf.mongodb.net/ecommerceDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let ordersCollection;

// 🟢 اتصال بالـMongoDB
async function connectDB(){
  try {
    await client.connect();
    const db = client.db("ecommerceDB");
    ordersCollection = db.collection("orders");
    console.log("MongoDB Atlas connected ✅");
  } catch(err) {
    console.error("خطأ في الاتصال بـMongoDB:", err);
  }
}
connectDB();

// ✅ إنشاء طلب جديد
app.post("/orders", async (req,res)=>{
  try{
    const order = {...req.body, date: new Date(), status:"قيد المعالجة"};
    const result = await ordersCollection.insertOne(order);
    res.status(201).send({message:"تم حفظ الطلب", id: result.insertedId});
  }catch(e){
    res.status(500).send({message:"خطأ في حفظ الطلب"});
  }
});

// ✅ جلب جميع الطلبات
app.get("/orders", async (req,res)=>{
  try{
    const orders = await ordersCollection.find({}).toArray();
    res.send(orders);
  }catch(e){
    res.status(500).send({message:"خطأ في جلب الطلبات"});
  }
});

// ✅ تحديث حالة الطلب
app.patch("/orders/:id", async (req,res)=>{
  try{
    const {id} = req.params;
    const {status} = req.body;
    await ordersCollection.updateOne({_id: new ObjectId(id)}, {$set:{status}});
    res.send({message:"تم تحديث الحالة"});
  }catch(e){
    res.status(500).send({message:"خطأ في تحديث الحالة"});
  }
});

// ✅ حذف طلب
app.delete("/orders/:id", async (req,res)=>{
  try{
    const {id} = req.params;
    await ordersCollection.deleteOne({_id: new ObjectId(id)});
    res.send({message:"تم حذف الطلب"});
  }catch(e){
    res.status(500).send({message:"خطأ في حذف الطلب"});
  }
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));