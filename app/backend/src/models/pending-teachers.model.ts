import mongoose from "mongoose"
import { userSchema } from "./user.model"

const PendingTeachersModel = mongoose.model("PendingTeachersModel", userSchema, "pending-teachers")
export default PendingTeachersModel