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
        createdAt = null,
        updatedAt = null,
        club_id,
        event_date,
        max_participants,
        attendee_count,
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
        this.createdAt = createdAt ?? created_at ?? null;
        this.updatedAt = updatedAt ?? updated_at ?? null;
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
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = Event;
