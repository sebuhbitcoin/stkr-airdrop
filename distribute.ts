import lineReader from 'line-reader'
import { BigNumber } from 'bignumber.js'
import { Utils } from '@tacoinfra/harbinger-lib'
import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';
import * as fs from 'fs';

const DISTRIBUTION_FILE = "Delegators.csv"
const NODE_URL = "https://testnet-tezos.giganode.io" // 
const CONTRACT_ADDRESS = "KT1WKEoX5fh3uDxd5MsMUagsV3KTwRukauCt" 
const TOKEN_ID = 0 // FOR FA2 TOKENS ONLY

// Load private key - lol its a testnet private key dont even try n jack me. kek
const privateKeyName = 'SEB_PRIVATE_KEY'
const privateKey = "edskRhvYDofJ6vbqEcTaS4xBFFjUiAHvWASZcnE7LX6H1Xaw936EZGpnYAJ4W8fr8H7QuZe8sfBnmewC1BWdUYLV7WewSvSeAD"
// process.env[privateKeyName] replaced with key directly. super no safety./
if (privateKey === undefined) {
  console.log('Fatal: No deployer private key defined.')
  console.log(`Set a ${privateKeyName} environment variable..`)
  process.abort()
}

type AirDrop = {
  address: string,
  amount: string
}

type CompletedAirDrop = {
  address: string,
  amount: string,
  operationHash: string
}

const main = async () => {
  // Load a signer
  const tezos = new TezosToolkit(NODE_URL);
  const signer = new InMemorySigner(privateKey)
  tezos.setProvider({
    signer
  });

  console.log("> Parsing file: " + DISTRIBUTION_FILE)
  console.log("> Using Node: " + NODE_URL)
  console.log("> Deploying from: " + await signer.publicKeyHash())
  console.log("> Token Contract: " + CONTRACT_ADDRESS)
  console.log("")

  const drops: Array<AirDrop> = []
  console.log('BEGIN PARSING');
  fs.readFileSync(DISTRIBUTION_FILE, 'utf-8').split(/\r?\n/).forEach(function (line) {
    if (line.trim().length === 0) {
      return;
    }
    const split = line.split(',')
    const trimmed = split.map((input) => {
      return input.trim()
    })
    drops.push({
      address: trimmed[0],
      amount: trimmed[1],
    })
  })

  const total = drops.reduce((accumulated: BigNumber, next: AirDrop) => {
    return accumulated.plus(new BigNumber(next.amount))
  }, new BigNumber("0"))

  // Sanity Check
  console.log("> About to distribute " + total.toFixed() + " SEB?")
  console.log("> Sleeping for 5secs while you ponder that.")
  await Utils.sleep(5)

  // Get contract
  const tokenContract = await tezos.contract.at(CONTRACT_ADDRESS)

  // Iterate over each airdop and carry out the drop.
  const completedOps: Array<CompletedAirDrop> = []
  for (let i = 0; i < drops.length; i++) {
    try {
      console.log(`>> Processing ${i + 1} of ${drops.length}`)
      const drop = drops[i]
      console.log(`>> Sending ${drop.amount} to ${drop.address}`)

      
   
    

const result = await tokenContract.methods.transfer([{ from_: await signer.publicKeyHash(), txs: [{ to_: drop.address, token_id: TOKEN_ID, amount: drop.amount }] }]).send({ amount: 0, mutez: true });

      console.log(`>> Sent in hash ${result.hash}. Waiting for 1 confirmation.`)
      await result.confirmation(1)
      console.log(`>> Confirmed.`)
      console.log(``)

      
    } catch (e) {
      console.log(``)
      console.log(`-----------------------------------------------`)
      console.log(`Unexpected error: ${e}`)
      console.log(`Please verify that ${drops[i].address} received ${drops[i].amount}`)
      console.log(`-----------------------------------------------`)
      console.log(``)
    }
  }

  // Print results to file
  console.log("> Writing results.")
  const dropFile = "completed_airdrops.csv"
  if (fs.existsSync(dropFile)) {
    fs.unlinkSync(dropFile)
  }
  fs.writeFileSync(dropFile, `address, amount (mutez), operation hash,\n`)
  for (let i = 0; i < completedOps.length; i++) {
    const completedOp = completedOps[i]

    fs.appendFileSync(dropFile, `${completedOp.address}, ${completedOp.amount}, ${completedOp.operationHash},\n`)
  }
  console.log(`> Written to ${dropFile}`)
  console.log("")
}

main()
