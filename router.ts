/**
 * Required External Modules and Interfaces
 */

import express from "express"
import * as authController from "./controllers/authController"
import * as ticketsController from "./controllers/ticketsController"
import * as uploadsController from "./controllers/uploadsController"

import { auth } from "./middleware/auth"

/**
 * Router Definition
 */

export const router = express.Router()

// Route for registering a user
router.post("/api/register", authController.register)
// Route for logging in a user
router.post("/api/login", authController.login)
// Route for logging out a user
router.post("/api/logout", authController.logout)
// Route for creating a ticket
router.post("/api/tickets", auth, ticketsController.create)
// Route for getting tickets for a given client and status
router.get("/api/tickets/:role/:id/:status", auth, ticketsController.getClient)
// Route for getting all tickets
router.get("/api/tickets", auth, ticketsController.getAll)
// Route for getting a ticket
router.get("/api/tickets/:ticketcrf", auth, ticketsController.getOne)
// Route for an admin updating a ticket
router.patch("/api/tickets/admin/:ticketcrf", auth, ticketsController.updateOne)
// Route for a user updating a ticket
router.patch("/api/tickets/user/:ticketcrf", auth, ticketsController.updateCopy)
// Route for uploading images
router.post("/api/upload", auth, uploadsController.multipleUpload)

