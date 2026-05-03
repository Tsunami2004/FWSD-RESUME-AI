const mongoose = require("mongoose");

/**
 * - job description schema:String
 * - resume text: String
 * - self description: String
 * 
 * -match score: Number
 * -technical questions:
 *              [
 *           {
 *      question: "",
 *      intention: "",
 *      answer: "",
 *      }]
 * -behavioural questions:
 * [
 *           {
 *      question: "",
 *      intention: "",
 *      answer: "",
 *      }]
 * -skill gaps:[{
 * skill: "",
 * severity: {
 * low, medium, high}
 *
 * }]
 * -preparation plan:[{
 * day:number
 * focus: String
 * tasks: String}]
 * 
 */

const technincalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { 
    _id: false 
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { 
    _id: false 
})

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true }
}, { 
    _id: false 
})

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String },
    selfDescription: { type: String },
    matchScore: { type: Number, min: 0, max: 100 },
    technicalQuestions: [technincalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users"},
    title:{type:String, required:[true, "Job title is required"]}
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("interview_reports", interviewReportSchema)

module.exports = interviewReportModel

