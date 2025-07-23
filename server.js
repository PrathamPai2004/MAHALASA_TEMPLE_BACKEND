import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors';
import twilio from 'twilio'
import {registerModel,Room,sevaModel,sevaAdminModel} from './models/registerModel.js';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import 'dotenv/config';
// import jwt, { verify } from 'jsonwebtoken'
// import nodemailer from 'nodemailer';
// const User =
const PORT = 3001;
const JWT_SECRET = "pratham_jwt_secret_2004_born"



const transporter = nodemailer.createTransport({
	secure:true,
	host:'smtp.gmail.com',
	auth:{
		user:'prathampai1999@gmail.com',
		pass:'mswffmlkpzrvxwte'
	}
});


function sendMail(to,sub,msg){
	transporter.sendMail({
		to:to,
		subject:sub,
		html:msg
	});
}

const sevaList = [
    { id: 1, name: 'Archana', amount: 50 },
    { id: 2, name: 'Abhishekam', amount: 100 },
    { id: 3, name: 'Deepa Alankara Seva', amount: 150 },
    { id: 4, name: 'Tulasi Archana', amount: 60 },
    { id: 5, name: 'Kumkuma Archana', amount: 70 },
    { id: 6, name: 'Panchamrita Abhishekam', amount: 200 },
    { id: 7, name: 'Sahasranama Archana', amount: 120 },
    { id: 8, name: 'Nitya Pooja Seva', amount: 300 },
    { id: 9, name: 'Udayasthamana Seva', amount: 1000 },
    { id: 10, name: 'Kalyanotsava', amount: 1500 },
    { id: 11, name: 'Vahana Seva', amount: 800 },
    { id: 12, name: 'Rathotsava', amount: 2000 },
    { id: 13, name: 'Annadana Seva', amount: 500 },
    { id: 14, name: 'Pushpalankara Seva', amount: 250 },
    { id: 15, name: 'Navagraha Shanti', amount: 750 },
    { id: 16, name: 'Homa / Havan Seva', amount: 900 },
    { id: 17, name: 'Chandana Alankara', amount: 350 },
    { id: 18, name: 'Ekadasa Rudrabhisheka', amount: 1100 },
    { id: 19, name: 'Laksha Deepotsava', amount: 5000 },
    { id: 20, name: 'Special Darshan Seva', amount: 100 },
    { id: 21, name: 'Vaikunta Ekadasi Seva', amount: 400 },
    { id: 22, name: 'Swarna Tulasi Archana', amount: 600 },
    { id: 23, name: 'Sahasra Deepa Alankara', amount: 700 },
    { id: 24, name: 'Vastra Seva', amount: 450 },
    { id: 25, name: 'Go Seva', amount: 300 }
  ];
  

const BASE_URL = `http://localhost:${PORT}`
const app = express()
app.use(express.json())

app.use(cors({
	origin : ["http://localhost:5173"],
	methods :["GET","POST"],	
}))





app.use(cookieParser())

const MONGO_URI = "mongodb+srv://prathampai:pratham@cluster0.u9nnxcp.mongodb.net/database_users"


mongoose.connect(MONGO_URI).then(()=>{
	console.log('Connected to the database successfully')
	  
    // Transform and insert
    // const formattedSevas = sevaList.map(seva => ({
    //   seva_name: seva.name,
    //   seva_amount: seva.amount,
	//   bookings:0,
    // }));

    //  sevaAdminModel.insertMany(formattedSevas);

    // console.log('Seva list seeded successfully');
}).catch((e)=>{
	console.log(`Error for the database -> `+ e.message)
});

const seedRoomss = async () => {
	
	console.log('🧹 Clearing existing rooms...');
  await Room.deleteMany({});
	const count = await Room.countDocuments();
	if (count === 0) {
	  console.log('🌱 Seeding rooms...');
	  const dorms = ['Simhapurush', 'Graampurush', 'Mhaalpurush'];
	  const dorms_single = ['Simhapurush']
	  for (const dorm of dorms) {
		for (let i = 1; i <= 50; i++) {
		  await Room.create({
			dormitory: dorm,
			roomNumber: i,
			isBooked: false
		  });
		}
	  }
	  console.log('✅ Seeding complete.');
	}
  };
 
app.post('/forgot-password',(req,res)=>{
	const {email} = req.body;
	registerModel.findOne({email}).then(user=>{
		if(!user){
			return res.send({Status : "User not existed"})
		}
		const token = jwt.sign({id:user.__id},"jwt_secret_key",{expiresIn : '1d'})
	})
	
})



app.post('/update',(req,res)=>{
	const data ={
		name : req.body.name,
		email : req.body.name,
		password : req.body.name
	}

	registerModel.findOne({email:data.email}).then(user=>{

	})
})

