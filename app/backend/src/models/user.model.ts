import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        userType: String,
        securityQuestion: String,
        securityAnswer: String,
        name: String,
        surname: String,
        gender: String,
        address: String,
        phone: String,
        email: String,
        profilePicturePath: String,
        schoolType: String,
        currentGrade: String
    },
    {
        versionKey: false
    }
);

export default mongoose.model("UserModel", userSchema, "users");