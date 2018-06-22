const knex = require("./knex");
const {
  generateNewMemberPairComboPromises,
  recommendPairs
} = require("./data/helpers");

module.exports = {
  findPairsByTeamId: teamId =>
    knex("team")
      .select(
        "team.id as team_id",
        "team.name as team_name",
        "pair.id as pair_id",
        "member_id_1",
        "member_id_2",
        "count"
      )
      .join("pair", "team.id", "=", "pair.team_id")
      .orderBy("count", "desc")
      .where("team.id", "=", teamId),
  findMembersByTeamId: teamId =>
    knex("member")
      .select()
      .where("member.team_id", "=", teamId),
  recommendPairs: async (teamId, preferredPairs) => {
    const pairsOrderedByCount = await knex("pair")
      .select()
      .where("team.id", "=", teamId)
      .orderBy("count", "desc");
    return recommendPairs(pairsOrderedByCount, preferredPairs);
  },
  savePairs: async (teamId, currentSelection) => {
    return null;
  },
  addMember: async body => {
    const newMember = await knex("member")
      .insert(body)
      .returning(["id", "team_id"]);
    const { id: newMemberId, team_id: teamId } = newMember[0];
    const teamMembers = await knex("member")
      .select()
      .whereNot("member.id", "=", newMemberId)
      .andWhere("member.team_id", "=", teamId)
      .returning("id");
    return Promise.all(
      generateNewMemberPairComboPromises(knex, teamId, newMemberId, teamMembers)
    );
  },
  updateMemberById: body =>
    knex("member")
      .update(body)
      .where("member.id", "=", body.id),
  deleteMemberById: memberId =>
    knex("pair")
      .del()
      .where("pair.member_id_1", "=", memberId)
      .orWhere("pair.member_id_2", "=", memberId)
      .then(() =>
        knex("member")
          .del()
          .where("member.id", "=", memberId)
      )
};
