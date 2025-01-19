import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("Veritabanına bağlanmaya çalışılıyor.....");
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Veritabanına bağlandı.....");
  } catch (error) {
    console.log("Veritabanına bağlanamadı.....", error.message);
    process.exit(1);
  }
};

export default connect;