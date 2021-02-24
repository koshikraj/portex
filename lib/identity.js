import Ceramic from '@ceramicnetwork/http-client'
import {IDX} from '@ceramicstudio/idx'
import {Ed25519Provider} from 'key-did-provider-ed25519'
import {definitions} from "../utils/config.json"
import { BigNumber, utils, ethers } from 'ethers'
import { hashSync } from 'bcryptjs'

const CERAMIC_URL = 'https://ceramic.signchain.xyz'


export const generateIDX = async (seed) => {
    // avoid sending the raw secret by hashing it first
    try{
      if(seed){
        const ceramic = new Ceramic(CERAMIC_URL)
        await ceramic.setDIDProvider(new Ed25519Provider(seed))
        // Create the IDX instance with the definitions aliases from the config
        const idx = new IDX({ ceramic, aliases: definitions })
        return {idx, ceramic}
      }else{
        return {idx: null, ceramic: null}
      }
    }catch(error){
        console.log(error)
        return {idx: null, ceramic: null}
    }

  }


  const generateMessageForEntropy = (ethereum_address, application_name) => {
    return (
      '******************************************************************************** \n' +
      'READ THIS MESSAGE CAREFULLY. \n' +
      'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
      'ACCESS TO THIS APPLICATION. \n' +
      'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
      'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
      '******************************************************************************** \n' +
      'The Ethereum address used by this application is: \n' +
      '\n' +
      ethereum_address +
      '\n' +
      '\n' +
      '\n' +
      'By signing this message, you authorize the current application to use the \n' +
      'following app associated with the above address: \n' +
      '\n' +
      application_name +
      '\n' +
      '\n' +
      '\n' +
      'The hash of your non-recoverable, private, non-persisted password or secret \n' +
      'phrase is: \n' +
      '\n' +
      '\n' +
      '\n' +
      '\n' +
      '******************************************************************************** \n' +
      'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
      'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
      'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
      'WRITE ACCESS TO THIS APPLICATION. \n' +
      '******************************************************************************** \n'
    );
  }

  export const generateIDXForMagic = async (provider) => {
    // avoid sending the raw secret by hashing it first
    try{
      if(provider){
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const message = generateMessageForEntropy(userAddress, 'Portex')
        const signedText = await signer.signMessage(message);
        const hash = utils.keccak256(signedText);
        const seed = hash
          // @ts-ignore
          .replace('0x', '')
          // @ts-ignore
          .match(/.{2}/g)
          .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())
        const ceramic = new Ceramic(CERAMIC_URL)
        await ceramic.setDIDProvider(new Ed25519Provider(seed))
        // Create the IDX instance with the definitions aliases from the config
        const idx = new IDX({ ceramic, aliases: definitions })
        console.log(idx);
        return {idx, ceramic, seed}
      }else{
        return {idx: null, ceramic: null, seed: null}
      }
      
    }catch(error){
        console.log(error)
        return {idx: null, ceramic: null, seed: null}
    }

  }
