const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

app.locals.title = "picker";

// Response Success functions
const send200 = (res, message) => res.status(200).json(message);
const send201 = (res, message) => res.status(201).json(message);
const send202 = (res, message) => res.status(202).json(message);
const send204 = (res, message) => res.status(204).send(message);

// Response Error functions
const send404 = (res, message) => res.status(404).json(message);
const send422 = (res, message) => res.status(422).json(message);
const send500 = (res, message) => res.status(500).json(message);

// Home route
app.get("/", (req, res) => send200(res, 'Palette Picker- please see documentation for use'));

// GET projects
app.get("/api/v1/projects", (req, res) => {
  database("projects")
    .select()
    .then((projects) => {
      send200(res, projects);
    })
    .catch((error) => {
      send500(res, error.message);
    });
});

// GET palettes (optional query: palette name)
app.get("/api/v1/palettes", (req, res) => {
  var name = req.query.name;
  database("palettes")
    .select()
    .then((palettes) => {
      if (name) {
        const paletteByName = palettes.find(palette => name === palette.name)
        if (paletteByName) {
          send200(res, paletteByName)
        } else {
          send422(res, `Palette with name ${name} does not exist`)
        }
      }
      send200(res, palettes);
    })
    .catch((error) => {
      send500(res, error.message);
    });
});

// GET a project
app.get("/api/v1/projects/:id", (req, res) => {
  database("projects")
    .where("id", req.params.id)
    .select()
    .then((project) => {
      if (project.length) {
        send200(res, project);
      } else {
        send404(res, `Project with id ${req.params.id} not found`);
      }
    })
    .catch((error) => {
      send500(res, error.message);
    });
});

// GET a palette
app.get("/api/v1/palettes/:id", (req, res) => {
  database("palettes")
    .where("id", req.params.id)
    .select()
    .then((palette) => {
      if (palette.length) {
        send200(res, palette);
      } else {
        send404(res, `Palette with id ${req.params.id} not found`);
      }
    })
    .catch((error) => {
      send500(res, error.message);
    });
});

// GET all palettes of a project
app.get("/api/v1/projects/:id/palettes", (req, res) => {
  database("palettes").where("project_id", req.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        send200(res, palettes);
      } else {
        send404(res, `Could not find palettess for project with id ${req.params.id}`);
      }
    })
    .catch(error => {
      send500(res, error.message);
    });
});

// POST new project
app.post("/api/v1/projects", (req, res) => {
  const newProject = req.body;
  if (!newProject.name) {
    send422(res, `Expected format: { name: <string> }`);
  }
  database("projects")
    .insert(newProject, "id")
    .then(projects => {
      send201(res, { id: projects[0] });
    })
    .catch(error => {
      send500(res, error.message);
    });
});

// POST new palette
app.post("/api/v1/projects/:id/palettes", (req, res) => {
  const newPalette = req.body;
  for (let requiredParams of ["name", "color1", "color2", "color3", "color4", "color5"]) {
    if (!newPalette[requiredParams]) {
      send422(res, `Expected format: { name: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string> }`);
    }
  }
  database("projects").where("id", req.params.id).select()
    .then(project => {
      if(!project.length) {
        send422(res, `No project at id ${req.params.id} was found. Please check id in url, or post new project before adding this palette`);
      }
    })
    .then(() => {
      database("palettes").insert({...newPalette, project_id: req.params.id},   "id")
        .then(palette => {
          send201(res, {id: palette[0]});
        })
    })
    .catch(error => {
      send500(res, error.message);
    });
});

// PUT a project (change name)
app.put("/api/v1/projects/:id", (req, res) => {
  const updatedProject = req.body
  if (!updatedProject.name) {
    send422(res, `Valid name entry required: Expected format: { name: <string> }`);
  }
  let found = false;
  database("projects").select()
    .then(projects => {
      projects.forEach(project => {
        if (project.id === parseInt(req.params.id)) {
          found = true
        }
      })
      if(!found) {
        send404(res, `No project at id ${req.params.id} found`);
      } else {
        database("projects").where("id", req.params.id).update({
          name: updatedProject.name,
        })
        .then(project => {
          send202(res, `Project ID ${req.params.id} has been updated`);
        })
      }
    })
    .catch(() => {
      send500(res, error.message);
    });
});
  
// PUT a palette (change name or colors)
app.put("/api/v1/palettes/:id", (req, res) => {
  const updatedPalette = req.body
  for (let requiredParams of ["name", "color1", "color2", "color3", "color4", "color5"]) {
    if (!updatedPalette[requiredParams]) {
      send422(res, `Expected format: { name: <string>, color1: <string>, color2: <string>, color3: <string>, color4: <string>, color5: <string> }`);
    }
  }
  let found = false;
  database("palettes").select()
    .then(palettes => {
      palettes.forEach(palette=> {
        if (palette.id === parseInt(req.params.id)) {
          found = true
        }
      })
      if(!found) {
        send404(res, `No palette at id ${req.params.id} found`);
      } else {
        database("palettes").where("id", req.params.id).update({
          name: updatedPalette.name,
          color1: updatedPalette.color1,
          color2: updatedPalette.color2,
          color3: updatedPalette.color3,
          color4: updatedPalette.color4,
          color5: updatedPalette.color5,
        })
        .then(palette=> {
          send202(res, `Palette ID ${req.params.id} has been updated`);
        })
      }
    })
    .catch(() => {
      send500(res, error.message);
    });
});

// DELETE project and all associated palettes
app.delete("/api/v1/projects/:id", (req, res) => {
  let found = false;
  database("projects").select()
    .then(projects => {
      projects.forEach(project => {
        if (project.id === parseInt(req.params.id)) {
          found = true;
        }
      });
      if(!found) {
        send404(res, `Project at id ${req.params.id} was not found`);
      } else {
        database("palettes").where("project_id", req.params.id).del()
          .then(() => {
            database("projects").where("id", req.params.id).del()
              .then(() => {
                send204(res, `Successful deletion of project id ${req.params.id} and all associated palettes`);
              });
          });
      }
    })
    .catch(error => {
      send500(res, error.message);
    });
});

// DELETE a palette
app.delete("/api/v1/palettes/:id", (req, res) => {
  let found = false;
  database("palettes").select()
    .then(palettes => {
      palettes.forEach(palette => {
        if (palette.id === parseInt(req.params.id)) {
          found = true;
        }
      });
      if(!found) {
        send404(res, `Palette at id ${req.params.id} was not found`);
      } else {
        database("palettes").where("id", req.params.id).del()
          .then(() => {
            send204(res, `Successful deletion of palette id ${req.params.id}`);
          });
      }
    })
    .catch(error => {
      send500(res, error.message);
    });
});

module.exports = app;