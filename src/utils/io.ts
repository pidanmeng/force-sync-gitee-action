import * as core from '@actions/core';
import * as env from 'dotenv';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { actionInputs } from './constant';

function getEnv() {
  const { parsed, error } = env.config();
  if (error) {
    core.info('[从线上环境获取流水线入参]')
    return {};
  }
  if (!parsed) {
    return {};
  }
  return parsed;
}

const params = getEnv();

function getParam(paramName: string) {
  const devParamValue = Reflect.get(params, paramName);

  return devParamValue || core.getInput(paramName);
}

interface InputDefinition {
  description: string;
  required: boolean;
}

function loadActionConfig(): Record<string, InputDefinition> {
  const inputs = actionInputs;
  if (!inputs) {
    core.error('读取action.yml失败');
    return {};
  }
  return inputs;
}

type Input = {
  enableDebug: string;
  username: string;
  password: string;
  repository: string;
};

/**
 * 通过代理对象获取actions的入参
 */
const io = new Proxy(
  {},
  {
    get: function (target, key) {
      if (typeof key !== 'string') {
        core.error('action入参的key必须为string类型');
        return;
      }
      return getParam(key);
    },
  }
) as Input;

/**
 * 检查入参是否合法，若有必要的入参为空，则返回false，否则返回true
 * @returns 入参是否合法
 */
export function checkInputsValid(): boolean {
  const config = loadActionConfig();
  for (const key in config) {
    if(config[key].required && !config[key]){
      core.error(`入参错误：${key}为必填项`)
      return false;
    }
  }
  return true;
}

export default io;
