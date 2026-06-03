const { randomUUID } = require("crypto");
const AppError = require("../core/errors/AppError");

class EventService {
  constructor(eventRepository, clubRepository, memberRepository) {
    this.eventRepository = eventRepository;
    this.clubRepository = clubRepository;
    this.memberRepository = memberRepository;
  }

  async getEventsByClub(req) {
    const { clubId } = req.params;

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    return this.eventRepository.findAllByClub(clubId);
  }

  async createEvent(req) {
    const { actorId, isAdmin } = req;
    const { clubId } = req.params;
    const body = req.body;

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const event = {
      id: randomUUID(),
      club_id: clubId,
      title: this.requiredText(body.title, "Title"),
      description: this.optionalText(body.description),
      location: this.requiredText(body.location, "Location"),
      event_date: this.normalizeEventDate(body),
      created_by: actorId,
      created_at: this.toMysqlDateTime(new Date()),
    };

    return this.eventRepository.create(event);
  }

  async updateEvent(req) {
    const { actorId, isAdmin } = req;
    const { eventId } = req.params;
    const body = req.body;

    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError(404, "Event not found.");

    const club = await this.clubRepository.findById(event.club_id);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);

    const changes = {};
    if (body.title !== undefined) changes.title = this.requiredText(body.title, "Title");
    if (body.description !== undefined) changes.description = this.optionalText(body.description);
    if (body.location !== undefined) changes.location = this.requiredText(body.location, "Location");
    if (body.event_date !== undefined || body.date !== undefined || body.time !== undefined) {
      changes.event_date = this.normalizeEventDate({ ...event, ...body });
    }

    return this.eventRepository.update(eventId, changes);
  }

  async deleteEvent(req) {
    const { actorId, isAdmin } = req;
    const { eventId } = req.params;

    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError(404, "Event not found.");

    const club = await this.clubRepository.findById(event.club_id);
    if (!club) throw new AppError(404, "Club not found.");

    this.assertLeader(actorId, club, isAdmin);
    return this.eventRepository.deleteById(eventId);
  }

  async registerForEvent(req) {
    const { actorId } = req;
    const { eventId } = req.params;

    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new AppError(404, "Event not found.");

    const member = await this.memberRepository.findByUserAndClub(actorId, event.club_id);
    if (!member || member.status !== "ACTIVE") {
      throw new AppError(403, "Only active club members can register for this event.");
    }

    const existing = await this.eventRepository.findRegistration(eventId, actorId);
    if (existing) throw new AppError(400, "Student is already registered for this event.");

    const registration = {
      id: randomUUID(),
      event_id: eventId,
      user_id: actorId,
      created_at: this.toMysqlDateTime(new Date()),
    };

    return this.eventRepository.registerForEvent(registration);
  }

  assertLeader(actorId, club, isAdmin) {
    if (!isAdmin && club.leader_id !== actorId) {
      throw new AppError(403, "Access denied. Only the club leader can manage events.");
    }
  }

  requiredText(value, name) {
    if (typeof value !== "string" || !value.trim()) {
      throw new AppError(400, `${name} is required.`);
    }

    return value.trim();
  }

  optionalText(value) {
    if (value === undefined || value === null || value === "") return null;
    return String(value).trim();
  }

  normalizeEventDate(data) {
    const rawDate = data.event_date || data.date;
    const rawTime = data.time;

    if (!rawDate) throw new AppError(400, "Event date is required.");

    const datePart = rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : String(rawDate).trim().split(/[T ]/)[0];

    const dateValue = rawTime ? `${datePart}T${String(rawTime).trim()}` : rawDate;
    const parsed = new Date(dateValue);

    if (Number.isNaN(parsed.getTime())) {
      throw new AppError(400, "Invalid event date or time.");
    }

    return this.toMysqlDateTime(parsed);
  }

  toMysqlDateTime(date) {
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
}

module.exports = EventService;
