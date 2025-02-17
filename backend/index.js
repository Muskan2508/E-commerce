const port=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());//with the help of this express.json,whatever request we will get from response that will be automatically pass throough json
app.use(cors());//using this our react js project will connect to express app on 4000port

//initializing database

//database connection with mongodb
mongoose.connect("mongodb+srv://muskan250803:25ZVS2aKhaI8Zu6V@cluster0.w8dp9.mongodb.net/E-commerce");

// //API creation"

app.get("/",(req,res)=>{
    res.send("Express app is running")
})



//Image storage engine
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})// The code sets up Multer's disk storage engine, specifying how and where to save uploaded image files on the server

const upload=multer({storage:storage})

//creating upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
     res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
     })
     
})

//will creaet an end point using that we can add the product in our mongodb databse 
//schema for creating products

const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },

    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})
app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});//to get all products of database in this array
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let  last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    console.log(product);
    //to save the product in database
    await product.save();
    console.log("saved");
    //to generate the response to the frontend
    res.json({
        success:true,
        name:req.body.name,
    })

})

//creating API for deleting the products
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products=await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

const ngoSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    url:{
        type:String,
        required:true,
    }

});
const Ngo=mongoose.model("Ngo",ngoSchema);

app.post('/addngo', async (req, res) => {
    try {
        const { name, url } = req.body;

        if (!name || !url) {
            return res.status(400).json({ success: false, message: "Name and URL are required" });
        }

        const ngo = new Ngo({ name, url });
        await ngo.save();

        console.log("NGO Saved:", ngo);
        res.json({ success: true, name: ngo.name });
    } catch (error) {
        console.error("Error saving NGO:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.get('/allngos', async (req, res) => {
    try {
        const ngos = await Ngo.find({});
        console.log("All NGOs Fetched");
        res.json({ success: true, ngos });
    } catch (error) {
        console.error("Error fetching NGOs:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Clothes schema
const ClothesSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
      enum: ['T-shirt', 'Shirt', 'Jeans', 'Trouser'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    damage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      required: true,
    },
  });
  
  // Donation schema
  const DonationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    clothesDetails: {
      type: [ClothesSchema],
      required: true,
    },
    ngo: {
      name: {
        type: String,
        required: true,
      },
    },
    donationDate: {
      type: Date,
      required: true,
    },
  });
  
  const Donation = mongoose.model("Donation", DonationSchema);

  const Users=mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    coins: {
        type: Number,
        default: 0, // Start with 0 coins
    },
    donationCount: {
        type: Number,
        default: 0, // Tracks the number of donations
    },

})
  
  module.exports = Donation;

  app.post('/donation', async (req, res) => {
    try {
      let user1 = await Users.findOne({ email: req.body.email });
      if (!user1) {
        return res.status(400).json({ success: false, error: "Please use the same email ID." });
      }
  
      const donation = new Donation({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode,
        clothesDetails: req.body.clothesDetails,
        ngo: { name: req.body.ngo }, // Corrected: req.body.ngo is a string
        donationDate: req.body.donationDate,
      });
      user1.coins += 100;
      user1.donationCount += 1;
  
      let discountApplied = false;
    //   if (user1.coins >= 500) {
    //       // discountApplied = true;
    //     //   user1.coins = 0;
    //     //   user1.donationCount = 0;
    //   }
      await user1.save();
      await donation.save();
      return res.status(200).json({ success: true, message: "Donation received!" });

      
  
      
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: err.message });
    }
    
   

  });

  app.get('/getuser', async (req, res) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ success: false, errors: 'Authentication token is required' });
    }

    try {
        const decoded = jwt.verify(token, 'secret_ecom'); // Verify token
        const user = await Users.findById(decoded.user.id); // Find user by ID

        if (!user) {
            return res.status(404).json({ success: false, errors: "User  not found" });
        }

        res.json({
            success: true,
            coins: user.coins,
            donationCount: user.donationCount,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errors: 'Internal server error' });
    }
});










//creating endpoint for registring the user
app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    else{
        let cart={}
        for(let i=0;i<300;i++){
            cart[i]=0;
        }
        const user=new Users({
            name:req.body.username,
            email:req.body.email,
            password:req.body.password,
            cartData:cart,

        })
        await user.save();
        const data={
            user:{
                id:user.id
            }
        }
        const token=jwt.sign(data,'secret_ecom');
        res.json({success:true,token})
    }
})

//creating end point for user login
app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email})
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({
                success:false,
                errors:"wrong password"
            });
        }
    }
    else{
        res.json({success:false,errors:"wrong email id"})
    }
})





//creating endpoint for new collection data
app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    console.log("Newcollection fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women)
})
//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please autehnticate using valid token"})
    }
    else{
        try {
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();

        } catch (error) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
    }
}




//creating endpoint for adding  products in cart data
app.post('/addtocart',fetchUser,async(req,res)=>{
    //console.log(req.body,req.user);
    console.log("added",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.ItemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})

////creating endpoint for aremoving products in cart data
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.ItemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");
})

//creating endpoint to get cartdata when login
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Fetching cart for user:", req.user.id);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData) {
        res.json(userData.cartData);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

//for payment

const PaymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    email: {  // 🔹 Add email field
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Payment = mongoose.model("Payment", PaymentSchema);

// ✅ Razorpay Instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Route to create a new order
app.post('/api/payment/order', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const options = {
            amount: parseInt(amount * 100, 10), // Convert to paisa
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ✅ Route to verify payment

app.post('/api/payment/verify', async (req, res) => {
    try {
        const token = req.header('auth-token'); // Get token from request header
        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token is required" });
        }

        // Validate token and get user details using the '/getuser' endpoint logic
        const decoded = jwt.verify(token, 'secret_ecom'); // Verify token
        const user = await Users.findById(decoded.user.id); // Find user by ID

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Extract payment details from the request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Validate payment details
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing required payment data!" });
        }

        // Verify Razorpay signature
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET) // Replace with your actual secret key
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature!" });
        }

        // Save payment details with the user's email
        const newPayment = new Payment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email: user.email,
        });

        await newPayment.save();

        // Deduct 500 coins if the user has enough coins
        if (user.coins >= 500) {
            user.coins -= 500;
        } else {
            return res.status(400).json({ success: false, message: "Not enough coins!" });
        }

        await user.save();

        res.status(200).json({ success: true, message: "Payment verified & 500 coins deducted!" });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: "Payment verification failed!" });
    }
});


app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port"+port)
    }
    else{
        console.log("Error :"+error)
    }
})