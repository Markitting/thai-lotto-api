import puppeteer, { LaunchOptions } from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'

export const getPuppeteerBrowser = async (options?: LaunchOptions) => {
  return await puppeteer.launch({
    headless: true,
    args: chrome.args,
    executablePath: process.env.NODE_ENV === 'development' ?  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' : await chrome.executablePath,
    ...options,
  })
}
