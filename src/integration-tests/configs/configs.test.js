const assert = require('assert');
const { DB_NAME, UPLOAD_DIR} = require('../../configs');

describe('Test das Configurações', () => {
    
    it('Nome do banco de dados é Cookmaster', () => {
        const expected = 'Cookmaster'
        const computed = DB_NAME
        assert.ok(computed === expected)
    })
})