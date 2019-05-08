const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


app.locals.title = 'picker';

app.use(bodyParser.json())

// GET projects
app.get("/api/v1/projects", (req, res) => {
database("projects")
  .select()
  .then((projects) => {
    res.status(200).json(projects);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
});

// GET palettes
app.get("/api/v1/palettes", (req, res) => {
  database("palettes")
    .select()
    .then((palettes) => {
      res.status(200).json(palettes);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });

// GET a project
app.get("/api/v1/projects/:id", (req, res) => {
  database("projects")
    .where("id", req.params.id)
    .select()
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });

// GET a palette
  app.get("/api/v1/palettes/:id", (req, res) => {
    database("palettes")
      .where("id", req.params.id)
      .select()
      .then((student) => {
        res.status(200).json(student);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
    });

// POST new project
  app.post("/api/v1/projects", (req, res) => {
  const newProject = req.body;
  if (!newProject.name) {
    return res.status(422).send({
      error: `Expected format: { name: <string> }`
    })
  }
  database("projects")
    .insert(newProject, "id")
    .then(projects => {
      res.status(200).json({ id: projects[0] });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// POST new palette
app.post("/api/v1/projects/:id/palettes", (req, res) => {
  const newPalette = req.body;
  for (let requiredParams of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!newPalette[requiredParams]) {
      return res.status(422).send({
        error: `Expected format: { name: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string> }`
      })
    }
  }
  database("projects").where('id', req.params.id).select()
    .then(project => {
      if(!project) {
        return res.status(422).json({
          error: `No project at id ${req.params.id} was found. Please check id in url, or post new project before adding this palette`
        })
      }
    })
    .then(() => {
      database('palettes').insert({...newPalette, project_id: req.params.id},   'id')
        .then(palette => {
          res.status(201).json({id: palette[0]})
        })
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// PUT a project (change name)
app.put("/api/v1/projects/:id", (req, res) => {
  const updatedProject = req.body
  if (!updatedProject.name) {
    return res.status(422).send({
      error: `Valid name entry required`
    })
  }
  let found = false;
  database('projects').select()
    .then(projects => {
      projects.forEach(project => {
        if (project.id === parseInt(req.params.id)) {
          found = true
        }
      })
      if(!found) {
        return res.status(404).json({
          error: `No project at id ${req.params.id} found`
        })
      } else {
        database('projects').where('id', req.params.id).update({
          name: updatedProject.name,
        })
        .then(project => {
          res.status(202).json(
            `Project ID ${req.params.id} has been updated`
          )
        })
      }
    })
    .catch(() => {
      res.status(500).json({ error });
    });
});
  
// PUT a palette (change name or colors)
app.put("/api/v1/palettes/:id", (req, res) => {
  const updatedPalette = req.body
  for (let requiredParams of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!updatedPalette[requiredParams]) {
      return res.status(422).send({
        error: `Expected format: { name: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string> }`
      })
    }
  }
  let found = false;
  database('palettes').select()
    .then(palettes => {
      palettes.forEach(palette=> {
        if (palette.id === parseInt(req.params.id)) {
          found = true
        }
      })
      if(!found) {
        return res.status(404).json({
          error: `No palette at id ${req.params.id} found`
        })
      } else {
        database('palettes').where('id', req.params.id).update({
          name: updatedPalette.name,
          color1: updatedPalette.color1,
          color2: updatedPalette.color2,
          color3: updatedPalette.color3,
          color4: updatedPalette.color4,
          color5: updatedPalette.color5,
        })
        .then(palette=> {
          res.status(202).json(
            `Palette ID ${req.params.id} has been updated`
          )
        })
      }
    })
    .catch(() => {
      res.status(500).json({ error });
    });
});


// DELETE project and all associated palettes
app.delete('/api/v1/projects/:id', (request, response) => {
  let found = false;
  database('projects').select()
    .then(projects => {
      projects.forEach(project => {
        if (project.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Project at id ${request.params.id} was not found`
        });
      } else {
        database('palettes').where('project_id', request.params.id).del()
          .then(() => {
            database('projects').where('id', request.params.id).del()
              .then(() => {
                response.status(202).json(
                  `Successful deletion of project id ${request.params.id} and all associated palettes`
                );
              });
          });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// DELETE a palette
app.delete('/api/v1/palettes/:id', (request, response) => {
  let found = false;
  database('palettes').select()
    .then(palettes => {
      palettes.forEach(palette => {
        if (palette.id === parseInt(request.params.id)) {
          found = true;
        }
      });
      if(!found) {
        return response.status(404).json({ 
          error: `Palette at id ${request.params.id} was not found`
        });
      } else {
        database('palettes').where('id', request.params.id).del()
          .then(() => {
            response.status(202).json(
              `Successful deletion of palette id ${request.params.id}`
            );
          });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


module.exports = app