app.post('/login',(req,res)=>{
	const data= {
		email : req.body.email,
		password:req.body.password
	}

	registerModel.findOne({email:data.email}).then(user=>{
		console.log(user)
		if(user){
			
			console.log(user.password)
			
			
			console.log(`Found the user with valid email ${data.email}`)
			if(user.password===data.password){
				console.log('User name logging in '+user.name)
				console.log('password matched')
				res.json({
					"status" : "success",
					"username" : user.name
				})
			}
			else{
				console.log('Wrong password for email'+data.email)
				res.json("WRONG_PASSWORD")
			}
		}
		else{
			console.log('Record not found for email '+data.email)
			res.json("USER_NOT_EXISTS")
		}
	})
})

app.get("/confirm-seva",async(req,res)=>{
	res.send("This is confirm seva")
})
// --updation
app.post('/confirm-seva',async (req,res)=>{
	try{
		const {seva_name,totalAmount,count} = req.body;


		const bookingData = {
			seva_name,
			seva_amount:totalAmount,
			date_booked : Date.now(),
		}
		await sevaModel.create(bookingData);
    	console.log('Booking saved.');
		const updatedSeva = await sevaModel.findOne(
			{seva_name : seva_name}
		);

		if(!updatedSeva){
			return res.status(404).json({status:"error",message:"seva not found"})
		}

		
		// const matchedSeva = sevaList.find(seva=>seva.name===seva_name)

		const matchedSeva = await sevaAdminModel.findOne({seva_name:seva_name});

		let prevBookings = 0;
		if(matchedSeva){
			 prevBookings = matchedSeva.bookings;
		}

		const updateIncrement = await sevaAdminModel.findOneAndUpdate({seva_name:seva_name},{$inc:{bookings:count}},{new:true})

		


		

		console.log("Seva booking for "+ seva_name+ " incremeneted from  : "+prevBookings+" to " +updateIncrement.bookings)

		res.json({status:"success"});
	}
	catch(err){
		console.log(err)
	}
})


//Dormitory bookings

app.get('/rooms/:dormName',async (req,res)=>{
	try{
		console.log('Getting room information from dorm : '+req.params.dormName)
		const rooms = await Room.find({dormitory : req.params.dormName});
		if(!rooms){
			console.log("Didnt find the room for "+req.params.dormName)
		}
		console.log('Successfully got the get request of booking..')
		// console.log(first)
		return res.json(rooms);

	}
	catch(err){
		res.status(500).json({error:err.message})
	}
})


app.post('/rooms/books',async(req,res)=>{
	const {dormitory,roomNumber,holderName,Date,phoneNumber} = req.body;
	console.log('Booking room '+roomNumber)

	try{
		const room = await Room.findOneAndUpdate(
			{dormitory,roomNumber},
		    {
				$set:{
					isBooked: true,
					holderName,
					phoneNumber,
					Date,
				}
			},
			
			{new:true}

		)
		if(!room){
			return res.status(404).json({
				error: `Room ${room.roomNumber} not found`,
			})
		}
		else{
			console.log(`Room ${roomNumber} booked at ${dormitory}`)
			return res.json(room)
		}
	}
	catch(err){
		res.status(500).json({error:err.message})
	}
})


// router.post()
app.post('/register',async (req,res)=>{
	const data ={
		name : req.body.name,
		password:req.body.password,
		email:req.body.email
	}
		console.log('In the register begin')
		// console.log(registerModel.create(req.body))
		
		registerModel.insertMany(data).then(()=>{
			console.log('Registered successfully')
			res.json({
				"status" : "success",
				"username" : data.name
			})
		}).catch((e)=>{
			console.log('Unsucccessful registration : '+e.message)
		})
		

		//  registerModel.create(req.body).then(register=>console.log(register)).catch(e=>res.json(e));

		
	    

		// const newUser = new registerModel({name,email,password})
		// await newUser.save()
		// return res.status(201).json({ message: "User registered successfully" });
		
	
	// catch(error){
	// 	console.log(`Couldnt get the req.body+ ${error.message}`)
	// 	return res.status(500).json({ message: "Error saving user to database", error: error.message });
	// }

	
	// console.log('in the registerModel.js')
	
	// console.log(name,email,password)
	// registerModel.create(req.body).then(register=>{
	// 	res.json(register);
	// }).catch(err=>res.json(err));

	// await seedRooms();
})

