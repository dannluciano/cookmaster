const assert = require('assert/strict');
const frisby = require('frisby');
const mongoose = require('mongoose');
const dbHandler = require('../db_utils');

describe('3 - Crie um endpoint para o cadastro de receitas', () => {

    const url = 'http://localhost:3000'

    before(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    after(async () => await dbHandler.closeDatabase());

    beforeEach(async () => {
        await dbHandler.connect()
        const users = [
            { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
            {
                name: 'Erick Jacquin',
                email: 'erickjacquin@gmail.com',
                password: '12345678',
                role: 'user',
            },
            {
                name: 'Dann Luciano',
                email: 'dannluciano@gmail.com',
                password: '12345678',
                role: 'user',
            },
        ];
        await mongoose.connection.collection('users').insertMany(users)
    })

    it('Será validado que não é possível editar receita estando autenticado sem ser o dono da receita ou admin', async () => {
        let recipeId;
        const erickLoginData = {
            email: 'erickjacquin@gmail.com',
            password: '12345678',
        }
        const dannLoginData = {
            email: 'dannluciano@gmail.com',
            password: '12345678',
        }
        // Login in Erick
        await frisby
            .post(`${url}/login/`, erickLoginData)
            .expect('status', 200)
            .then((erikLoginResponse) => {
                const result = JSON.parse(erikLoginResponse.body);
                return frisby
                    .setup({
                        request: {
                            headers: {
                                Authorization: result.token,
                                'Content-Type': 'application/json',
                            },
                        },
                    })
                    // Create Recipe
                    .post(`${url}/recipes`, {
                        name: 'banana caramelizada',
                        ingredients: 'banana, açúcar',
                        preparation: 'coloque o açúcar na frigideira até virar caramelo e jogue a banana',
                    })
                    .expect('status', 201)
                    .then((recipeResponse) => {
                        const { recipe } = JSON.parse(recipeResponse.body);
                        recipeId = recipe._id
                    });
            });
        // Login in Dann
        await frisby
            .post(`${url}/login/`, dannLoginData)
            .expect('status', 200)
            .then((dannLoginResponse) => {
                const result = JSON.parse(dannLoginResponse.body);
                return frisby
                    .setup({
                        request: {
                            headers: {
                                Authorization: result.token,
                                'Content-Type': 'application/json',
                            },
                        },
                    })
                    // Try Update Recipe
                    .put(`${url}/recipes/${recipeId}`, {
                        name: 'banana caramelizada do Dann',
                    })
                    .expect('status', 401)
                    .then((updateResponse) => {
                        const updateResult = JSON.parse(updateResponse.body);
                        assert(updateResult.message === 'permission denied');
                    });
            });
    });
});