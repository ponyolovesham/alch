require("dotenv").config();
const { API_URL, PRIVATE_KEY, PUBLIC_KEY } = process.env;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");
const contractAddress = "0x45723Cd6C9604C07d9eb8Db3dFC4F579Eca5BD0a";

const helloWorldContract = new web3.eth.Contract(contract.abi, contractAddress);

async function updateMessage(newMessage) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
  const gasEstimate = await helloWorldContract.methods
    .update(newMessage)
    .estimateGas();

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: gasEstimate,
    maxFeePerGas: 1000000108,
    data: helloWorldContract.methods.update(newMessage).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
        if (!err) {
          console.log(`The hash of your transaction is: ${hash}`);
        } else {
          console.log(`Something went wrong: ${err}`);
        }
      });
    })
    .catch((err) => console.log(`Promise failed: ${err}`));
}

async function main() {
  const message = await helloWorldContract.methods.message().call();
  console.log("The message is: " + message);
  //   await updateMessage("Hi Ponyo!");
}

main();
