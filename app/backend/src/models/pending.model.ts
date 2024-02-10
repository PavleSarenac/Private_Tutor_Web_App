import mongoose from "mongoose"
import { userSchema } from "./user.model"

const PendingModel = mongoose.model("PendingModel", userSchema, "pending")
export default PendingModel