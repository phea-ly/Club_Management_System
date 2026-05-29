const EventModel = require("../models/EventModel");

class EventRepository {
    findAll() {
        return EventModel.findAll();
    }

    findById(id) {
        return EventModel.findById(id);
    }

    create(event) {
        return EventModel.create(event);
    }

    update(id, event) {
        return EventModel.update(id, event);
    }

    delete(id) {
        return EventModel.delete(id);
    }

    register(eventId, studentId) {
        return EventModel.register(eventId, studentId);
    }

    findRegistration(eventId, studentId) {
        return EventModel.findRegistration(eventId, studentId);
    }

    listRegistrations(eventId) {
        return EventModel.listRegistrations(eventId);
    }
}

module.exports = new EventRepository();
