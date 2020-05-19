import "regenerator-runtime/runtime";

import * as nearAPI from "near-api-js"
import getConfig from "./config"

window.nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initializing contract
async function initContract() {
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

  // Initializing Wallet based Account. It can work with NEAR DevNet wallet that
  // is hosted at https://wallet.nearprotocol.com
  window.walletAccount = new nearAPI.WalletAccount(window.near);

  // Getting the Account ID. If unauthorized yet, it's just empty string.
  window.accountId = window.walletAccount.getAccountId();

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await window.near.loadContract(nearConfig.contractName, {
    // NOTE: This configuration only needed while NEAR is still in development
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getResponse'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['setResponse'],
    // Sender is the account ID to initialize transactions.
    sender: window.accountId,
  });
}

// Using initialized contract
async function doWork() {
  // Based on whether you've authorized, checking which flow we should go.
  if (!window.walletAccount.isSignedIn()) {
    signedOutFlow();
  } else {
    signedInFlow();
  }
}

// Function that initializes the signIn button using WalletAccount
function signedOutFlow() {
  // Displaying the signed out flow container.
  Array.from(document.querySelectorAll('.signed-out')).forEach(el => el.style.display = '');
  // Adding an event to a sing-in button.
  document.getElementById('sign-in').addEventListener('click', () => {
    window.walletAccount.requestSignIn(
      // The contract name that would be authorized to be called by the user's account.
      window.nearConfig.contractName,
      // This is the app name. It can be anything.
      'Who was the last person to say "Hi!"?',
      // We can also provide URLs to redirect on success and failure.
      // The current URL is used by default.
    );
  });
}

// Main function for the signed-in flow (already authorized by the wallet).
function signedInFlow() {
  // Displaying the signed in flow container.
  Array.from(document.querySelectorAll('.signed-in')).forEach(el => el.style.display = '');

  // Displaying current account name.
  document.getElementById('account-id').innerText = window.accountId;

    document.getElementById('set-response').addEventListener('click', () => {
    makeApiCallAndSave();
    });

  // Adding an event to a sing-out button.
  document.getElementById('sign-out').addEventListener('click', e => {
    e.preventDefault();
    walletAccount.signOut();
    // Forcing redirect.
    window.location.replace(window.location.origin + window.location.pathname);
  });

  // fetch who last said hi without requiring button click
  // but wait a second so the question is legible
    setTimeout(updateData, 1000);
}

async function makeApiCallAndSave() {
  //for visibility purposes
  console.log('calling api endpoint')
  //calling endpoint
  let response = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=0xc966Ba2a41888B6B4c5273323075B98E27B9F364&tag=latest&apikey=I8UJE9Z4QTUZ3S4J31AYF1ETD1RAZVCBRT');
  let body = await response.json();
  //stripping only the data we want from the API response
  //let data = body.bpi.USD.rate
  let data = body.result/1000000000
  //Saving the data to the blockchain by calling the Oracle Contracts setResponse function
  await window.contract.setResponse({ apiResponse: data });
  // Check to see if the data was saved properly
  let apiResponse = await contract.getResponse();
  console.log(`${apiResponse} is the API response available to the Oracle on-chain`);
}
// Function to update who said hi
function updateData() {
  // JavaScript tip:
  // This is another example of how to use promises. Since this function is not async,
  // we can't await for `contract.getResponse()`, instead we attaching a callback function
  // using `.then()`.
  contract.getResponse().then((response) => {
    const el = document.getElementById('response');
    el.innerText = response || 'No data available';
  });
}

// Loads nearAPI and this contract into window scope.
window.nearInitPromise = initContract()
  .then(doWork)
  .catch(console.error);
