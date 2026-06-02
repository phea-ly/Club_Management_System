class Attendance {
  constructor({
    id,
    clubId,
    activityName,
    activityType = "meeting",
    activityDate,
    recordedBy,
    records = [],
    summary = {},
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.clubId = clubId;
    this.activityName = activityName;
    this.activityType = activityType;
    this.activityDate = activityDate;
    this.recordedBy = recordedBy;
    this.records = records;
    this.summary = summary;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Attendance;
