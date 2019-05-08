const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
import request from 'supertest'
import app from './app'
import projects from './projects'
import palettes from './palettes'

beforeEach(async () => {
  await database.seed.run()
})

describe('GET /projects', () => {
  it('should return all the projects in the DB', async ()=> {
    const expectedProjects = projects.length
    const res = await request(app).get('/api/v1/projects')
    const result = res.body
    expect(result.length).toEqual(expectedProjects)
  })
})

describe('GET/ projects/:id', () => {
  it('should return a single project', async () => {
    const expectedProject = await database('projects').first()
    const id = expectedProject.id
    const res = await request(app).get(`/api/v1/projects/${id}`)
    const result = res.body[0]
    expect(result.id).toBe(expectedProject.id)
    })
})

describe('GET/ projects/:id sad path', () => {
  it('should return a single project', async () => {
    const id = 'Q'
    const res = await request(app).get(`/api/v1/projects/${id}`)
    expect(res.status).toBe(500)
    })
})

describe('GET /palettes', () => {
  it('should return all the palettes in the DB', async ()=> {
    const expectedpalettes = palettes.length
    const res = await request(app).get('/api/v1/palettes')
    const result = res.body
    expect(result.length).toEqual(expectedpalettes)
  })
})

describe('GET/ palettes/:id', () => {
  it('should return a single project', async () => {
    const expectedPalette = await database('palettes').first()
    const id = expectedPalette.id
    const res = await request(app).get(`/api/v1/palettes/${id}`)
    const result = res.body[0]
    expect(result.id).toBe(expectedPalette.id)
    })
})

describe('GET/ palettes/:id sad path', () => {
  it('should return a single project', async () => {
    const id = 'Q'
    const res = await request(app).get(`/api/v1/palettes/${id}`)
    expect(res.status).toBe(500)
    })
})


describe('POST /projects', () => {
  it('should post a new project to the db', async () => {
    const newProject = { name: 'Will'}
    const res = await request(app)
                        .post('/api/v1/projects')
                        .send(newProject)
    const projects = await database('projects').where('id', res.body.id).select()
    const project = projects[0]
    expect(res.status).toBe(200)
    expect(project.name).toEqual(newProject.name)
  })
})

describe('POST /projects', () => {
  it('give an error code for the sad path', async () => {
    const res = await request(app)
                        .post('/api/v1/projects')
                        .send('newProject')
    const projects = await database('projects').where('id', 64).select()
    const project = projects[0]
    expect(res.status).toBe(422)
  })
})

describe('POST /palettes', () => {
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
                        console.log( await res.body)
    const palettes = await database('palettes').where('id', res.body.id).select()
    const palette = palettes[0]
    expect(res.status).toBe(201)
    expect(palette.name).toEqual(newPalette.name)
  })
})

describe('POST /palettes', () => {
  it('give an error code for the sad path', async () => {
    const res = await request(app)
                        .post('/api/v1/palettes')
                        .send('newPalette')
    const palettes = await database('palettes').where('id', 64).select()
    const palette = palettes[0]
    expect(res.status).toBe(404)
  })
})











describe('DELETE /projects/1', () => {
  it('should delete a single project', async () => {
    const expectedProject = await database('projects').first()
    const id = expectedProject.id
    const res = await request(app).del(`/api/v1/projects/${id}`)
    const result = res.body[0]
    expect(res.status).toEqual(202)
  })
})

describe('DELETE /projects/1', () => {
  it('should delete a single project', async () => {
    const id = 'G'
    const res = await request(app).del(`/api/v1/projects/${id}`)
    expect(res.status).toEqual(404)
  })
})

