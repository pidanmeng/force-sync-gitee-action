# Action简介

该项目使用无头浏览器`puppeteer`，根据用户提供的账号密码登录gitee，并强制同步指定的gitee repo

使用前请确保提供的账号对指定的repo有权限，并确保指定的repo是导入自GitHub

## Usage

### Workflow Example

```
name: Sync Repository Action
on:
  push:
  schedule:
    # 每天北京时间0点同步
    - cron:  '0 16 * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Sync to Gitee
      uses: pidanmeng/force-sync-gitee-action@master
      with:
        # gitee账号
        username: ${{ secrets.GITEE_USERNAME }}
        # gitee密码
        password: ${{ secrets.GITEE_PASSWORD }}
        # 需要同步的repo
        repository: ${{ secrets.REPOSITORY }}
```

### Notice

为了保护账号安全，请在项目设置中设定secret以保存账号密码等敏感信息

## 开发说明

### 安装依赖：

```
pnpm i
```

### 设置dev环境下的入参：

- 在项目目录下新建`.env`文件
- 在`.env`下设置入参，如下：

```
username=***
password=***
repository=***
```

**notice**: username需要填写个人空间地址，而不是邮箱或手机号

## TODO