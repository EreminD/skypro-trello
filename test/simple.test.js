const { expect } = require("chai")
const axios = require('axios').default

describe('просто проверяем инсрументы', () => {
    it.skip('Mocha test', function() {
        expect(2+2).to.equal(4)
    })

    it.skip('Axios test', async () => {
        const url = "http://httpbin.org/get?arg1=test"


        const response = await axios.get(url)
        console.log(response.status)
        console.log(response.data)
    })
})