import * as core from '@actions/core';
import inputs from './io';
import path from 'path';
import { Page } from 'puppeteer';

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const screenShotPath = path.join(process.cwd(), 'screen-shot');

export async function debugScreenshot(page: Page, p: string) {
  if (inputs.enableDebug === 'true' || core.isDebug()) {
    let finalPath = path.join(screenShotPath, p);
    await page.screenshot({ path: finalPath, fullPage: true });
    core.info(`创建截图：${p}`);
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export async function ensureCurrentPage(page: Page, url: string) {
  let retry = 100;
  while (page.url() != url) {
    if (retry < 0) {
      await debugScreenshot(page, 'error2.png');
      throw new Error(`找开的页面一直不对，重试了100 次${page.url()}`);
    }
    await sleep(100);
    retry--;
  }
}

export async function ensureElementLoaded(
  page: Page,
  selectors: string | Record<string, string>
) {
  if (typeof selectors === 'string') {
    await page.waitForSelector(selectors);
    return true;
  }
  for (const selector in selectors) {
    if (Object.prototype.hasOwnProperty.call(selectors, selector)) {
      await page.waitForSelector(selectors[selector]);
    }
  }
  return true;
}
