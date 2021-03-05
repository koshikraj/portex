const UserRegistration = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'RegisterUser',
    type: 'object',
    properties: {
        _id: {type:'string'},
        did: {type:'string'},
        name: {type: 'string'},
        email: {type: 'string'},
        sharedWith: {type:'array'},     // contains user with whom data is shared
        requests: {type:'array'},       // contains all incoming requests
        sharedData: {type:'array'},     // contains all shared portfolios
        requested: {type:'array'},      // contains all outgoing requests
        aesKey: {type:'object'}
    },
}

module.exports = UserRegistration
