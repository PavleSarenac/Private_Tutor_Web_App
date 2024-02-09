import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import defaultRouter from "./routers/default.router"
import path from "path"

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/my_dearest_teacher")
const conn = mongoose.connection
conn.once("open", () => {
    console.log("Connection to the 'my_dearest_teacher' database was successful.")
})

app.use("/files", express.static(path.join(__dirname, "files")))

app.use("/", defaultRouter)
app.listen(4000, () => console.log("Express server running on port 4000."))