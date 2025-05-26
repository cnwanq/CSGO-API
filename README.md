# CS2 API 服务

这是一个基于 Node.js 的 CS2（Counter-Strike 2）游戏数据 API 服务，提供游戏相关的数据查询接口，包括皮肤、贴纸、收藏品等信息。

## 功能特点

- 支持多语言（28种语言）
- RESTful API 设计
- 支持数据过滤和搜索
- 响应压缩
- 跨域支持
- 健康检查

## 系统要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

## 安装步骤

1. 克隆项目：
```bash
git clone https://github.com/your-username/CSGO-API.git
cd CSGO-API
```

2. 安装依赖：
```bash
npm install
```

3. 更新数据：
```bash
npm run update-data
```

4. 启动服务：
```bash
npm start
```

服务将在 http://localhost:3000 启动

## API 使用说明

### 基础 URL

```
http://localhost:3000/api/{language}
```

### 支持的语言

| 语言名称 | 语言代码 |
|---------|----------|
| 保加利亚语 | bg |
| 捷克语 | cs |
| 丹麦语 | da |
| 德语 | de |
| 希腊语 | el |
| 英语 | en |
| 西班牙语(西班牙) | es-ES |
| 西班牙语(墨西哥) | es-MX |
| 芬兰语 | fi |
| 法语 | fr |
| 匈牙利语 | hu |
| 意大利语 | it |
| 日语 | ja |
| 韩语 | ko |
| 荷兰语 | nl |
| 挪威语 | no |
| 波兰语 | pl |
| 葡萄牙语(巴西) | pt-BR |
| 葡萄牙语(葡萄牙) | pt-PT |
| 罗马尼亚语 | ro |
| 俄语 | ru |
| 斯洛伐克语 | sk |
| 瑞典语 | sv |
| 泰语 | th |
| 土耳其语 | tr |
| 乌克兰语 | uk |
| 简体中文 | zh-CN |
| 繁体中文 | zh-TW |
| 越南语 | vi |

### API 端点

#### 1. 获取所有物品
```http
GET /api/{language}/all.json
```

#### 2. 获取皮肤列表
```http
GET /api/{language}/skins.json
```

查询参数：
- `weapon`: 武器类型 (pistol, rifle, smg, sniper, shotgun, machinegun, knife)
- `rarity`: 稀有度 (consumer, industrial, mil-spec, restricted, classified, covert, contraband)
- `collection`: 收藏品 ID
- `crate`: 箱子 ID

示例：
```http
GET /api/zh-CN/skins.json?weapon=rifle&rarity=covert
```

#### 3. 获取未分组的皮肤列表
```http
GET /api/{language}/skins_not_grouped.json
```

支持与皮肤列表相同的查询参数。

#### 4. 获取贴纸列表
```http
GET /api/{language}/stickers.json
```

#### 5. 获取收藏品列表
```http
GET /api/{language}/collections.json
```

#### 6. 获取箱子列表
```http
GET /api/{language}/crates.json
```

#### 7. 搜索功能
```http
GET /api/{language}/search?q={search_term}
```

搜索范围包括：
- 皮肤名称和描述
- 贴纸名称
- 收藏品名称
- 箱子名称

#### 8. 健康检查
```http
GET /health
```

### 响应格式

所有 API 响应均为 JSON 格式，包含以下字段：

- 成功响应：
```json
{
  "data": [...],
  "status": "success"
}
```

- 错误响应：
```json
{
  "error": "错误信息",
  "status": "error"
}
```

## 开发说明

### 项目结构
```
CSGO-API/
├── public/           # 静态文件目录
│   └── api/         # API 数据文件
├── services/        # 服务模块
├── utils/           # 工具函数
├── server.js        # 服务器入口
├── update.js        # 数据更新脚本
└── package.json     # 项目配置
```

### 可用脚本

- `npm start`: 启动服务器
- `npm run update-data`: 更新数据
- `npm run group-data`: 分组数据
- `npm run update-data-force`: 强制更新数据
- `npm run group-data-force`: 强制分组数据

## 错误处理

API 使用标准的 HTTP 状态码：

- 200: 成功
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。