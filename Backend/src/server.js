import express from "express"
import { ENV } from "./config/env.js";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";
import cors from "cors"
import {clerkMiddleware} from "@clerk/express"
import userRoutes from "./routes/user.route.js"

const app = express();

app.use(cors())
app.use(express.json)

app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users",userRoutes)

connectDB()
  .then(() => {
    app.listen(ENV.PORT, () =>
      console.log("server is up and running on PORT:", ENV.PORT)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
app.get("/",(req,res)=> res.send("Hello from server"))

app.listen(ENV.PORT,()=> console.log("server is up and running on PORT:",ENV.PORT));