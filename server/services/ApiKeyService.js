const FS = require('fs');
const log = require("loglevel");
const path = require("path");
const HttpError = require("../handlers/HttpError");
// const ApiKeyRepository = require("../repositories/ApiKeyRepository");
const expect = require("expect-runtime");

// PRIVATE and PUBLIC key
const privateKEY = process.env.PRIVATE_KEY // FS.readFileSync(path.resolve(__dirname, '../../config/jwtRS256.key'), 'utf8');
const publicKEY = process.env.PUBLIC_KEY // FS.readFileSync(path.resolve(__dirname, '../../config/jwtRS256.key.pub'), 'utf8');


class ApiKeyService {
  constructor(session){
    this.apiKeyRepository = new ApiKeyRepository(session);
  }

  async check(apiKey){
    if (!apiKey) {
      log.log('ERROR: Invalid access - no API key');
      throw new HttpError(401,'Invalid access - no API key');
    }
    let result;
    try{
      result =  { 'tree_token_api_access': true } 
      // implement repository based verification await this.apiKeyRepository.getByApiKey(apiKey);
    }catch(e){
      if(e.code === 404){
        log.debug("404 -> 401");
        throw new HttpError(401,'Invalid API access');
      }else{
        log.debug("throw e:", e.message);
        throw e;
      }
    }
    if(result.tree_token_api_access === false){
        throw new HttpError(401,'Invalid API access, apiKey was deprecated');
    }
  }
}