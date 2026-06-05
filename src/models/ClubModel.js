class Club {
  constructor({
    id,
    name,
    description,
    category,
    leader,
    activities = [],
    members = [],
    joinRequests = [],
    isActive = true,
    createdAt,
    updatedAt,
    is_active,
    created_at,
    updated_at,
    join_requests,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.leader = this.normalizeValue(leader, null);
    this.activities = this.normalizeValue(activities, []);
    this.members = this.normalizeValue(members, []);
    this.joinRequests = this.normalizeValue(joinRequests ?? join_requests, []);
    this.isActive =
      typeof isActive === "boolean"
        ? isActive
        : is_active === 1 || is_active === "1" || is_active === true;
    this.createdAt = createdAt ?? created_at;
    this.updatedAt = updatedAt ?? updated_at;
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
        return value;
      }
    }

    return value;
  }
}

module.exports = Club;
