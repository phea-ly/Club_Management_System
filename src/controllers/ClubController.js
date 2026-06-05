const ClubService = require("../services/ClubService");
const ClubRepository = require("../repositories/ClubRepository");
const MemberRepository = require("../repositories/MemberRepository");

const clubService = new ClubService(new ClubRepository(), new MemberRepository());

class ClubController {
  async list(req, res, next) {
    try {
      const clubs = await clubService.listClubs(req);
      return res.json({ clubs });
    } catch (error) {
      return next(error);
    }
  }

  async show(req, res, next) {
    try {
      const club = await clubService.getClub(req);
      return res.json({ club });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const club = await clubService.createClub(req);
      return res.status(201).json({ club });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const club = await clubService.updateClub(req);
      return res.json({ club });
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const removed = await clubService.deleteClub(req);
      return res.json({ removed });
    } catch (error) {
      return next(error);
    }
  }

  async requestToJoin(req, res, next) {
    try {
      const request = await clubService.requestToJoin(req);
      return res.status(201).json({ request });
    } catch (error) {
      return next(error);
    }
  }

  async joinRequests(req, res, next) {
    try {
      const requests = await clubService.listJoinRequests(req);
      return res.json({ requests });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ClubController();
