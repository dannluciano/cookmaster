const assert = require('assert/strict');
const { FakeRes } = require('../test_utils');
const dbHandler = require('../db_utils');
const { createUser } = require('../../users/user_controller');


describe('User Controller', () => {

    before(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    after(async () => await dbHandler.closeDatabase());

    describe('#createUser', () => {
        it('Without data', async () => {
            const fakeReq = {
                body: {
                },
            }
            const fakeRes = new FakeRes()

            await createUser(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 400)
            assert.equal(fakeRes.body.message, 'Invalid entries. Try again.')
        })

        it('With Valid data', async () => {
            const fakeReq = {
                body: {
                    name: 'Dann Luciano',
                    email: 'dannluciano@betrybe.com',
                    password: '12345678',
                },
            }
            const fakeRes = new FakeRes()

            await createUser(fakeReq, fakeRes)

            assert.equal(fakeRes.status(), 201)
            assert.equal(fakeRes.body.user.name, 'Dann Luciano')
        })

        it('With Valid data twice', async () => {
            const fakeReq = {
                body: {
                    name: 'Dann Luciano',
                    email: 'dannluciano@betrybe.com',
                    password: '12345678',
                },
            }
            const fakeRes1 = new FakeRes()
            const fakeRes2 = new FakeRes()
            await createUser(fakeReq, fakeRes1)
            await createUser(fakeReq, fakeRes2)

            assert.equal(fakeRes1.status(), 201)
            assert.equal(fakeRes1.body.user.name, 'Dann Luciano')

            assert.equal(fakeRes2.status(), 409)
            assert.equal(fakeRes2.body.message, 'Email already registered')
        })


    })
})