#!/usr/bin/env node

const version = require('../package.json').version; // 版本号

/* = package import
-------------------------------------------------------------- */

const program = require('commander'); // 命令行解析

/* = task events
-------------------------------------------------------------- */
const addPage = require('./commands/addPage.js'); // 创建页面
const addComponent = require('./commands/addComponent.js'); // 创建页面
const initProject = require('./commands/initProject.js'); // 发布体验版

/* = set version
-------------------------------------------------------------- */

// 设置版本号
program.version(version, '-v, --version');

/* = deal receive command
-------------------------------------------------------------- */

// 新建项目
program
  .command('init <project-name>')
  .option('-f,--force', 'overwrite current directory')
  .description('初始化 weapp-ts 项目')
  .action(initProject);

// 快速生成模版 页面
program
  .command('add-page <page-name>')
  .option('-f,--force', 'overwrite current directory')
  .description('创建页面或组件')
  .action(addPage);

// 快速生成模版 组件
program
  .command('add-component [component-name]')
  .option('-f,--force', 'overwrite current directory')
  .description('创建组件')
  .action(addComponent);

/* = main entrance
-------------------------------------------------------------- */
program.parse(process.argv);
