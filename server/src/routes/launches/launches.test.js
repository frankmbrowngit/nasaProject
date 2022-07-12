const request = require('supertest');
const app = require('../../app.js'); // requiring the express server
const { mongooseConnect, mongooseDisconnect } = require('../../services/mongo.js');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongooseConnect();
    });
    afterAll (async () => {
        await mongooseDisconnect();
    })
    describe("Test GET /launches", () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type',/json/)
            .expect(200);
        })
    });
    
    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: "ZTM15565",
            rocket: "ZTM Experimental IS156",
            target: "Kepler-62 f",
            launchDate: "January 17, 2030"
        };
        const launchDataWithoutDate = {
            mission: "ZTM15565",
            rocket: "ZTM Experimental IS156",
            target: "Kepler-62 f"
        };
        test('It should respond with 201 success', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        })
        test('It should catch missing required properties', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type',/json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({ 
                error: 'Missing required launch property'
            })
        })
        test('It should catch required properties',async () => {
            launchDataWithoutDate.launchDate = "zoot";
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type',/json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid date'
            })
    
        })
    });

})

