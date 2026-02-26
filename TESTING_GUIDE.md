# 芯片分类功能测试指南

## 更新内容 (v6.0)

已完成芯片分类数据库的更新，所有状态和描述均使用中文，并且未在数据库中的芯片会自动显示为"普通量产芯片"。

### 主要更新

1. **Priority（优先级）说明更新**
   - **Hot Run**: 快速制程
   - **Super Hot Run**: 超快制程
   - **Normal Production**: 普通量产制程

2. **Status（状态）全部使用中文**
   - Golden wafer: 参考wafer不出货
   - 盲封: 未ATE测试，仅实验室测试
   - ES96早期工程芯片: 仅LBIST测试，覆盖率70%
   - ES266早期工程芯片: ATE测试，覆盖率80%
   - Corner: 工艺Corner芯片，纯实验
   - 问题wafer: 良率问题未出货
   - 可靠性实验芯片: ATE测试，覆盖率90%
   - QS1407: ATE测试，覆盖率90%
   - 量产: 正常量产芯片，覆盖率99+%（默认）

3. **默认分类**
   - 不在数据库中的芯片自动分类为:
     - Priority: Normal Production
     - Status: 量产
     - Description: 正常量产芯片，覆盖率99+%

## 测试方法

### 方法1: 使用自动化测试页面（推荐）

1. 在浏览器中打开 `static/test-classification.html`
2. 页面会自动运行5个测试用例
3. 检查每个测试是否显示 `✓ 测试通过`

**测试用例包括:**
- ES96早期工程芯片 (U6B900 #4)
- ES96早期工程芯片 (U6B900 #6)
- Golden wafer (U6B902 #1)
- 可靠性实验芯片 (U6B901 #9)
- 普通量产芯片 (不在数据库中)

### 方法2: 使用单个解析页面

1. 在浏览器中打开 `static/index-static.html`
2. 输入以下测试CHIPID:

#### 测试案例 A: ES96早期工程芯片
```
CHIPID: 553642393030040A14FF1E0000000000
```
**期望结果:**
- Lot ID: U6B900
- Wafer编号: 4
- Priority: Super Hot Run - 超快制程
- Status: ES96早期工程芯片
- 说明: 仅LBIST测试，覆盖率70%

#### 测试案例 B: Golden wafer
```
CHIPID: 553642393032010D14FF1E0000000000
```
**期望结果:**
- Lot ID: U6B902
- Wafer编号: 1
- Priority: Hot Run - 快速制程
- Status: Golden wafer
- 说明: 参考wafer不出货

#### 测试案例 C: 普通量产芯片（不在数据库）
```
CHIPID: 5536423939390A0A14FF1E0000000000
```
**期望结果:**
- Lot ID: U6B999
- Wafer编号: 10
- Priority: Normal Production - 普通量产制程
- Status: 量产
- 说明: 正常量产芯片，覆盖率99+%

### 方法3: 使用批量解析页面

1. 在浏览器中打开 `static/batch-static.html`
2. 粘贴以下CHIPID（每行一个）:
```
553642393030040A14FF1E0000000000
553642393030060A14FF1E0000000000
553642393032010D14FF1E0000000000
553642393031090914FF1E0000000000
5536423939390A0A14FF1E0000000000
```

3. 点击"批量解析"按钮
4. 检查结果表格中的Priority和Status列

**期望结果表格:**

| # | Lot ID  | Wafer | Priority          | Status          |
|---|---------|-------|-------------------|-----------------|
| 1 | U6B900  | 4     | Super Hot Run     | ES96早期工程芯片 |
| 2 | U6B900  | 6     | Super Hot Run     | ES96早期工程芯片 |
| 3 | U6B902  | 1     | Hot Run           | Golden wafer    |
| 4 | U6B901  | 9     | Hot Run           | 可靠性实验芯片   |
| 5 | U6B999  | 10    | Normal Production | 量产            |

## 文件清单

### 核心文件
- `static/chipid-parser.js` - 解析引擎（包含默认分类逻辑）
- `static/chip-classification.js` - 分类数据库（完整的Lot/Wafer映射）

### 界面文件
- `static/index-static.html` - 单个CHIPID解析页面
- `static/batch-static.html` - 批量CHIPID解析页面
- `static/test-classification.html` - 自动化测试页面

### 部署文件
- `github-pages/` - 可直接部署到GitHub Pages的文件
  - index.html
  - batch.html
  - test-classification.html
  - chipid-parser.js
  - chip-classification.js

## 部署到GitHub Pages

1. 将 `github-pages/` 文件夹中的所有文件上传到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择部署分支和根目录
4. 访问 `https://你的用户名.github.io/仓库名/`

### 在线测试
- 主页: `https://你的用户名.github.io/仓库名/`
- 批量解析: `https://你的用户名.github.io/仓库名/batch.html`
- 测试页面: `https://你的用户名.github.io/仓库名/test-classification.html`

## 数据库覆盖范围

当前分类数据库包含以下Lot的完整信息:
- **U6B900**: 25个wafer（多种分类）
- **U6B901**: 24个wafer（可靠性实验芯片）
- **U6B902**: 24个wafer（Golden wafer, 可靠性实验, 问题wafer）
- **U6B903**: 15个wafer（QS1407）
- **U92R35**: 1个wafer（可靠性实验芯片）

其他所有Lot的芯片均默认为"普通量产芯片"。

## 故障排查

### 问题: 分类信息不显示

**解决方法:**
1. 确认浏览器已加载 `chip-classification.js`（查看浏览器开发者工具的Network选项卡）
2. 确认 `chip-classification.js` 在 `chipid-parser.js` 之前加载（查看HTML中的script标签顺序）
3. 清除浏览器缓存后重新加载

### 问题: 显示"Normal Production"而不是期望的分类

**可能原因:**
1. Lot ID不在数据库中（这是正常的，默认为量产）
2. Wafer编号不在该Lot的范围内（这也是正常的，默认为量产）
3. 数据库查询失败（检查浏览器控制台错误）

### 问题: 测试页面显示"✗ 测试失败"

**排查步骤:**
1. 查看"实际值"与"期望值"的差异
2. 检查是哪个字段不匹配
3. 确认数据库文件是最新版本

## 技术细节

### 分类查询逻辑
```javascript
// 在chipid-parser.js中
if (typeof ChipClassificationDB !== 'undefined') {
    classification = ChipClassificationDB.lookup(lot, wafer);
}

if (classification) {
    // 使用数据库中的分类
    result.priority = classification.priority;
    result.status = classification.status;
    result.description = classification.description;
} else {
    // 使用默认分类
    result.priority = "Normal Production";
    result.status = "量产";
    result.description = "正常量产芯片，覆盖率99+%";
}
```

### 数据库结构
```javascript
// 在chip-classification.js中
data: [
    {
        lot: "U6B900",
        wafers: [4, 6],
        priority: "Super Hot Run",
        status: "ES96早期工程芯片",
        description: "仅LBIST测试，覆盖率70%"
    },
    // ... 更多记录
]
```

## 更新历史

### v6.0 (2026-02-26)
- 更新Priority描述（Hot Run = 快速制程，Super Hot Run = 超快制程）
- 所有Status改为中文
- 添加详细的中文描述
- 实现默认分类逻辑
- 创建自动化测试页面

---

如有问题，请查看 `CHANGELOG.md` 了解详细的版本更新信息。
