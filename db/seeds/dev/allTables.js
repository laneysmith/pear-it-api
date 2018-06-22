const teamsData = require("../../data/teams");
const membersData = require("../../data/members");
const { insertPairRecordPromise } = require("../../data/helpers");

exports.seed = (knex, Promise) =>
  knex
    .raw("TRUNCATE TABLE pair, member, team RESTART IDENTITY CASCADE;")
    .then(() => knex("team").insert(teamsData))
    .then(() => Promise.all(generateMembersPromises(knex, membersData)))
    .then(members => Promise.all(generatePairsPromises(knex, members)));

const generateMembersPromises = (knex, membersData) => {
  const membersPromises = [];
  membersData.forEach(member => {
    membersPromises.push(insertMemberRecordPromise(knex, member));
  });
  return membersPromises;
};

const insertMemberRecordPromise = async (knex, member) => {
  const teamRecord = await knex("team")
    .where("name", member.team_name)
    .first();
  const [memberRecordPromise] = await knex("member")
    .insert({
      name: member.name,
      active: member.active,
      out_of_office: member.out_of_office,
      team_id: teamRecord.id
    })
    .returning("*");
  return memberRecordPromise;
};

const generatePairsPromises = async (knex, members) => {
  const teams = await knex("team").select();
  const pairsPromises = [];
  teams.forEach(team => {
    const teamMembers = members
      .filter(member => member.team_id === team.id)
      .map(member => member.id);
    const allPossibleTeamMemberIdCombos = teamMembers.reduce(
      (acc, a, i) => acc.concat(teamMembers.slice(i + 1).map(b => [a, b])),
      []
    );
    allPossibleTeamMemberIdCombos.forEach(memberIdCombo => {
      pairsPromises.push(insertPairRecordPromise(knex, team.id, memberIdCombo));
    });
  });
  return pairsPromises;
};
