import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
  }
  console.log(`server is running at http://localhost:${PORT}`);
});
