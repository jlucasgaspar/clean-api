import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'

describe('Auth Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('POST/ signup', () => {
        test('Should return 200 on signup success', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'valid_name',
                    email: 'valid_email@mail.com',
                    password: 'valid_password',
                    passwordConfirmation: 'valid_password'
                })
                .expect(200)
        })
    });
    
    describe('POST/ login', () => {
        test('should ', () => {
            
        });
    });
})