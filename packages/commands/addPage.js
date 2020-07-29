const fs = require('fs'); // 文件读取模块
const path = require('path'); // 路径模块
const jsonFormat = require('json-format'); // json格式化（用来美化文件输出格式）
const Log = require('../lib/log.js'); // 控制台输出
const Util = require('../lib/utils.js'); // 工具函数

let Config = require('../config'); // 获取配置项

// 校验文件名称
const regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

/**
 * @description 创建 page
 */
module.exports = async function createPage(name, options) {
  // 校验文件名是否符合规范
  if (regEn.test(name) || regCn.test(name)) {
    Log.error('文件名存在非法字符');
    process.exit(1);
  }

  // page 文件夹路径
  const pagePath = path.join(Config.entry, '/pages', name);
  // 模版文件路径
  const tempPath = path.join(Config.template, '/page');
  if (!(await fs.existsSync(tempPath))) {
    Log.error(`未找到模版文件 ${tempPath}`);
    process.exit(1);
  }

  // 查看文件夹是否存在
  if (await fs.existsSync(pagePath)) {
    Log.error(`${pagePath} 目录已存在`);
    process.exit(1);
  }

  // 创建文件夹
  await Util.createDir(pagePath);

  // 获取文件列表
  const files = await Util.readDir(tempPath);

  // 复制文件
  await Util.copyFilesArr(tempPath, `${pagePath}/${name}`, files);

  // 填充app.json
  await writePageAppJson(name);

  // 成功提示
  Log.success(`创建 page - ${pagePath} 成功`);
};

/**
 * @description  新增页面写入app.json
 */
function writePageAppJson(name, modulePath = '') {
  return new Promise((resolve, reject) => {
    // 根据命令执行路径获取 app.json
    // TODO 容错
    const appJsonPath = path.resolve(process.cwd(), Config.entry, 'app.json');
    let appJson;
    try {
      appJson = require(appJsonPath);
    } catch (e) {
      Log.error(`未找到app.json, 请检查当前文件目录是否正确，并手动添加 ${appJsonPath}`);
      process.exit(1);
    }

    // 填充主包
    if (!modulePath) {
      appJson.pages.push(`pages/${name}/${name}`);
    }

    // 写入文件
    fs.writeFile(`${Config.entry}/app.json`, jsonFormat(appJson), (err) => {
      if (err) {
        Log.error('自动写入app.json文件失败，请手动填写，并检查错误');
        reject();
      } else {
        resolve();
      }
    });
  });
}
