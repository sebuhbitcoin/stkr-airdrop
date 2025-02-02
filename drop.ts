import * as WebRequest from 'web-request'
import { TezosToolkit } from '@taquito/taquito'
import * as fs from 'fs';

// Get delegators for Sebuh.net Bakery from TzKt.
const getDelegators_tzkt = async () => {
  const apiUrl = `https://api.tzkt.io/v1/accounts/tz1R664EP6wjcM1RSUVJ7nrJisTpBW9QyJzP/delegators?limit=1000` 
  const result: any = await WebRequest.get(apiUrl)

  const delegators = JSON.parse(result.message.body)

 // const votingVoters = voters.filter((voter: any) => {
    //return voter.status !== "none"
 // })

  return delegators.map((delegator: any) => {
    return delegator.address
  })
}

// Get voters for VOTING_PERIOD from TzStats.
//const getVoters_tzStats = async () => {
 // const apiUrl = `https://api.tzkt.io/v1/accounts/tz1R664EP6wjcM1RSUVJ7nrJisTpBW9QyJzP/delegators?limit=1000`
 // const result: any = await WebRequest.get(apiUrl)
 // const voters = JSON.parse(result.message.body)

//  return voters.map((voter: any) => {
 ////   return voter.sender
 // })
//}

//type OvenDrop = {
//  owner: string,
//  address: string,
//  value: string
//}

// Get Ovens from TzStats
//const getOvens_tzstats = async () => {
  // Get ovens and owners
 // const apiUrlForOvens = `https://api.tzstats.com/explorer/bigmap/260/values?limit=1000`
  //const ovenResult: any = await WebRequest.get(apiUrlForOvens)
  //const ovenDatas = JSON.parse(ovenResult.message.body)

  //const tezos = new TezosToolkit("https://rpc.tzbeta.net")

 // const ovenDrops: Array<Promise<OvenDrop>> = ovenDatas.map(async (ovenData: any) => {
   // const address = ovenData.key
 //   const balance = await tezos.rpc.getBalance(address)

  //  return {
  //    owner: ovenData.value,
  //   address: address,
  //    value: balance
 //   }
 // })

 // return Promise.all(ovenDrops)
//}

// Tabulate results
const main = async () => {
  console.log("Calculating Airdrop")
  console.log("")

  // Get Voters
  console.log("> Getting Delegators")
  const delegators_tzkt = (await getDelegators_tzkt()).sort()
 // const voters_tzStats = (await getVoters_tzStats()).sort()
  console.log("> Done")

  // Verify voters
 // console.log(`> Got ${voters_tzkt.length} from TzKT and ${voters_tzStats.length} from TzStats.`)
 // if (voters_tzkt.length !== voters_tzStats.length) {
 //   throw new Error("Inconsistent results")
 // }
 // for (let i = 0; i < voters_tzStats.length; i++) {
 //   if (voters_tzStats[i] !== voters_tzkt[i]) {
 //     throw new Error(`Bad match at index ${i}`)
  //  }
 // }
  console.log("> Results matched!")
  console.log("")

  // Get Ovens
 // console.log("> Getting wXTZ Oven Data")
 // const ovenDrops = await getOvens_tzstats()
  //console.log("> Done")

 // console.log(`Got ${ovenDrops.length} ovens. Please VERIFY that number is matched here: `)
 // console.log(`https://better-call.dev/mainnet/big_map/260/keys`)
 // console.log(``)

  // Write voters to file.
  console.log("> Writing Delegators data.")
  const delegatorsFile = "Delegators.csv"
  if (fs.existsSync(delegatorsFile)) {
    fs.unlinkSync(delegatorsFile)
  } fs.writeFileSync(delegatorsFile, `baker address,\n`)
  for (let i = 0; i < delegators_tzkt.length; i++) {
    fs.appendFileSync(delegatorsFile, `${delegators_tzkt[i]},\n`)
  }
  console.log(`> Written to ${delegatorsFile}`)
  console.log("")

  // Write voters to file.
 // console.log("> Writing voter data.")
//  const ovenFile = "ovens.csv"
//  if (fs.existsSync(ovenFile)) {
 //   fs.unlinkSync(ovenFile)
//  }
 // fs.writeFileSync(ovenFile, `oven address, owner address, balance (mutez),\n`)
 // for (let i = 0; i < ovenDrops.length; i++) {
  //  const ovenDrop = ovenDrops[i]

 //   fs.appendFileSync(ovenFile, `${ovenDrop.address}, ${ovenDrop.owner}, ${ovenDrop.value},\n`)
//  }
 // console.log(`> Written to ${ovenFile}`)
 // console.log("")
}

main()
