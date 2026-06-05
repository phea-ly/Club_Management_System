const AbstractModel = require("../core/base/AbstractModel");

class Member extends AbstractModel {
    constructor({
        id = null,
        clubId,
        name,
        email,
        phone = "",
        status = "active",
        participationCount = 0,
        lastParticipatedAt = null,
        notes = "",
        createdAt = null,
        updatedAt = null,
        club_id,
        participation_count,
        last_participated_at,
        created_at,
        updated_at,
    }) {
        super();

        this.id = id;
        this.clubId = clubId ?? club_id ?? null;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.participationCount = participationCount ?? participation_count ?? 0;
        this.lastParticipatedAt = lastParticipatedAt ?? last_participated_at ?? null;
        this.notes = notes;
        this.createdAt = createdAt ?? created_at ?? null;
        this.updatedAt = updatedAt ?? updated_at ?? null;
    }

    toJSON() {
        return {
            id: this.id,
            clubId: this.clubId,
            name: this.name,
            email: this.email,
            phone: this.phone,
            status: this.status,
            participationCount: this.participationCount,
            lastParticipatedAt: this.lastParticipatedAt,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = Member;
