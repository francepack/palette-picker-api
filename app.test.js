const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
import request from 'supertest'
import app from './app'

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
      expect(res.status).toBe(422)
    })
    it('should return a 422 error when incorrect project id is used', async () => {
      const validPalette = { name: 'Cool colors', color1: 'red', color2: 'yellow', color3: 'blue', color4: 'purple', color5: 'magenta' }
      const invalidProjectId = 4239874
      const res = await request(app)
        .post(`/api/v1/projects/${invalidProjectId}/palettes`)
        .send(validPalette)
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
    it('should rename an existing project, keeping same id', async () => {
      const exampleProject = await database('projects').first()
      const projectId = exampleProject.id
      const updateRequest = { name: 'NewName' }
      const res = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .send(updateRequest)
      const result = res.body
      expect(res.status).toBe(202)
      expect(result).toEqual(`Project ID ${projectId} has been updated`)
      // is there way to test updated name? Finalize this logic
      const newName = await database('projects').first()
      expect(newName.name).toBe('NewName')
    })
  })

  describe('PUT /projects/:id sad path', () => {
    it('should return 404 error if no project is found at given id', async () => {
      const id = 'invalidId'
      const validUpdateRequest = { name: 'New Name' }
      const res = await request(app)
        .put(`/api/v1/projects/${id}`)
        .send(validUpdateRequest)
      expect(res.status).toBe(404)
    })
    it('should return a 422 error when incorrect request format used', async () => {
      const exampleProject = await database('projects').first()
      const projectId = exampleProject.id
      const updateRequest = { wrongKey: 'Yup' }
      const res = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .send(updateRequest)
      expect(res.status).toBe(422)
    })
  })

  describe('PUT /palettes/:id', () => {
    it('should revise an existing palette, keeping same id', async () => {
      const examplePalette = await database('palettes').first()
      const paletteId = examplePalette.id
      const updateRequest = { name: 'NewName', color1: 'grey', color2: 'red', color3: 'gold', color4: 'silver', color5: 'brown' }
      const res = await request(app)
        .put(`/api/v1/palettes/${paletteId}`)
        .send(updateRequest)
      const result = res.body
      expect(res.status).toBe(202)
      expect(result).toEqual(`Palette ID ${paletteId} has been updated`)
      // is there way to test updated name? Finalize this logic
      const newName = await database('palettes').first()
      expect(newName.name).toBe('NewName')
    })
  })

  describe('PUT /palettes/:id sad path', () => {
    it('should return 404 error if no palette is found at given id', async () => {
      const id = 'invalidId'
      const validUpdateRequest = { name: 'New Name', color1: 'white', color2: 'gold', color3: 'pink', color4: 'black', color5: 'red' }
      const res = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(validUpdateRequest)
      expect(res.status).toBe(404)
    })
    it('should return a 422 error when incorrect request format used', async () => {
      const examplePalette = await database('palettes').first()
      const paletteId = examplePalette.id
      const updateRequest = { wrongKey: 'Yup', missingKeys: 'indeed' }
      const res = await request(app)
        .put(`/api/v1/projects/${paletteId}`)
        .send(updateRequest)
      expect(res.status).toBe(422)
    })
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
    it('should delete any palettes associated with a project', async () => {
      const palettes = await database('palettes').select()
      const exampleProject = await database('projects').first()
      const projectId = exampleProject.id
      const res = await request(app).del(`/api/v1/projects/${projectId}`)
      const newPalettes = await database('palettes').select()
      expect(newPalettes.length).toBeLessThan(palettes.length)
    })
  })

  describe('DELETE /projects/:id sad path', () => {
    it('should return a 404 error if project to be deleted is not found', async () => {
      const id = 53254543
      const res = await request(app).del(`/api/v1/projects/${id}`)
      expect(res.status).toEqual(404)
    })
    // it('should return a 500 error ?', async () => {
      
    // })
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
    // it('should return a 500 error ?', async () => {
      
    // })
  })
})


