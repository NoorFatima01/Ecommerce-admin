import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("using cached connection");
    return cached.conn;

  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // disables buffering of commands, 
      //which means that commands (such as database queries) are sent to the server immediately 
      //instead of being held in a buffer.
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      console.log("New connection established");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
