import mongoose from "mongoose"

const classSchema = new mongoose.Schema(
    {
        id: Number,
        studentUsername: String,
        teacherUsername: String,
        subject: String,
        startDate: String,
        endDate: String,
        startTime: String,
        endTime: String,
        description: String,
        isClassAccepted: Boolean,
        isClassRejected: Boolean,
        isClassCancelled: Boolean,
        isClassDone: Boolean,
        didClassRequestExpire: Boolean,
        rejectionReason: String
    },
    {
        versionKey: false
    }
);

const ClassModel = mongoose.model("ClassModel", classSchema, "classes")
export default ClassModel