# Weapp TypeScript CLI

## USE

```
wets --help

wets init <project-name>

cd 项目目录

yarn / npm install

wets app-page <page-name>

wets app-component
? 设置 component 的名字 (例如: comp): comp
? 设置组件所属的作用域: page
? 设置组件所属的页面: demo

yarn watch / npm run watch
yarn dev / npm run dev
yarn build / npm run build
```

## TODO

- [ ] 通用工具
  - [x] Log
  - [x] 文件操作
  - [x] 获取 app.json


- [x] 快速创建启动模版: init
  - [x] http 下载模板
  - [x] 设置项目名称
  - [ ] 修改 package.json
  - [ ] 修改 project.config.js
- [x] 快速创建 ts 页面：add-page
  - [x] 设置页面名称
  - [x] 找到已有模版文件
  - [x] copy到项目中
  - [x] 修改app.json
  - [ ] 分包  
- [x] 快速创建 ts 组件: add-component
  - [x] 设置组件名
  - [x] 设置是全局组件 or 页面组件
  - [x] 找到已有模版文件
  - [x] copy到指定目录
  - [x] 修改 json
  - [ ] 分包  
- [ ] dev
- [ ] watch
- [ ] build
- [ ] 设置版本号，版本描述功能
- [ ] 发布体验版


- [ ] 兜底

