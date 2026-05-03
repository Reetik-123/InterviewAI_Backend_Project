import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
import http from "http"
import { Server } from "socket.io"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import errorHandler from "./middlewares/error.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:8080"],
        credentials: true
    }
})

app.set("io", io)

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("join_room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
})

app.use(cors({
    origin:    "http://localhost:8080",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 6000
server.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
