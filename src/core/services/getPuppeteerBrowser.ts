import puppeteer, { LaunchOptions } from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'

export const getPuppeteerBrowser = async (options?: LaunchOptions) => {
  return await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ...options,
  })
}
