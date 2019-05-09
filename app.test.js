const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
import request from 'supertest'
import app from './app'
import projects from './TestData/projects'
import palettes from './TestData/palettes'

describe('/api/v1', () => {

  beforeEach(async () => {
    await database.seed.run()
  })

  describe('GET /projects', () => {
    it('should return all the projects in the DB', async ()=> {
      const expectedProjects = await database('projects').select()
      const res = await request(app).get('/api/v1/projects')
      const result = res.body
      expect(result.length).toEqual(expectedProjects.length)
    })
  })

  describe('GET/ projects/:id', () => {
    it('should return a single project', async () => {
      const expectedProject = await database('projects').first()
      const id = expectedProject.id
      const res = await request(app).get(`/api/v1/projects/${id}`)
      const result = res.body[0]
      expect(result.name).toBe(expectedProject.name)
    })
  })

  describe('GET/ projects/:id sad path', () => {
    it('should return a 404 error if an id is not found', async () => {
      const id = 6546
      const res = await request(app).get(`/api/v1/projects/${id}`)
      expect(res.status).toBe(404)
    })
    it('should return a 500 error if id in url is incorrect format, causing server error', async () => {
      const id = 'ProjectName'
      const res = await request(app).get(`/api/v1/projects/${id}`)
      expect(res.status).toBe(500)
    })
  })

  describe('GET /palettes', () => {
    it('should return all the palettes in the DB', async ()=> {
      const expectedPalettes = await database('palettes').select()
      const res = await request(app).get('/api/v1/palettes')
      const result = res.body
      expect(result.length).toEqual(expectedPalettes.length)
    })
  })

  describe('GET/ palettes/:id', () => {
    it('should return a single project', async () => {
      const expectedPalette = await database('palettes').first()
      const id = expectedPalette.id
      const res = await request(app).get(`/api/v1/palettes/${id}`)
      const result = res.body[0]
      expect(result.name).toBe(expectedPalette.name)
    })
  })

  describe('GET /palettes/:id sad path', () => {
    it('should return a 404 error if an id is not found', async () => {
      const id = 47876
      const res = await request(app).get(`/api/v1/palettes/${id}`)
      expect(res.status).toBe(404)
    })
    it('should return a 500 error if id in url is incorrect format, causing server error', async () => {
      const id = 'PaletteName'
      const res = await request(app).get(`/api/v1/palettes/${id}`)
      expect(res.status).toBe(500)
    })
  })

  describe('GET /projects/:id/palettes', () => {
    it('should get all palettes of a certain project', async () => {
      const exampleProject = await database('projects').first()
      const id = exampleProject.id
      const expectedPalettes = await database('palettes').where('project_id', id).select()
      const res = await request(app).get(`/api/v1/projects/${id}/palettes`)
      const result = res.body
      expect(result.length).toEqual(expectedPalettes.length)
    })
  })

  describe('GET /projects/:id/palettes sad path', () => {
    it('should return 404 status if project is not found', async () => {
      const id = 54325
      const res = await request(app).get(`/api/v1/projects/${id}/palettes`)
      expect(res.status).toBe(404)
    })
    it('should return a 500 error if id in url is incorrect format, causing server error', async () => {
      const id = 'ProjectName'
      const res = await request(app).get(`/api/v1/projects/${id}/palettes`)
      expect(res.status).toBe(500)
    })
  })

  describe('POST /projects', () => {
    it('should post a new project to the db', async () => {
      const newProject = { name: 'Will' }
      const res = await request(app)
        .post('/api/v1/projects')
        .send(newProject)
      const projects = await database('projects').where('id', res.body.id).select()
      const project = projects[0]
      expect(res.status).toBe(200)
      expect(project.name).toEqual(newProject.name)
    })
  })

  describe('POST /projects sad path', () => {
    it('should return a 422 error when incorrect request format used', async () => {
      const invalidProject = { wrongKey: 'Will' }
      const res = await request(app)
        .post('/api/v1/projects')
        .send(invalidProject)
      // const projects = await database('projects').where('id', res.body.id).select()
      // const project = projects[0]
      expect(res.status).toBe(422)
    })
  })

  describe('POST /projects/:id/palettes', () => {
    it('should post a new palette to the db', async () => {
      const project = await database('projects').first()
      const id = project.id
      const newPalette = {
        name: "1",
        color1: 'test',
        color2: 'test',
        color3: 'test',
        color4: 'test',
        color5: 'test',
      }
      const res = await request(app)
        .post(`/api/v1/projects/${id}/palettes`)
        .send(newPalette)
      const palettes = await database('palettes').where('id', res.body.id).select()
      const palette = palettes[0]
      expect(res.status).toBe(201)
      expect(palette.name).toEqual(newPalette.name)
    })
  })

  describe('POST /project/:id/palettes sad path', () => {
    it('should return a 422 error when incorrect request format used', async () => {
      const invalidPalette = { wrongKey: 'Will', missingkeys: 'yes' }
      const exampleProject = await database('projects').first()
      const id = exampleProject.id
      const res = await request(app)
        .post(`/api/v1/projects/${id}/palettes`)
        .send(invalidPalette)
      // const palettes = await database('palettes').where('id', 64).select()
      // const palette = palettes[0]
      expect(res.status).toBe(422)
    })
    it('should return a 422 error when incorrect project id is used', async () => {
      const validPalette = { name: 'Cool colors', color1: 'red', color2: 'yellow', color3: 'blue', color4: 'purple', color5: 'magenta' }
      const invalidProjectId = 4239874
      const res = await request(app)
        .post(`/api/v1/projects/${invalidProjectId}/palettes`)
        .send(validPalette)
      // const palettes = await database('palettes').where('id', 64).select()
      // const palette = palettes[0]
      expect(res.status).toBe(422)
    })
    it('should return a 500 error if id in url is incorrect format, causing server error', async () => {
      const validPalette = { name: 'Cool colors', color1: 'red', color2: 'yellow', color3: 'blue', color4: 'purple', color5: 'magenta' }
      const id = 'notNumber'
      const res = await request(app)
        .post(`/api/v1/projects/${id}/palettes`)
        .send(validPalette)
        expect(res.status).toBe(500)
    })
  })

  describe('PUT /projects/:id', () => {
    it('should rename an existing project, keeping same id', () => {

    })
  })

  describe('PUT /projects/:id sad path', () => {
    
  })

  describe('PUT /palettes/:id', () => {
    it('should revise an existing palette, keeping same id', () => {
      
    })
  })

  describe('PUT /palettes/:id sad path', () => {
    
  })







  describe('DELETE /projects/:id', () => {
    it('should delete a single project', async () => {
      const expectedProject = await database('projects').first()
      const firstId = expectedProject.id
      const res = await request(app).del(`/api/v1/projects/${firstId}`)
      const newProjects = await database('projects').first()
      const newFirstId = newProjects.id
      expect(res.status).toEqual(202)
      expect(newFirstId).not.toEqual(firstId)
    })
    it('should delete any palettes associated with a project', () => {

    })
  })

  describe('DELETE /projects/:id sad path', () => {
    it('should return a 404 error if project to be deleted is not found', async () => {
      const id = 53254543
      const res = await request(app).del(`/api/v1/projects/${id}`)
      expect(res.status).toEqual(404)
    })
    it('should return a 500 error ?', async () => {
      
    })
  })


  describe('DELETE /palettes/:id', () => {
    it('should delete a single palette', async () => {
      const expectedPalette = await database('palettes').first()
      const firstId = expectedPalette.id
      const res = await request(app).del(`/api/v1/palettes/${firstId}`)
      const newPalettes = await database('palettes').first()
      const newFirstId = newPalettes.id
      expect(res.status).toEqual(202)
      expect(newFirstId).not.toEqual(firstId)
    })
  })

  describe('DELETE /palettes/:id sad path', () => {
    it('should return a 404 error if palette to be deleted is not found', async () => {
      const id = 456234444
      const res = await request(app).del(`/api/v1/palettes/${id}`)
      expect(res.status).toEqual(404)
    })
    it('should return a 500 error ?', async () => {
      
    })
  })
})


