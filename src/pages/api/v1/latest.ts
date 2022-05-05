import dayjs from 'dayjs';
import { NextApiHandler } from 'next'

import { getLatest } from '../../../core/services/getLatest'
import getLotteries from '../../../core/services/lotteries';

const api: NextApiHandler = async (_req, res) => {
  console.log("[api/v1/latest.ts] getLatest()")
  try {
    const latestLotteryId = await getLatest()

    const lotto = await getLotteries(latestLotteryId)

    const lotteryDate = dayjs(lotto.date, 'D MMMM YYYY', 'th')

    if (lotteryDate.isAfter(dayjs().subtract(2, 'days'))) {
      res.setHeader('Cache-Control', 's-maxage=300')
    } else {
      res.setHeader('Cache-Control', 's-maxage=3600')
    }

    res.setHeader('Access-Control-Allow-Origin', '*')

    return res.send(lotto)
  } catch (e) {
    console.error(e)
    return res.status(400).send({
      status: 'crash',
      response: 'api cannot fulfill your request at this time'
    })
  }
}

export default api
