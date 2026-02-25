# CHIPID解析工具

一个用于解析32位十六进制CHIPID的在线工具，提取Lot ID、Wafer编号、坐标等信息。

## 在线访问

将此项目部署到GitHub Pages后，可直接在浏览器中使用：
- 单个解析: `index-static.html`
- 批量解析: `batch-static.html`

## 功能特性

### 单个解析
- 解析单个CHIPID
- 显示Lot ID、Wafer编号、X/Y坐标、ECID
- 实时验证和错误提示
- 响应式设计，支持移动端

### 批量解析
- 支持批量输入多个CHIPID
- 支持多种分隔符（换行、逗号、分号、空格）
- 表格展示所有结果
- 统计信息（总数、成功、失败）
- 导出功能（CSV/Excel/复制）

## GitHub Pages 部署指南

### 方法1: 直接上传文件

1. 在GitHub创建新仓库
2. 将以下文件上传到仓库根目录或`docs`文件夹：
   ```
   index-static.html      (重命名为 index.html)
   batch-static.html      (重命名为 batch.html)
   chipid-parser.js
   ```

3. 在仓库设置中启用GitHub Pages：
   - Settings → Pages
   - Source: 选择 main 分支
   - Folder: 选择 root 或 /docs

4. 访问：`https://你的用户名.github.io/仓库名/`

### 方法2: 使用GitHub Desktop

1. 克隆或创建本地仓库
2. 将文件复制到本地仓库
3. 提交并推送
4. 在GitHub启用Pages

### 文件结构

```
your-repo/
├── index.html          (index-static.html重命名)
├── batch.html          (batch-static.html重命名)
├── chipid-parser.js
└── README.md
```

## 本地测试

直接用浏览器打开`index-static.html`即可，无需web服务器。

## CHIPID格式

- 总长度: 32位十六进制
- Lot ID: 前12位 (6字节)
- Wafer编号: 第12-14位 (1字节, 范围1-25)
- X坐标: 第14-16位
- Y坐标: 第18-20位

## ECID格式

`LotID_Wafer(2位)_X_Y`

示例: `ABC123_05_10_255`

## 技术栈

- 纯HTML/CSS/JavaScript
- 无需后端服务器
- 无需NPM或构建工具
- 可直接部署到任何静态托管服务

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 作者

Created with Claude Code
