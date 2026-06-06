const clubService = require("../services/ClubService");

const clubListView = require("../views/clubs/club_list");
const clubFormView = require("../views/clubs/clubFormView");

const sendSuccess = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const getErrorStatus = (error) => {
  return error.message.includes("not found") ? 404 : 400;
};

class ClubController {
  async getClubs(req, res) {
    try {
      const clubs = await clubService.getClubs();

      if (String(req.headers.accept || "").toLowerCase().includes("text/html")) {
        return res.send(clubListView(clubs, req.user));
      }

      sendSuccess(res, 200, clubs, "Clubs retrieved successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  async createForm(req, res) {
    try {
      return res.send(clubFormView({
        title: "Create Club",
        action: "/clubs",
        club: {},
        currentUser: req.user,
      }));
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  async getClubById(req, res) {
    try {
      const club = await clubService.getClubById(req.params.id);
      sendSuccess(res, 200, club, "Club retrieved successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  async createClub(req, res) {
    try {
      const club = await clubService.createClub(req.body);
      if (String(req.headers.accept || "").toLowerCase().includes("text/html")) {
        return res.redirect("/clubs");
      }

      sendSuccess(res, 201, club, "Club created successfully");
    } catch (error) {
      if (String(req.headers.accept || "").toLowerCase().includes("text/html")) {
        return res.status(400).send(clubFormView({
          title: "Create Club",
          action: "/clubs",
          club: req.body,
          currentUser: req.user,
          error: error.message,
        }));
      }

      sendError(res, 400, error.message);
    }
  }

  async updateClub(req, res) {
    try {
      const club = await clubService.updateClub(req.params.id, req.body);
      sendSuccess(res, 200, club, "Club updated successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  async deleteClub(req, res) {
    try {
      const club = await clubService.deleteClub(req.params.id);
      sendSuccess(res, 200, club, "Club deleted successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  async requestToJoin(req, res) {
    try {
      const joinRequest = await clubService.requestToJoin(req.params.id, req.body);
      sendSuccess(res, 201, joinRequest, "Join request submitted successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  async getJoinRequests(req, res) {
    try {
      const requests = await clubService.getJoinRequests(req.params.id);
      sendSuccess(res, 200, requests, "Join requests retrieved successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  async reviewJoinRequest(req, res) {
    try {
      const request = await clubService.reviewJoinRequest(
        req.params.id,
        req.params.requestId,
        req.params.action
      );

      sendSuccess(res, 200, request, "Join request reviewed successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }
}

module.exports = new ClubController();
