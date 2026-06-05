const AbstractController = require("../core/base/AbstractController");
const eventService = require("../services/EventService");
const eventListView = require("../views/events/eventListView");
const eventFormView = require("../views/events/eventFormView");

class EventController extends AbstractController {
    constructor() {
        super();
        this.eventService = eventService;
    }

    index = async (req, res) => {
        try {
            const [events, clubs] = await Promise.all([
                this.eventService.getEvents(req.query),
                this.eventService.getClubs(),
            ]);

            return res.send(eventListView({ events, clubs, filters: req.query }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    createForm = async (req, res) => {
        try {
            const clubs = await this.eventService.getClubs();

            return res.send(eventFormView({
                clubs,
                event: { clubId: req.query.clubId || "", status: "scheduled" },
                title: "Create Event",
                action: "/events",
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    store = async (req, res) => {
        try {
            await this.eventService.createEvent(req.body);
            const clubId = req.body.clubId ? `?clubId=${encodeURIComponent(req.body.clubId)}` : "";
            return res.redirect(`/events${clubId}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    editForm = async (req, res) => {
        try {
            const [event, clubs] = await Promise.all([
                this.eventService.getEventById(req.params.id),
                this.eventService.getClubs(),
            ]);

            return res.send(eventFormView({
                clubs,
                event,
                title: "Edit Event",
                action: `/events/${event.id}`,
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    update = async (req, res) => {
        try {
            const event = await this.eventService.updateEvent(req.params.id, req.body);
            return res.redirect(`/events?clubId=${encodeURIComponent(event.clubId)}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    destroy = async (req, res) => {
        try {
            const event = await this.eventService.getEventById(req.params.id);
            await this.eventService.deleteEvent(req.params.id);
            return res.redirect(`/events?clubId=${encodeURIComponent(event.clubId)}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new EventController();
