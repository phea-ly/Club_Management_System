const eventRepository = require("../repositories/EventRepository");

function validateEventPayload(payload) {
    const errors = [];
    const requiredFields = ["title", "date", "time", "location", "description"];

    requiredFields.forEach((field) => {
        if (!payload[field] || String(payload[field]).trim() === "") {
            errors.push(`${field} is required`);
        }
    });

    if (payload.date && Number.isNaN(Date.parse(payload.date))) {
        errors.push("date must be a valid date");
    }

    if (payload.time && !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(payload.time)) {
        errors.push("time must use HH:mm or HH:mm:ss format");
    }

    return errors;
}

class EventService {
    async listEvents() {
        return eventRepository.findAll();
    }

    async getEvent(id) {
        const event = await eventRepository.findById(id);
        if (!event) {
            const error = new Error("Event not found");
            error.statusCode = 404;
            throw error;
        }
        return event;
    }

    async createEvent(payload, user) {
        const errors = validateEventPayload(payload);
        if (errors.length) {
            const error = new Error(errors.join(", "));
            error.statusCode = 400;
            throw error;
        }

        return eventRepository.create({
            title: payload.title.trim(),
            date: payload.date,
            time: payload.time,
            location: payload.location.trim(),
            description: payload.description.trim(),
            clubId: payload.clubId,
            createdBy: user && user.id
        });
    }

    async updateEvent(id, payload) {
        await this.getEvent(id);

        const errors = validateEventPayload(payload);
        if (errors.length) {
            const error = new Error(errors.join(", "));
            error.statusCode = 400;
            throw error;
        }

        return eventRepository.update(id, {
            title: payload.title.trim(),
            date: payload.date,
            time: payload.time,
            location: payload.location.trim(),
            description: payload.description.trim(),
            clubId: payload.clubId
        });
    }

    async deleteEvent(id) {
        await this.getEvent(id);
        return eventRepository.delete(id);
    }

    async registerForEvent(eventId, user) {
        await this.getEvent(eventId);

        const studentId = user && user.id;
        if (!studentId) {
            const error = new Error("Student id is required to register for an event");
            error.statusCode = 400;
            throw error;
        }

        const existing = await eventRepository.findRegistration(eventId, studentId);
        if (existing) {
            const error = new Error("Student is already registered for this event");
            error.statusCode = 409;
            throw error;
        }

        return eventRepository.register(eventId, studentId);
    }

    async listRegistrations(eventId) {
        await this.getEvent(eventId);
        return eventRepository.listRegistrations(eventId);
    }
}

module.exports = new EventService();
