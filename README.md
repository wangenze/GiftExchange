# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## How to Deploy

### Step 1 - Setup Cloud Env
1. Create a cloud env
2. Deploy cloud functions (right click `quickstartFunctions` and select upload and deploy all)
3. Create 2 collections in cloud env:
  1. `gift_user`: set permission to read by all and write only by creator
  2. `gift_activity`: set permission to custom permission and set both read and write to `true`

### Step 2 - Publish MiniProgram
1. Update the env ID in [miniprogram\envList.js](miniprogram\envList.js)
2. Compile and upload a new version (beta version will be avaible for test immediately)
3. Publish on the miniprogram control plane website (need to send for review and wait for publish)
