class FakeRes {
    constructor() {
        this._status = 0
        this._body = ''
    }

    status(status) {
        if (status) {
            this._status = status
            return this
        }
        return this._status
    }

    get body() {
        return this._body
    }

    json(obj='') {
        this._body = obj
        return this
    }
}

module.exports = {
    FakeRes
}