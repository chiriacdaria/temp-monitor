import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
		await mongoose.connect('mongodb+srv://userseti:userseti@cluster0.xfa3jvu.mongodb.net/setiDatabase');
    console.log('✅ Conectat la MongoDB');
  } catch (error) {
    console.error('❌ Eroare conectare MongoDB:', error);
    process.exit(1);
  }
};

// mongodb+srv://<db_username>:<db_password>@cluster0.xfa3jvu.mongodb.net/