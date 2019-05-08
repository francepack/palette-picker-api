const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
import request from 'supertest'
import app from './app'
import projects from './projects'


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
