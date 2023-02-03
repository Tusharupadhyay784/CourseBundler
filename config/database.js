import mongoose from 'mongoose'

// for connecting the database
export const connectDB = async () => {
    const {connection} = await mongoose.connect(process.env.MONGO_URI);
    console.log('mongoDB connected with', connection.host);
}