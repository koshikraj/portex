import Ceramic from '@ceramicnetwork/http-client'
import {IDX} from '@ceramicstudio/idx'
import {Ed25519Provider} from 'key-did-provider-ed25519'
import {definitions} from "../utils/config.json"

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