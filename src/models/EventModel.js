const AbstractModel = require("../core/base/AbstractModel");

class Event extends AbstractModel {
    constructor({
        id = null,
        clubId,
        title,
        description = "",
        location,
        eventDate,
        status = "scheduled",
        maxParticipants = null,
        attendeeCount = 0,
        registrations = [],
        createdAt = null,
        updatedAt = null,
        club_id,
        event_date,
        max_participants,
        attendee_count,
        registrations: registrations_data,
        created_at,
        updated_at,
    }) {
        super();

        this.id = id;
        this.clubId = clubId ?? club_id ?? null;
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate ?? event_date ?? null;
        this.status = status;
        this.maxParticipants = maxParticipants ?? max_participants ?? null;
        this.attendeeCount = attendeeCount ?? attendee_count ?? 0;
        this.registrations = this.normalizeValue(registrations ?? registrations_data, []);
        this.createdAt = createdAt ?? created_at ?? null;
        this.updatedAt = updatedAt ?? updated_at ?? null;
    }

    normalizeValue(value, fallback) {
        if (value == null) {
            return fallback;
        }

        if (Array.isArray(value) || typeof value === "object") {
            return value;
        }

        if (typeof value === "string") {
            const trimmed = value.trim();

            if (!trimmed) {
                return fallback;
            }

            try {
                return JSON.parse(trimmed);
            } catch (_error) {
                return fallback;
            }
        }

        return fallback;
    }

    toJSON() {
        return {
            id: this.id,
            clubId: this.clubId,
            title: this.title,
            description: this.description,
            location: this.location,
            eventDate: this.eventDate,
            status: this.status,
            maxParticipants: this.maxParticipants,
            attendeeCount: this.attendeeCount,
            registrations: this.registrations,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = Event;
