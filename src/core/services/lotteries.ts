import fs from 'fs'
import path from 'path'
import { find } from 'lodash'
import { getLotto } from './getLotto';

export default async function getLotteries(lotteryId: string) {
  const LOTTERIES_CACHE_PATH = `.${lotteryId}`
  let cachedData

  try {
    cachedData = JSON.parse(
      fs.readFileSync(path.join(__dirname, LOTTERIES_CACHE_PATH), 'utf8')
    )
    console.log("cachedData", cachedData)
  } catch (error) {
    console.log('Lottery cache not initialized')
  }

  if (!cachedData) {
    const data = await getLotto(lotteryId)
    const isPending = !!find(data.prizes, (p) => p.id === 'prizeFirst' && p.number[0] === 'xxxxxx')

    try {
      if(!isPending && !cachedData){
        fs.writeFileSync(
          path.join(__dirname, LOTTERIES_CACHE_PATH),
          JSON.stringify(data),
          'utf8'
        )
        console.log('Wrote to lotteries cache')
      }
    } catch (error) {
      console.log('ERROR WRITING LOTTERIES CACHE TO FILE')
      console.log(error)
    }
    cachedData = data
  }

  return cachedData
}
