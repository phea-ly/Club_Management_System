const EventService = require("../services/EventService");
const EventRepository = require("../repositories/EventRepository");
const ClubRepository = require("../repositories/ClubRepository");
const MemberRepository = require("../repositories/MemberRepository");

const eventService = new EventService(
  new EventRepository(),
  new ClubRepository(),
  new MemberRepository()
);

class EventController {
  async list(req, res, next) {
    try {
      const events = await eventService.getEventsByClub(req);
      return res.json({ events });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const event = await eventService.createEvent(req);
      return res.status(201).json({ event });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const event = await eventService.updateEvent(req);
      return res.json({ event });
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const removed = await eventService.deleteEvent(req);
      return res.json({ removed });
    } catch (error) {
      return next(error);
    }
  }

  async register(req, res, next) {
    try {
      const registration = await eventService.registerForEvent(req);
      return res.status(201).json({ registration });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EventController();
