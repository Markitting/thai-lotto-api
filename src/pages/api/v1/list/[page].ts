import { NextApiHandler } from 'next'
import fs from 'fs'
import path from 'path'

import { getList } from '../../../../core/services/getList'
import dayjs from 'dayjs';

const api: NextApiHandler = async (req, res) => {
  let cachedData;
  const [day, month] = dayjs().format('DD-MM').split('-')

  try {
    const page = req.query?.page ?? "1"
    const LIST_CACHE_PATH = Number(day) <= 15 ? `.page-${page}-first-${month}` : `.page-${page}-second-${month}`

    if (!Number.isSafeInteger(Number(page))) {
      return res.status(400).send({
        status: 'crash',
        response: 'invalid positive integer'
      })
    } else {
      try {
        cachedData = JSON.parse(
          fs.readFileSync(path.join(__dirname, LIST_CACHE_PATH), 'utf8')
        )
        console.log("cachedData", LIST_CACHE_PATH, cachedData)
      } catch (error) {
        console.log('Lists cache not initialized')
      }

      const targetPage = Number(page)
      let lists;
      if (!cachedData) {
        lists = await getList(targetPage)

        fs.writeFileSync(
          path.join(__dirname, LIST_CACHE_PATH),
          JSON.stringify(lists),
          'utf8'
        )
        console.log('Wrote to lotteries cache')
        cachedData = lists
      }

      res.setHeader('Cache-Control', 's-maxage=7200')
      res.setHeader('Access-Control-Allow-Origin', '*')

      return res.send({
        status: 'success',
        response: cachedData,
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
