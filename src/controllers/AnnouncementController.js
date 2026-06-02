const announcementService = require("../services/AnnouncementService");

class AnnouncementController {
    async index(req, res, next) {
        try {
            const announcements = await announcementService.listAnnouncements({
                clubId: req.query.club_id,
                audience: req.query.audience || "members",
                page: req.query.page,
                limit: req.query.limit,
            });

            res.json({ success: true, data: announcements });
        } catch (error) {
            next(error);
        }
    }

    async show(req, res, next) {
        try {
            const announcement = await announcementService.getAnnouncement(req.params.id);
            res.json({ success: true, data: announcement });
        } catch (error) {
            next(error);
        }
    }

    async store(req, res, next) {
        try {
            const announcement = await announcementService.createAnnouncement(req.body, req.user && req.user.id);
            res.status(201).json({ success: true, data: announcement });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
            res.json({ success: true, data: announcement });
        } catch (error) {
            next(error);
        }
    }

    async destroy(req, res, next) {
        try {
            await announcementService.deleteAnnouncement(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AnnouncementController();
