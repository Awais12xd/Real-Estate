import mongoose from "mongoose"

const connectDb = async () => {
    try {
        
        await mongoose.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB")

    } catch (error) {
        console.log("Mongo DB connection Error :" , error)
    }
}

export {connectDb}