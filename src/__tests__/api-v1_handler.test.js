import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);

const apiV1Handler = require('../api-v1_handler');

describe('apiV1Handler', () => {


    beforeAll(()=>{
        MockAWS.mock("KMS", "decrypt", Promise.resolve({Plaintext:"{}"}));
        process.env.SECRETS="badSecret"
    })

    test('event_post()', done => {
        apiV1Handler.event_post({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()

            done();
        })
    });

});
