const clubService = require("../services/ClubService");

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
  getClubs(req, res) {
    const clubs = clubService.getClubs();
    sendSuccess(res, 200, clubs, "Clubs retrieved successfully");
  }

  getClubById(req, res) {
    try {
      const club = clubService.getClubById(req.params.id);
      sendSuccess(res, 200, club, "Club retrieved successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  createClub(req, res) {
    try {
      const club = clubService.createClub(req.body);
      sendSuccess(res, 201, club, "Club created successfully");
    } catch (error) {
      sendError(res, 400, error.message);
    }
  }

  updateClub(req, res) {
    try {
      const club = clubService.updateClub(req.params.id, req.body);
      sendSuccess(res, 200, club, "Club updated successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  deleteClub(req, res) {
    try {
      const club = clubService.deleteClub(req.params.id);
      sendSuccess(res, 200, club, "Club deleted successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  requestToJoin(req, res) {
    try {
      const joinRequest = clubService.requestToJoin(req.params.id, req.body);
      sendSuccess(res, 201, joinRequest, "Join request submitted successfully");
    } catch (error) {
      sendError(res, getErrorStatus(error), error.message);
    }
  }

  getJoinRequests(req, res) {
    try {
      const requests = clubService.getJoinRequests(req.params.id);
      sendSuccess(res, 200, requests, "Join requests retrieved successfully");
    } catch (error) {
      sendError(res, 404, error.message);
    }
  }

  reviewJoinRequest(req, res) {
    try {
      const request = clubService.reviewJoinRequest(
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
