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



export const registerModel = mongoose.model('register',registerSchema)
export const sevaModel = mongoose.model('seva',sevaSchema)
export const sevaAdminModel = mongoose.model('sevaAdmin',sevaAdmin)
export default registerModel