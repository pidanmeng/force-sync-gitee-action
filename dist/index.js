import * as core from '@actions/core';
const username = core.getInput('username');
core.info(`[force-sync-gitee-action]: Your username is ${username}`);
