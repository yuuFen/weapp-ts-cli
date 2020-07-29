const path = require('path');

module.exports = {
  // 根目录
  root: path.resolve(__dirname, '../'),
  // 执行命令目录路径
  dir_root: process.cwd(),
  // 小程序项目路径
  entry: './src',
  // 项目编译输出文件夹
  output: './dist',
  // 小程序模版目录
  template: path.resolve(__dirname, '../temps'),
  project_temp_repo: 'yuuFen/weapp-ts-template',
};
