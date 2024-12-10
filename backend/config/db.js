import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectDb = async()=> {
try {
    mongoose.connect(process.env.MONGO_URL || '')
    console.log('database connected successfully')
} catch (error) {
    console.log("error during connection",error)
    
}
}

export default connectDb