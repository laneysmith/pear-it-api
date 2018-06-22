exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("team", function(table) {
      table.increments();
      table.text("name");
    })
    .then(function() {
      return knex.schema.createTable("member", function(table) {
        table.increments();
        table.text("name");
        table.boolean("active");
        table.boolean("out_of_office");
        table
          .integer("team_id")
          .references("id")
          .inTable("team")
          .onDelete("cascade");
      });
    })
    .then(function() {
      return knex.schema.createTable("pair", function(table) {
        table.increments();
        table
          .integer("team_id")
          .references("id")
          .inTable("team")
          .onDelete("cascade");
        table
          .integer("member_id_1")
          .references("id")
          .inTable("member")
          .onDelete("cascade");
        table
          .integer("member_id_2")
          .references("id")
          .inTable("member")
          .onDelete("cascade");
        table.integer("count");
      });
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("pair")
    .then(function() {
      return knex.schema.dropTableIfExists("member");
    })
    .then(function() {
      return knex.schema.dropTableIfExists("team");
    });
};
