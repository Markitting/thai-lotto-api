import puppeteer, { LaunchOptions } from 'puppeteer-core'

export const getPuppeteerBrowser = async (options?: LaunchOptions) => {
  return await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.NODE_ENV === 'development' ?  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge' : '/usr/bin/google-chrome-stable',
    ...options,
  })
}
