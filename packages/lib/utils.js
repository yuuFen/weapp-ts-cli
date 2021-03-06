const fs = require('fs'); // 文件读取模块
const path = require('path'); // 路径模块
const Log = require('./log');
const Config = require('../config');

module.exports = {
  // 获取 app.json
  getAppJson() {
    const appJsonPath = path.resolve(process.cwd(), Config.entry, 'app.json');
    try {
      return require(appJsonPath);
    } catch (e) {
      Log.error(`未找到 app.json, 请检查当前文件目录是否正确，并手动添加 ${appJsonPath}`);
      process.exit(1);
    }
  },

  // 查看文件/文件夹是否存在
  checkFileIsExists(path) {
    return fs.existsSync(path);
  },

  // 创建文件夹
  createDir(src) {
    return new Promise((resolve) => {
      fs.mkdir(src, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
        return resolve();
      });
    });
  },

  // 获取文件夹下的list
  readDir(path) {
    return new Promise((resolve) => {
      fs.readdir(path, (err, files) => {
        if (err) {
          throw err;
        }
        return resolve(files);
      });
    });
  },

  // 复制文件
  copyFile(originPath, curPath) {
    return new Promise((resolve) => {
      fs.copyFile(originPath, curPath, fs.constants.COPYFILE_EXCL, (err) => {
        if (err) {
          throw err;
        }
        return resolve('copyFile success!!!');
      });
    });
  },

  // 复制批量文件
  copyFilesArr(originPath, curPath, arr) {
    return new Promise(async (resolve) => {
      let extName = '';
      for (let i = 0; i <= arr.length - 1; i++) {
        extName = path.extname(arr[i]);
        await this.copyFile(`${originPath}/${arr[i]}`, curPath + extName);
      }
      return resolve('copyFilesArr success!!!');
    });
  },
};
