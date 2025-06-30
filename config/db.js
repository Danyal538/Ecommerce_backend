import mongoose from "mongoose";

export const connectDb = async () => {
    await mongoose.connect("mongodb+srv://danyalatique0:NOWunr1AsegqbixG@cluster0.eoxfjix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("Database Connected"))
}