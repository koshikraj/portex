const DocumentStorage = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Document',
    type: 'object',
    properties: {
        _id: {type:'string'},
        createdBy: { type:'object'},
        title: {type:'string'},
        documentHash : {type: 'string'},
        fileLocation: {type: 'string'},
        fileName: {type: 'string'},
        signatureId: {type:'string'},
        key: {
            type: 'array',
            items :{
                type: 'object',
                properties:{
                    address: {type: 'string'},
                    cipherKey: {type:'string'}
                }
            }
        }
    },
}

module.exports = DocumentStorage