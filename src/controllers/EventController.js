const eventService = require("../services/EventService");

function sendError(res, error) {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error"
    });
}

class EventController {
    async index(req, res) {
        try {
            const events = await eventService.listEvents();
            return res.json({ success: true, data: events });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async show(req, res) {
        try {
            const event = await eventService.getEvent(req.params.id);
            return res.json({ success: true, data: event });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async store(req, res) {
        try {
            const event = await eventService.createEvent(req.body, req.user);
            return res.status(201).json({
                success: true,
                message: "Event created successfully",
                data: event
            });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async update(req, res) {
        try {
            const event = await eventService.updateEvent(req.params.id, req.body);
            return res.json({
                success: true,
                message: "Event updated successfully",
                data: event
            });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async destroy(req, res) {
        try {
            await eventService.deleteEvent(req.params.id);
            return res.json({
                success: true,
                message: "Event deleted successfully"
            });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async register(req, res) {
        try {
            const registration = await eventService.registerForEvent(req.params.id, req.user);
            return res.status(201).json({
                success: true,
                message: "Registered for event successfully",
                data: registration
            });
        } catch (error) {
            return sendError(res, error);
        }
    }

    async registrations(req, res) {
        try {
            const registrations = await eventService.listRegistrations(req.params.id);
            return res.json({ success: true, data: registrations });
        } catch (error) {
            return sendError(res, error);
        }
    }
}

module.exports = new EventController();
