import { storage, logging } from "near-sdk-as";

export function setResponse(apiResponse: string): void {
  logging.log("Writing the string [ " + apiResponse + " ] to the blockchain ...");
  storage.setString("response", apiResponse);
}

export function getResponse(): string {
  logging.log("Reading a string from the blockchain ...");
  let result = storage.getString("response");

  if(result) {
    return result;
  }

  return "";
}