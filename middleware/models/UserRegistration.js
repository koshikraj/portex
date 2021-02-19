const UserRegistration = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'RegisterUser',
    type: 'object',
    properties: {
        _id: {type:'string'},
        did: {type:'string'},
        name: {type: 'string'},
        email: {type: 'string'},
        address: { type: 'string'},
        publicKey: { type: 'string'},
        userType: { type: 'number'},
        nonce: {type:'number'},
        documentInfo: {
            type:'array',
            items: {
                type: 'object',
                properties: {
                    createdBy : {type: 'object'},
                    sharedTo: {type: 'string'},
                    date: {type: 'string' },
                    title: {type: 'string'},
                    fileName: {type:'string'},
                    documentId: {type:'string'},
                    signatureId: {type:'string'}
                }
            }
        }
    },
}

module.exports = UserRegistration
