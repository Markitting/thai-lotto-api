import { NextApiHandler } from 'next'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import getLotteries from '../../../../core/services/lotteries';

dayjs.extend(customParseFormat)

const api: NextApiHandler = async (req, res) => {
  try {
    const id = req.query?.id

    if (!Number.isSafeInteger(Number(id))) {
      return res.status(400).send({
        status: 'crash',
        response: 'invalid positive integer'
      })
    } else {
      const lotto = await getLotteries(id as string)

      const lottoeryDate = dayjs(lotto.date, 'D MMMM YYYY', 'th')

      if (lottoeryDate.isAfter(dayjs().subtract(2, 'days'))) {
        res.setHeader('Cache-Control', 's-maxage=2592000')
      } else {
        res.setHeader('Cache-Control', 's-maxage=3600')
      }

      res.setHeader('Access-Control-Allow-Origin', '*')

      return res.send({
        status: 'success',
        response: lotto,
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).send({
      status: 'crash',
      response: 'api cannot fulfill your request at this time'
    })
  }
}

export default api
