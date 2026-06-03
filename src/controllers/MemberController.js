const MemberService = require("../services/MemberService");
const MemberRepository = require("../repositories/MemberRepository");
const ClubRepository = require("../repositories/ClubRepository");
const UserRepository = require("../repositories/UserRepository");

const memberService = new MemberService(
  new MemberRepository(),
  new ClubRepository(),
  new UserRepository()
);

class MemberController {
  async list(req, res, next) {
    try {
      const members = await memberService.getMembersByClub(req);
      return res.json({ members });
    } catch (error) {
      return next(error);
    }
  }

  async add(req, res, next) {
    try {
      const member = await memberService.addMember(req);
      return res.status(201).json({ member });
    } catch (error) {
      return next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const member = await memberService.updateMemberStatus(req);
      return res.json({ member });
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const removed = await memberService.removeMember(req);
      return res.json({ removed });
    } catch (error) {
      return next(error);
    }
  }

  async participation(req, res, next) {
    try {
      const participation = await memberService.getMemberParticipation(req);
      return res.json({ participation });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MemberController();
