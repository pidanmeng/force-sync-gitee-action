import fs from 'fs';
import path from 'path';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { launch } from 'puppeteer';
import { downloadBrowser } from 'puppeteer/lib/cjs/puppeteer/node/install';
import inputs, { checkInputsValid } from './utils/io';
import {
  debugScreenshot,
  ensureCurrentPage,
  ensureElementLoaded,
  random,
  screenShotPath,
  sleep,
} from './utils/tools';
import { SELECTOR } from './constant';

let browser: any;
(async () => {
  // 入参检查
  if (!checkInputsValid()) {
    return;
  }
  if (!fs.existsSync(screenShotPath)) {
    await io.mkdirP(screenShotPath);
    core.info('创建截图目录');
  }
  core.info('开始下载浏览器');
  await downloadBrowser();
  core.info('浏览器下载完成');
  browser = await launch({
    args: ['--lang=zh-CN'],
  });

  core.info('准备登录');
  const page = await browser.newPage();
  await page.goto('https://gitee.com/login#lang=zh-CN');
  await ensureElementLoaded(page, SELECTOR.LOGIN);
  await debugScreenshot(page, 'step1.png');

  core.info('输入账号');
  await page.type(SELECTOR.LOGIN.USERNAME, inputs.username, {
    delay: random(10, 20),
  });
  await debugScreenshot(page, 'step2.png');

  core.info('输入密码');
  await page.type(SELECTOR.LOGIN.PASSWORD, inputs.password, {
    delay: random(10, 20),
  });
  await debugScreenshot(page, 'step3.png');

  core.info('点击登录');
  await page.click(SELECTOR.LOGIN.COMMIT);
  await ensureCurrentPage(page, 'https://gitee.com/');

  core.info('准备同步');
  await page.goto(`https://gitee.com/${inputs.username}/${inputs.repository}`);
  await ensureElementLoaded(page, SELECTOR.REPO);
  await debugScreenshot(page, 'step4.png');

  core.info('点击同步');
  await page.click(SELECTOR.REPO);
  await ensureElementLoaded(page, SELECTOR.SYNC);
  await debugScreenshot(page, 'step5.png');

  core.info('确认同步');
  await page.click(SELECTOR.SYNC);

  core.info('done!');
  await browser.close();

  return;
})().catch((error) => {
  if (browser) {
    browser.close();
  }
  core.error(error);
});
