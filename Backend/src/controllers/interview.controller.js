const path = require("path")
const { pathToFileURL } = require("url")
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

// pdf-parse v2 requires the worker path to be set as a file:// URL before use
const pdfWorkerPath = pathToFileURL(
    path.join(path.dirname(require.resolve("pdf-parse")), "pdf.worker.mjs")
).href
pdfParse.PDFParse.setWorker(pdfWorkerPath)




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription, preparationDays } = req.body
        const days = Math.max(1, Math.min(90, parseInt(preparationDays) || 7))

        // Parse resume PDF if uploaded, otherwise fall back to selfDescription
        let resumeText = ""
        if (req.file && req.file.buffer) {
            const parser = new pdfParse.PDFParse({ data: req.file.buffer })
            const parsed = await parser.getText()
            resumeText = parsed.text || ""
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either a resume or a self description is required."
            })
        }

        console.log("Resume text length:", resumeText.length)
        console.log("selfDescription:", selfDescription?.substring(0, 50))
        console.log("jobDescription:", jobDescription?.substring(0, 50))
        console.log("preparationDays:", days)

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
            preparationDays: days
        })

        console.log("AI response keys:", Object.keys(interViewReportByAi))

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: interViewReportByAi.title || "Interview Report"
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("generateInterViewReportController error:", err)
        res.status(500).json({ message: "Failed to generate interview report.", error: err.message })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("getInterviewReportByIdController error:", err)
        res.status(500).json({ message: "Failed to fetch interview report.", error: err.message })
    }
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (err) {
        console.error("getAllInterviewReportsController error:", err)
        res.status(500).json({ message: "Failed to fetch interview reports.", error: err.message })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (err) {
        console.error("generateResumePdfController error:", err)
        res.status(500).json({ message: "Failed to generate resume PDF.", error: err.message })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }