const { writeFile } = require('fs').promises
const { randomBytes } = require('crypto')
const Ceramic = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')

const fromString = require('uint8arrays/from-string')

const CERAMIC_URL = 'https://ceramic.signchain.xyz'

const ProfileSchema = {
    "type": "object",
    "title": "Profile",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
      "name": {
        "type": "string",
        "title": "name",
        "maxLength": 150
      },
      "email": {
        "type": "string",
        "title": "email",
        "maxLength": 150
      }
    }
  }

  const EncryptionKeySchema = {
    doctype: 'object',
    title: 'Encryption Key',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      key: {
        type: 'object',
        title: 'key'
      }
    },
  }

const PortfolioSchema = {
    doctype: 'object',
    title: 'Portfolio List',
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      portfolio: {
        type: 'object',
        title: 'portfolio',
      },
    },
  };

async function run() {
  // The seed must be provided as an environment variable
  const seed = new Uint8Array(randomBytes(32))
  console.log("Created seed", seed)
  // Connect to the local Ceramic node
  const ceramic = new Ceramic(CERAMIC_URL)
  // Authenticate the Ceramic instance with the provider

  await ceramic.setDIDProvider(new Ed25519Provider(seed))

  // Publish the two schemas
  const [profile, encryptionKey, portfolio] = await Promise.all([
    publishSchema(ceramic, { content: ProfileSchema }),
    publishSchema(ceramic, {content: EncryptionKeySchema}),
    publishSchema(ceramic, { content: PortfolioSchema }),
  ])

  console.log("Profile Schema", profile)
  console.log("Portfolio Schema", portfolio)
  console.log("Encryption Schema", encryptionKey)


  // Create the definition using the created schema ID
  const profileDefinition = await createDefinition(ceramic, {
    name: 'Profile',
    description: 'Profile Schema',
    schema: profile.commitId.toUrl(),
  })

  const portfolioDefinition = await createDefinition(ceramic, {
    name: 'Portfolio',
    description: 'Portfolio Schema',
    schema: portfolio.commitId.toUrl(),
  })

  const encryptionDefinition = await createDefinition(ceramic, {
    name: 'Encryption',
    description: 'Encryption Schema',
    schema: encryptionKey.commitId.toUrl(),
  })

  // Write config to JSON file
  const config = {
    definitions: {
      profile: profileDefinition.id.toString(),
      portfolio: portfolioDefinition.id.toString(),
      encryptionKey: encryptionDefinition.id.toString()
    },
    schemas: {
      profile: profile.commitId.toUrl(),
      portfolio: portfolio.commitId.toUrl(),
      encryptionKey: encryptionKey.commitId.toUrl()
    },
  }
  await writeFile('./config.json', JSON.stringify(config))

  console.log('Config written to src/config.json file:', config)
  process.exit(0)
}

run().catch(console.error)