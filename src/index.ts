import { config } from "dotenv";
config();
import app from "./server";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.error(error);
  }
}

start();
export default app;
