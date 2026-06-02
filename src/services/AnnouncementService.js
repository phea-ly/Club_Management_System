const announcementRepository = require("../repositories/AnnouncementRepository");

const ALLOWED_AUDIENCES = ["members", "leaders", "all"];

class AnnouncementService {
    async listAnnouncements(filters = {}) {
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 100);
        const page = Math.max(Number(filters.page) || 1, 1);

        return announcementRepository.findAll({
            clubId: filters.clubId,
            audience: filters.audience,
            limit,
            offset: (page - 1) * limit,
        });
    }

    async getAnnouncement(id) {
        const announcement = await announcementRepository.findById(id);

        if (!announcement) {
            const error = new Error("Announcement not found");
            error.statusCode = 404;
            throw error;
        }

        return announcement;
    }

    async createAnnouncement(payload, authorId) {
        const data = this.validatePayload(payload);
        return announcementRepository.create({ ...data, author_id: authorId });
    }

    async updateAnnouncement(id, payload) {
        await this.getAnnouncement(id);
        const data = this.validatePayload(payload, { partial: true });
        return announcementRepository.update(id, data);
    }

    async deleteAnnouncement(id) {
        await this.getAnnouncement(id);
        return announcementRepository.delete(id);
    }

    validatePayload(payload, { partial = false } = {}) {
        const data = {};

        if (!partial || payload.title !== undefined) {
            if (!payload.title || !String(payload.title).trim()) {
                throw this.validationError("Announcement title is required");
            }
            data.title = String(payload.title).trim();
        }

        if (!partial || payload.content !== undefined) {
            if (!payload.content || !String(payload.content).trim()) {
                throw this.validationError("Announcement content is required");
            }
            data.content = String(payload.content).trim();
        }

        if (payload.club_id !== undefined) {
            data.club_id = payload.club_id ? Number(payload.club_id) : null;
        }

        if (payload.audience !== undefined) {
            if (!ALLOWED_AUDIENCES.includes(payload.audience)) {
                throw this.validationError("Audience must be members, leaders, or all");
            }
            data.audience = payload.audience;
        }

        if (payload.event_date !== undefined) {
            const eventDate = payload.event_date ? new Date(payload.event_date) : null;

            if (eventDate && Number.isNaN(eventDate.getTime())) {
                throw this.validationError("Event date must be a valid date");
            }

            data.event_date = eventDate;
        }

        return data;
    }

    validationError(message) {
        const error = new Error(message);
        error.statusCode = 400;
        return error;
    }
}

module.exports = new AnnouncementService();
