import mongoose from "mongoose";

const user = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    preferences: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
        required: true,
    }
});

const project = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    semesterCreated: {
        type: String, 
        enum: ['spring','summer','fall'],
        required: true,
    },
    yearCreated: {
        type: Number,
        required: true,
    }
});

const tenure = new mongoose.Schema({
    userId: {
        type: user,
        required: true,
    },
    semester: {
        type: String,
        enum: ['spring', 'summer', 'fall'],
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    projectId: {
        type: project,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    }
});



const userSchema = mongoose.model("userSchema", user);
const projectSchema = mongoose.model("projectSchema", project);
const tenureSchema = mongoose.model("tenureSchema", tenure);

module.exports = {
    userSchema: userSchema,
    projectSchema: projectSchema,
    tenureSchema: tenureSchema
}