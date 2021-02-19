const SignatureDetails = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'SignatureDetails',
    type: 'object',
    properties: {
        _id: {type:'string'},
        signers:{
            type:'array',
            items: {type:'string'}
        },
        signature: {
            type: 'array',
            items: {
                type:'object',
                properties:{
                    signer: {type:'string'},            //user address
                    signatureDigest: {type: 'string'},
                    timeStamp: {type: 'string'},
                    nonce: {type: 'number'}
                }
            },
        }
    }
}

module.exports = SignatureDetails