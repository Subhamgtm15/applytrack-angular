import express from "express";
import { pool } from "../db";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/authRequest";


const router = express.Router();

router.use(authMiddleware); // This will ensure that all routes defined in this router will require authentication. The authMiddleware will check for a valid JWT token in the cookies and allow access to the routes if the token is valid, otherwise it will return a 401 Unauthorized response.

router.post("/applications", async (req:AuthRequest, res) => { // This endpoint will receive the application data from the frontend and save it to the database. We will also add validation to ensure that the required fields are provided and handle any errors that may occur during the database insertion.
    const { company, role, location, jobType, salary, source, status, dateApplied, followUpDate, interviewDate, notes } = req.body;

    if (!company || !role || !location || !jobType || !status || !dateApplied) {
        return res.status(400).json({
            error: "Missing required fields."
        });
    }
    // Get the user ID from the authenticated request. The authMiddleware will have added the user information to the request object if the JWT token was valid.
    const userId = req.user.userId;

    // Insert the application data into the database
    const insertQuery = `INSERT INTO applications (company, role, location, job_type, salary, source, status, date_applied, follow_up_date, interview_date, notes,user_id, had_interview) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`; //returning * will return the inserted row, we can use this to send back the inserted application data in the response. 


    // had_interview is a permanent milestone: true the moment an application is created in (or reaches) the interview stage.
    // The values array should match the order of the columns in the insert query
    const values = [company, role, location, jobType, salary, source, status, dateApplied, followUpDate || null, interviewDate || null, notes,userId, status === "interview"];
    try {
        const result = await pool.query(insertQuery, values);
        res.status(201).json({ message: "Application added successfully", application: result.rows[0] });
    }
    catch (error) {
        console.error("Error inserting application:", error);
        res.status(500).json({ error: "An error occurred while adding the application" });
    }
});


router.get("/applications", async (req:AuthRequest, res) => {

    const userId = req.user.userId;

    const selectQuery =`
    SELECT * FROM applications 
    WHERE user_id = $1
    ORDER BY date_applied DESC`;
    try {
        const result = await pool.query(selectQuery, [userId]);
        res.status(200).json({ message: 'application fetched', applications: result.rows });
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "An error occurred while fetching applications" });
    }
})

router.delete("/applications/:id", async (req:AuthRequest, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const deleteQuery = `
    DELETE FROM applications 
    WHERE id = $1 AND user_id = $2
    RETURNING *`;
    try {
        const result = await pool.query(deleteQuery, [id,userId]);
        res.status(200).json({ deletedApplication: result.rows[0], message: "Application deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ error: "An error occurred while deleting the application" });
    }
});

router.get("/applications/:id", async (req:AuthRequest, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateQuery =`
    SELECT * FROM applications 
    WHERE id=$1 AND user_id=$2
    `;
    try {
        const result = await pool.query(updateQuery, [id,userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Application not found" });
        }
        console.log(result.rows[0]); // Log the retrieved application data to the console
        res.status(200).json({ success: true, application: result.rows[0] });
    }
    catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ error: "An error occurred while fetching the application" });
    }
})

router.put("/applications/:id", async (req:AuthRequest, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const { company, role, location, jobType, salary, source, status, dateApplied, followUpDate, interviewDate, notes } = req.body;
    if (!company || !role || !location || !jobType || !status || !dateApplied) {
        return res.status(400).json({
            error: "Missing required fields."
        });
    }
    // had_interview references the existing row value (OR) so it is never cleared once set:
    // e.g. changing status from "interview" to "rejected" keeps the interview milestone true.
    // $13 is a dedicated boolean param (computed below) so we don't reuse $7 in two conflicting type contexts.
    const updateQuery = `
    UPDATE applications
    SET company = $1, role = $2, location = $3, job_type = $4, salary = $5, source = $6, status = $7, date_applied = $8, follow_up_date = $9, notes = $10, interview_date = $14, had_interview = had_interview OR $13
    WHERE id = $11 AND user_id = $12
    RETURNING *`;
    const values = [company, role, location, jobType, salary, source, status, dateApplied, followUpDate || null, notes, id, userId, status === "interview", interviewDate || null];
    try {
        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.status(200).json({ message: "Application updated successfully", application: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ error: "An error occurred while updating the application" });
    }
});


export default router;