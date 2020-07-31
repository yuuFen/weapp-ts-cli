const fs = require('fs'); // 文件读取模块
const path = require('path'); // 路径模块
const download = require('download-git-repo');
const shell = require('shelljs');

const Log = require('../lib/log.js'); // 控制台输出
const Config = require('../config.js');

module.exports = async function initProject(cmd, options) {
  const repo = Config.project_temp_repo;
  const projectName = cmd;

  // console.log(cmd);
  // console.log('--------------------------------------------------');
  // console.log(options);

  if (fs.existsSync(projectName)) {
    Log.error(`${projectName} 项目已存在`);
    process.exit(1);
  }

  Log.success('开始下载模板');
  download(repo, projectName, function (err) {
    if (err) {
      Log.error('模板下载失败');
      process.exit(1);
    }
    if (fs.existsSync(path.resolve(projectName, './.git'))) {
      spinner.succeed(chalk.cyan('模板目录下 .git 移除'));
      fs.remove(path.resolve(projectName, './.git'));
    }
    
    // shell.cd(projectName);
    // Log.success('开始安装依赖，大约需要 5-15 分钟');
    // shell.exec('npm i');

    Log.success(`项目 ${projectName} 初始化成功`);
  });
};
