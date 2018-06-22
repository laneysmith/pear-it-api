const insertPairRecordPromise = (knex, teamId, memberIdCombo) => {
  const newPair = {
    team_id: teamId,
    member_id_1: memberIdCombo[0],
    member_id_2: memberIdCombo[1],
    count: 0
  };
  return knex("pair").insert(newPair);
};

const generateNewMemberPairComboPromises = (
  knex,
  teamId,
  newMemberId,
  teamMembers
) => {
  const pairsPromises = [];
  const allPossibleTeamMemberIdCombos = teamMembers.map(member => [
    newMemberId,
    member.id
  ]);
  allPossibleTeamMemberIdCombos.forEach(memberIdCombo => {
    pairsPromises.push(insertPairRecordPromise(knex, teamId, memberIdCombo));
  });
  return pairsPromises;
};

const recommendPairs = (pairsOrderedByCount, preferredPairs = []) => {
  if (preferredPairs.length !== 0) {
    const allOtherPairCombos = pairsOrderedByCount.filter(
      pair => [pair.member_id_1, member_id_2].sort() // blah
    );
    return [...preferredPairs, ...allOtherPairCombos];
  }
  return pairsOrderedByCount.map(pair => [pair.member_id_1, member_id_2]);
};

module.exports = {
  insertPairRecordPromise,
  generateNewMemberPairComboPromises,
  recommendPairs
};
