import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI ;

    if(!uri){
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    await mongoose.connect(uri);

    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};