const AbstractService = require("../core/base/AbstractService");
const ValidationError = require("../core/errors/ValidationError");
const NotFoundError = require("../core/errors/NotFoundError");
const memberRepository = require("../repositories/MemberRepository");
const clubRepository = require("../repositories/ClubRepository");

const ALLOWED_STATUSES = ["active", "inactive", "pending", "suspended"];

class MemberService extends AbstractService {
    constructor() {
        super();
        this.memberRepository = memberRepository;
        this.clubRepository = clubRepository;
    }

    async getMembers(filters = {}) {
        const clubId = this.#normalizeId(filters.clubId);

        if (clubId) {
            return this.memberRepository.findByClubId(clubId);
        }

        return this.memberRepository.findAll();
    }

    async getMemberById(id) {
        const member = await this.memberRepository.findById(id);

        if (!member) {
            throw new NotFoundError("Member not found");
        }

        return member;
    }

    async getClubs() {
        return this.clubRepository.findActive();
    }

    async createMember(data) {
        const clubId = this.#requireClubId(data.clubId);
        const club = await this.clubRepository.findById(clubId);

        if (!club || !club.isActive) {
            throw new NotFoundError("Club not found");
        }

        this.#validateMemberData(data);

        const existing = await this.memberRepository.findByClubEmail(clubId, data.email.trim().toLowerCase());
        if (existing) {
            throw new ValidationError("A member with this email already exists in the selected club");
        }

        return this.memberRepository.create({
            clubId,
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone?.trim() || null,
            status: data.status || "active",
            participationCount: this.#parseCount(data.participationCount, 0),
            lastParticipatedAt: data.lastParticipatedAt || null,
            notes: data.notes?.trim() || null,
        });
    }

    async updateMember(id, data) {
        const existingMember = await this.getMemberById(id);
        const clubId = this.#requireClubId(data.clubId ?? existingMember.clubId);
        const club = await this.clubRepository.findById(clubId);

        if (!club || !club.isActive) {
            throw new NotFoundError("Club not found");
        }

        this.#validateMemberData(data, false);

        const email = (data.email ?? existingMember.email).trim().toLowerCase();
        const duplicate = await this.memberRepository.findByClubEmail(clubId, email);

        if (duplicate && Number(duplicate.id) !== Number(id)) {
            throw new ValidationError("A member with this email already exists in the selected club");
        }

        return this.memberRepository.update(id, {
            clubId,
            name: (data.name ?? existingMember.name).trim(),
            email,
            phone: data.phone ?? existingMember.phone,
            status: data.status ?? existingMember.status,
            participationCount: this.#parseCount(data.participationCount, existingMember.participationCount),
            lastParticipatedAt: data.lastParticipatedAt ?? existingMember.lastParticipatedAt,
            notes: data.notes ?? existingMember.notes,
        });
    }

    async recordParticipation(id) {
        await this.getMemberById(id);
        return this.memberRepository.incrementParticipation(id);
    }

    async deleteMember(id) {
        await this.getMemberById(id);
        return this.memberRepository.delete(id);
    }

    #validateMemberData(data, requireAll = true) {
        if (requireAll || data.name !== undefined) {
            if (!data.name || data.name.trim().length < 2) {
                throw new ValidationError("Member name must be at least 2 characters");
            }
        }

        if (requireAll || data.email !== undefined) {
            if (!data.email || !data.email.includes("@")) {
                throw new ValidationError("A valid member email is required");
            }
        }

        if (data.status !== undefined && !ALLOWED_STATUSES.includes(data.status)) {
            throw new ValidationError("Invalid member status selected");
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
            throw new ValidationError("Participation count must be zero or greater");
        }

        return parsed;
    }
}

module.exports = new MemberService();
module.exports.MemberService = MemberService;
