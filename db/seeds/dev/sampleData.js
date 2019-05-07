const sampleData = require('../../sampleData')

const createProject = (knex, project) => {
  return knex("projects")
    .insert(
      {
        name: project.name,
      },
      'id'
    )
    .then(project_id => {
      let palettePromises = [];

      project.palettes.forEach(palette => {
        palettePromises.push(
          createPalette(knex, {
            name: palette.name,
            color1: palette.color1,
            color2: palette.color2,
            color3: palette.color3,
            color4: palette.color4,
            color5: palette.color5,
            project_id: project_id[0]
          })
        );
      });

      return Promise.all(palettePromises);
    });
};

const createPalette = (knex, palette) => {
  return knex("palettes").insert(palette);
};

exports.seed = (knex, Promise) => {
  return knex("palettes")
    .del()
    .then(() => knex("projects").del())
    .then(() => {
      let projectPromises = [];

      sampleData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};