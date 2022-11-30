import * as core from '@actions/core';

const username = core.getInput('username');
console.log(`[force-sync-gitee-action]: Your username is ${username}`);