app.listen(PORT,async (req,res)=>{
	console.log(`Server running on http://localhost:${PORT}`)
	// console.log(Room.countDocuments())s
	// await Room.deleteMany({})	
	// seeeedRooms()
	// let phoneNum = "+916360102084"
	// let otp = 12213
	// try{
	// 	await otpClient.messages.create({
	// 		body:`Your OTP for seva is : ${otp} \n TimeStamp : ${Date.now()}`,

	// 		from:MY_PHONE,
	// 		to:phoneNum,
	// 	});
	// 	console.log("OTP sent successfully to phone "+finalPhoneNum)
	// 	console.log("OTP SENT IS "+otp)
	// 	otpStore.set(finalPhoneNum,otp);

	// 	setTimeout(() => {
	// 		otpStore.delete(finalPhoneNum)
	// 	}, 5 * 60 * 1000);
	// 	//5 minutes

	// 	// res.json({success : true,message:`Otp sent successfully`})
	// }
	// catch(err){
	// 	console.error('Error sending OTP '+err.message)
	// 	// res.status(500).json({ success: false, message: 'Failed to send OTP' });
	// }

})


const ACCOUNT_SID = process.env.ACCOUNT_SID
const AUTH_TOKEN = process.env.AUTH_TOKEN
const MY_PHONE = process.env.MY_PHONE

const otpClient = twilio(ACCOUNT_SID,AUTH_TOKEN);

const otpStore = new Map();
let finalPhoneNum;



app.post('/send-otp',async (req,res)=>{
	let {phoneNum} = req.body
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	phoneNum = phoneNum.replace(/[\s-]/g, '');
	if (/^\d{10}$/.test(phoneNum)) {
    phoneNum= '+91' + phoneNum;
	finalPhoneNum = phoneNum
  	}
	
	// console.log(finalPhoneNum);
	console.log(finalPhoneNum)
	
	
	console.log('OTP generated..')
	try{
		await otpClient.messages.create({
			body:`Your OTP for seva is : ${otp} \n TimeStamp : ${Date.now()}`,

			from:MY_PHONE,
			to:phoneNum,
		});
		console.log("OTP sent successfully to phone "+finalPhoneNum)
		console.log("OTP SENT IS "+otp)
		otpStore.set(finalPhoneNum,otp);

		setTimeout(() => {
			otpStore.delete(finalPhoneNum)
		}, 5 * 60 * 1000);
		//5 minutes

		res.json({success : true,message:`Otp sent successfully`})
	}
	catch(err){
		console.error('Error sending OTP '+err.message)
		res.status(500).json({ success: false, message: 'Failed to send OTP' });
	}


})

app.post('/verify-otp',(req,res)=>{
	console.log("verify-otp route hit");
	let {phoneNum,otp} = req.body;

	const storedOtp = otpStore.get(finalPhoneNum);
	console.log("Stored OTP is")
	if(storedOtp&&storedOtp === otp){
		const randomStr = Math.random().toString(36).substring(2, 7).toLocaleUpperCase();
		console.log(randomStr);
		console.log("Verified otp SUCCESS")
		otpStore.delete(finalPhoneNum)
		return res.json({ success: true, message: 'OTP verified',recString:randomStr });
	}
	else{
		otpStore.clear();
	console.log("Verified unsuccessfuly")
	res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
	}
})

app.get('/',(req,res)=>{
	console.log("Server succesfully hit the / route")
	res.send("Successfully runnninf the server ")

	sendMail("connect.prathampai@gmail.com","This is a sample email","HELLO PRATHAM, THIS IS ANOTHER PRATHAM FROM NODE JS ");
})




//OTP MODULES




// app.get('/sevas/download-receipt',(req,res)=>{

// 	const token = req.query.token;

// 	if(!token){
// 		return res.status(401).json({error:"No token provided"})
// 	}

// 	try{
// 		const decoded = jwt.verify(token,JWT_SECRET)

// 		console.log("Token valid for seva Id : ",decoded.sevaId)
	
// 		res.json({
// 			sevaId : decoded.sevaId,
// 			message: "Receipt valid and ready to be downloaded",
// 	})
// }
// catch(error){
// 	console.log(error.message);
// }
// }
// )

app.get('/get-ranks', async (req, res) => {
  let ranks = [];

  for (let i = 0; i < sevaList.length; i++) {
    try {
      const seva = await sevaAdminModel.findOne({ seva_name: sevaList[i].name });

      if (seva) {
        ranks.push({
          name: seva.seva_name,
          bookings: seva.bookings || 0
        });
      } else {
        // In case not found, optionally still push with 0 bookings
        ranks.push({
          name: sevaList[i].name,
          bookings: 0
        });
      }
    } catch (error) {
      console.error(`Error fetching seva ${sevaList[i].name}:`, error);
    }
  }

  res.json(ranks);
});