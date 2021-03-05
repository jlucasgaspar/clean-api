import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'

let accountCollection: Collection

describe('Auth Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
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
        test('should return 200 on login success', async () => {
            const password = await hash('valid_password', 12) // salt = 12

            await accountCollection.insertOne({
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: password
            })

            await request(app)
                .post('/api/login')
                .send({
                    email: 'valid_email@mail.com',
                    password: 'valid_password' // A rota vai descriptografar
                })
                .expect(200)
        });

        test('should return 401 if account does not exist', async () => {
            /* const password = await hash('valid_password', 12) // salt = 12

            await accountCollection.insertOne({
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: password
            }) */

            await request(app)
                .post('/api/login')
                .send({
                    email: 'valid_email@mail.com',
                    password: 'valid_password'
                })
                .expect(401)
        });
    });
})