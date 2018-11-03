
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('password');
  })
  .createTable('recipes', function(table) {
    table.increments('id').unsigned().primary();
    table.string('name').notNull();
    table.text('description');
    table.text('top_ingredients');
    table.json('instructions');
    table.integer('user_id').references('id').inTable('users').notNull();
    table.timestamps();
  })
  .createTable('ingredients', function(table) {
    table.integer('ndbno').primary();
    table.text('name').notNull();
    table.decimal('std_amount').notNull();
    table.text('std_measure').notNull();
    table.decimal('kcal_per');
    table.decimal('fat_per');
    table.decimal('sat_fat_per');
    table.decimal('fiber_per');
    table.decimal('cholesterol_per');
    table.decimal('sodium_per');
    table.decimal('carbs_per');
    table.decimal('sugar_per');
    table.decimal('protein_per'); 
  })
  .createTable('recipe_ingredients', function(table) {
    table.increments('id').primary();
    table.integer('recipe_id').notNull();
    table.foreign('recipe_id').references('recipes.id');
    table.integer('food_no').notNull();
    table.foreign('food_no').references('ingredients.ndbno');
    table.decimal('quantity');
    table.text('quantity_measure');
    table.integer('list_position');
  })
  .alterTable('ingredients', function(table) {
    table.string('std_measure').notNull().defaultTo('g').alter();
  })
  .alterTable('recipe_ingredients', function(table) {
    table.string('quantity_measure').notNull().defaultTo('g').alter();
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('users'),
    knex.schema.dropTable('recipes'),
    knex.schema.dropTable('ingredients'),
    knex.schema.dropTable('recipe_ingredients'),
    knex.schema.alterTable('ingredients', function(table) {
      table.string('std_measure').notNull().alter();
    }),
    knex.schema.alterTable('recipe_ingredients', function(table) {
      table.string('quantity_measure').defaultTo(null).alter();
    })
  ]);
};