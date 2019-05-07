const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)


app.locals.title = 'picker';

app.use(bodyParser.json())

// GET projects
app.get("/api/v1/projects", (request, response) => {
database("projects")
  .select()
  .then((projects) => {
    response.status(200).json(projects);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// GET palettes
app.get("/api/v1/palettes", (request, response) => {
  database("palettes")
    .select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
  });

// GET a project
app.get("/api/v1/projects/:id", (request, response) => {
  database("projects")
    .where("id", request.params.id)
    .select()
    .then((student) => {
      response.status(200).json(student);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
  });

// GET a palette
  app.get("/api/v1/palettes/:id", (request, response) => {
    database("palettes")
      .where("id", request.params.id)
      .select()
      .then((student) => {
        response.status(200).json(student);
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
    });

// POST new project
  app.post("/api/v1/projects", (req, res) => {
  const newProject = req.body;
  console.log(newProject)
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

app.delete("/api/v1/projects/:id", (req, res) => {
database("projects")
  .where("id", req.params.id)
  .del()
  .then(() => {
    res.status(204).send("student was deleted.")
  })
  .catch(error => {
    res.status(500).json({ error: "student not found" });
  });
});


app.put("/api/v1/projects/:id", (req, res) => {
  const updatedStudent = req.body
  database("projects")
    .where("id", req.params.id)
    .insert(updatedStudent, "id")
    .then(() => {
      res.status(204).send("student was updated.")
    })
    .catch(() => {
      res.status(500).json({ error: "student not found" });
    });
  });
  

module.exports = app