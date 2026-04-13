import mongoose, { mongo } from "mongoose";
const registerSchema = new mongoose.Schema({
	name :{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},

})


const sevaAdmin = new mongoose.Schema({
	seva_name :{
		type:String,

	},
	seva_amount:{
		type:Number
	},
	bookings:{
		type:Number,
		default:0
	}
})

 const sevaSchema = new mongoose.Schema({
	seva_name : {
		type:String
	},
	seva_amount :{
		type : Number
	},
	 
	mode :{
		type : String 
	},
	date_booked:{
		type : Date
	},
	 phoneNum:{
		 type:String
	 }
})

const reviewSchema = new mongoose.Schema({
	name : String,
	email : String,
	review : String,
	rating : Number,
	date : Date,
})

const adminLogin = new mongoose.Schema({
	username : String,
	password : String,
})

const roomSchema = new mongoose.Schema({
	dormitory : String,
	roomNumber : Number,
	isBooked : Boolean,
	holderName :String,
	phoneNumber : String,
	Date : Date,
})

export const Room = mongoose.model('Room',roomSchema)
export const Review = mongoose.model('Review',reviewSchema)
export const registerModel = mongoose.model('register',registerSchema)
export const sevaModel = mongoose.model('seva',sevaSchema)
export const sevaAdminModel = mongoose.model('sevaAdmin',sevaAdmin)
export const adminLoginModel = mongoose.model('adminLogin',adminLogin)
export default registerModel
