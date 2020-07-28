const fs = require('fs'); // 文件读取模块
const path = require('path'); // 路径模块
const download = require('download-git-repo');
const Log = require('../lib/log.js'); // 控制台输出
const Config = require('../config.js');

module.exports = async function initProject(cmd, options) {
  const repo = Config.project_temp_repo;
  const srcPath = cmd;
  
  console.log(cmd);
  console.log('--------------------------------------------------');
  console.log(options);

  if (fs.existsSync(srcPath)) {
    Log.error('路径已存在');
    process.exit(1);
  }

  download(repo, srcPath, function (err) {
    if (err) {
      Log.error('模板下载失败');
      process.exit(1);
    }
    Log.success('init 成功');
    if (fs.existsSync(path.resolve(srcPath, './.git'))) {
      spinner.succeed(chalk.cyan('模板目录下 .git 移除'));
      fs.remove(path.resolve(srcPath, './.git'));
    }
  });
};
