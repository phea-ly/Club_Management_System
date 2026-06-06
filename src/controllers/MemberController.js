const AbstractController = require("../core/base/AbstractController");
const memberService = require("../services/MemberService");
const memberListView = require("../views/members/memberListView");
const memberFormView = require("../views/members/memberFormView");

class MemberController extends AbstractController {
    constructor() {
        super();
        this.memberService = memberService;
    }

    index = async (req, res) => {
        try {
            const [members, clubs] = await Promise.all([
                this.memberService.getMembers(req.query),
                this.memberService.getClubs(),
            ]);

            return res.send(memberListView({ members, clubs, filters: req.query, currentUser: req.user }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    createForm = async (req, res) => {
        try {
            const clubs = await this.memberService.getClubs();

            return res.send(memberFormView({
                clubs,
                member: { clubId: req.query.clubId || "", status: "active", participationCount: 0 },
                title: "Create Member",
                action: "/members",
                currentUser: req.user,
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    store = async (req, res) => {
        try {
            await this.memberService.createMember(req.body);
            const clubId = req.body.clubId ? `?clubId=${encodeURIComponent(req.body.clubId)}` : "";
            return res.redirect(`/members${clubId}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    editForm = async (req, res) => {
        try {
            const [member, clubs] = await Promise.all([
                this.memberService.getMemberById(req.params.id),
                this.memberService.getClubs(),
            ]);

            return res.send(memberFormView({
                clubs,
                member,
                title: "Edit Member",
                action: `/members/${member.id}`,
                currentUser: req.user,
            }));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    update = async (req, res) => {
        try {
            const member = await this.memberService.updateMember(req.params.id, req.body);
            return res.redirect(`/members?clubId=${encodeURIComponent(member.clubId)}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    recordParticipation = async (req, res) => {
        try {
            const member = await this.memberService.recordParticipation(req.params.id);
            return res.redirect(`/members?clubId=${encodeURIComponent(member.clubId)}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    destroy = async (req, res) => {
        try {
            const member = await this.memberService.getMemberById(req.params.id);
            await this.memberService.deleteMember(req.params.id);
            return res.redirect(`/members?clubId=${encodeURIComponent(member.clubId)}`);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}

module.exports = new MemberController();
