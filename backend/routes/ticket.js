// routes/ticket.js
const express = require("express");
const Ticket = require("../models/Ticket");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /tickets
 * @desc Create a new ticket
 */
router.post("/tickets", authenticate, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Please provide subject and message" });
    }

    const newTicket = new Ticket({
      user: req.user.id,
      subject,
      message,
    });

    await newTicket.save();

    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /tickets
 * @desc Get all tickets (admin only)
 */
router.get("/tickets", authenticate, async (req, res) => {
  try {
      console.log("Fetching tickets for user:", req.user);

      // Fetch all tickets (or filter by user if needed)
      const tickets = await Ticket.find().populate("user", "email");

      console.log("Tickets fetched:", tickets);
      res.status(200).json({ tickets });
  } catch (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).json({ error: "Server error" });
  }
});
/**
 * @route PUT /tickets/:id/status
 * @desc Update ticket status (admin only)
 */
router.put("/tickets/:id/status", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket status updated", ticket: updatedTicket });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;