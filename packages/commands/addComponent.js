const inquirer = require('inquirer'); // 启动交互命令行
const fs = require('fs'); // 文件读取模块
const path = require('path'); // 路径模块
const jsonFormat = require('json-format'); // json格式化（用来美化文件输出格式）
const Log = require('../lib/log.js'); // 控制台输出
const Utils = require('../lib/utils.js'); // 工具函数

const Config = require('../config'); // 获取配置项

const pagesList = {};

// 校验文件名称
const regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im;
const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

const question = [
  // 设置名称
  {
    type: 'input',
    name: 'name',
    message: () => `设置 component 的名字 (例如: comp):`,
    validate(input) {
      // 输入不得为空
      if (input === '') {
        return '输入不得为空';
      }
      // 校验文件名是否符合规范
      if (regEn.test(input) || regCn.test(input)) {
        return '文件名存在非法字符';
      }
      return true;
    },
  },

  // 选择组件作用域
  {
    type: 'list',
    name: 'scope',
    message: '设置组件所属的作用域:',
    choices: ['global', 'page'],
  },

  // 设置组件所属pages
  {
    type: 'list',
    name: 'parentPage',
    message: '设置组件所属的页面:',
    choices() {
      return [...Object.keys(pagesList)];
    },
    when(answer) {
      return answer.scope === 'page';
    },
  },
];

function getPathSubSting(path) {
  let result = '',
    arr = path.split('/');
  for (let i = arr.length; i > 0; i--) {
    if (!!arr[i]) {
      result = arr[i];
      break;
    }
  }
  return result;
}

/**
 * @description 创建 component
 */
module.exports = async function addComponent() {
  const appJson = Utils.getAppJson();
  appJson.pages.forEach((path) => (pagesList[getPathSubSting(path)] = path));
  // 问题执行
  inquirer.prompt(question).then((answers) => {
    // const { name, scope, parentPage } = answers;
    createComponent(answers);
  });
};

async function createComponent({ name, scope, parentPage }) {
  // 模版文件路径
  const tempPath = path.join(Config.template, '/component');

  if (!(await fs.existsSync(tempPath))) {
    Log.error(`未找到模版文件 ${tempPath}`);
    process.exit(1);
  }

  // 获取组件路径，策略模式
  const compPath = {
    global: () => path.join(Config.entry, '/component', name),
    page: () => path.join(Config.entry, pagesList[parentPage], '../', '/component', name),
  }[scope]();

  // 查看文件夹是否存在
  if (await fs.existsSync(compPath)) {
    Log.error('组件已存在，请重新确认，path:' + compPath);
    process.exit(1);
  }

  // 创建文件夹
  await Utils.createDir(compPath);

  // 获取文件列表
  const files = await Utils.readDir(tempPath);

  // 复制文件
  await Utils.copyFilesArr(tempPath, `${compPath}/${name}`, files);

  // 填充 app.json
  scope === 'page' &&
    (await writeComponentPageJson(name, parentPage, path.join(Config.entry, pagesList[parentPage], '../')));

  // 成功提示
  Log.success(`创建 component - ${compPath} 成功`);
}

/**
 * @description 新增组件写入page.json
 */
function writeComponentPageJson(name, parentPage, path) {
  console.log(path);
  return new Promise((resolve) => {
    const jsonPath = `${path}/${parentPage}.json`;
    let jsonConf;
    try {
      jsonConf = JSON.parse(fs.readFileSync(jsonPath));
    } catch (e) {
      Log.error(`未找到 ${parentPage}.json`);
      // 不存在时默值为对象
      (!jsonConf || !jsonConf.usingComponents) && (jsonConf = { usingComponents: {} });
      Log.success(`已创建 ${parentPage}.json`);
    }

    // 添加路径
    jsonConf.usingComponents[name] = `./component/${name}/${name}`;

    // 写入文件
    fs.writeFile(jsonPath, jsonFormat(jsonConf), (err) => {
      if (err) {
        console.log(chalk.red(`自动写入 ${parentPage}.json 文件失败，请手动填写`));
        resolve();
      } else {
        resolve();
      }
    });
  });
}
