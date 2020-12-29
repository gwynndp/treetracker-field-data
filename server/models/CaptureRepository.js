class CaptureRepository {

    constructor(impl) {
        this.impl = impl;
    }

    async saveCapture(capture) {
        return await this.impl.saveCapture(capture);
    }
}

module.exports = { CaptureRepository };