const AbstractService = require("../core/base/AbstractService");
const ValidationError = require("../core/errors/ValidationError");
const NotFoundError = require("../core/errors/NotFoundError");
const eventRepository = require("../repositories/EventRepository");
const clubRepository = require("../repositories/ClubRepository");

const ALLOWED_STATUSES = ["scheduled", "completed", "cancelled"];

class EventService extends AbstractService {
    constructor() {
        super();
        this.eventRepository = eventRepository;
        this.clubRepository = clubRepository;
    }

    async getEvents(filters = {}) {
        const clubId = this.#normalizeId(filters.clubId);

        if (clubId) {
            return this.eventRepository.findByClubId(clubId);
        }

        return this.eventRepository.findAll();
    }

    async getEventById(id) {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new NotFoundError("Event not found");
        }

        return event;
    }

    async getClubs() {
        return this.clubRepository.findActive();
    }

    async createEvent(data) {
        const clubId = this.#requireClubId(data.clubId);
        const club = await this.clubRepository.findById(clubId);

        if (!club || !club.isActive) {
            throw new NotFoundError("Club not found");
        }

        this.#validateEventData(data);

        return this.eventRepository.create({
            clubId,
            title: data.title.trim(),
            description: data.description?.trim() || null,
            location: data.location.trim(),
            eventDate: this.#normalizeDate(data.eventDate),
            status: data.status || "scheduled",
            maxParticipants: this.#parseCount(data.maxParticipants),
            attendeeCount: this.#parseCount(data.attendeeCount, 0),
        });
    }

    async updateEvent(id, data) {
        const existingEvent = await this.getEventById(id);
        const clubId = this.#requireClubId(data.clubId ?? existingEvent.clubId);
        const club = await this.clubRepository.findById(clubId);

        if (!club || !club.isActive) {
            throw new NotFoundError("Club not found");
        }

        this.#validateEventData(data, false);

        return this.eventRepository.update(id, {
            clubId,
            title: (data.title ?? existingEvent.title).trim(),
            description: data.description ?? existingEvent.description,
            location: (data.location ?? existingEvent.location).trim(),
            eventDate: this.#normalizeDate(data.eventDate ?? existingEvent.eventDate),
            status: data.status ?? existingEvent.status,
            maxParticipants: this.#parseCount(data.maxParticipants, existingEvent.maxParticipants),
            attendeeCount: this.#parseCount(data.attendeeCount, existingEvent.attendeeCount),
        });
    }

    async deleteEvent(id) {
        await this.getEventById(id);
        return this.eventRepository.delete(id);
    }

    #validateEventData(data, requireAll = true) {
        if (requireAll || data.title !== undefined) {
            if (!data.title || data.title.trim().length < 2) {
                throw new ValidationError("Event title must be at least 2 characters");
            }
        }

        if (requireAll || data.location !== undefined) {
            if (!data.location || data.location.trim().length < 2) {
                throw new ValidationError("Event location is required");
            }
        }

        if (requireAll || data.eventDate !== undefined) {
            if (!data.eventDate) {
                throw new ValidationError("Event date is required");
            }
        }

        if (data.status !== undefined && !ALLOWED_STATUSES.includes(data.status)) {
            throw new ValidationError("Invalid event status selected");
        }
    }

    #requireClubId(clubId) {
        const normalized = this.#normalizeId(clubId);

        if (!normalized) {
            throw new ValidationError("Club is required");
        }

        return normalized;
    }

    #normalizeId(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }

    #parseCount(value, fallback = 0) {
        if (value === undefined || value === null || value === "") {
            return fallback;
        }

        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
            throw new ValidationError("Numeric values must be zero or greater");
        }

        return parsed;
    }

    #normalizeDate(value) {
        const normalized = typeof value === "string" ? value.replace(" ", "T") : value;
        const date = new Date(normalized);

        if (Number.isNaN(date.getTime())) {
            throw new ValidationError("A valid event date is required");
        }

        return date.toISOString().slice(0, 19).replace("T", " ");
    }
}

module.exports = new EventService();
module.exports.EventService = EventService;
