class Announcement {
    constructor({
        id,
        title,
        content,
        club_id,
        author_id,
        audience = "members",
        event_date = null,
        created_at,
        updated_at,
    }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.club_id = club_id;
        this.author_id = author_id;
        this.audience = audience;
        this.event_date = event_date;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = Announcement;
