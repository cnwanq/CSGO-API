import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { loadData } from './services/main.js';
import { getSkins } from './services/skins.js';
import { getStickers } from './services/stickers.js';
import { getCollections } from './services/collections.js';
import { getCrates } from './services/crates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(compression());
app.use(express.json());

// 支持的语言列表
const supportedLanguages = [
  'bg', 'cs', 'da', 'de', 'el', 'en', 'es-ES', 'es-MX', 'fi', 'fr', 'hu',
  'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'sv',
  'th', 'tr', 'uk', 'vi', 'zh-CN', 'zh-TW'
];

/**
 * 语言参数验证中间件
 * 检查请求中的语言参数是否在支持的语言列表中
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express 下一个中间件函数
 */
const validateLanguage = (req, res, next) => {
  const { language } = req.params;
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({
      error: 'Unsupported language',
      supportedLanguages
    });
  }
  next();
};

/**
 * 查询参数验证中间件
 * 验证查询参数的有效性
 */
const validateQuery = (req, res, next) => {
  const { weapon, rarity, collection, crate } = req.query;
  
  // 验证武器类型
  if (weapon && !['pistol', 'rifle', 'smg', 'sniper', 'shotgun', 'machinegun', 'knife'].includes(weapon)) {
    return res.status(400).json({ error: 'Invalid weapon type' });
  }
  
  // 验证稀有度
  if (rarity && !['consumer', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', 'contraband'].includes(rarity)) {
    return res.status(400).json({ error: 'Invalid rarity' });
  }
  
  next();
};

/**
 * API 路由定义
 * 所有路由都遵循 RESTful 风格，使用语言代码作为路径参数
 */

// 获取所有物品数据
app.get('/api/:language/all.json', validateLanguage, async (req, res) => {
  try {
    const { language } = req.params;
    const filePath = join(__dirname, 'public', 'api', language, 'all.json');
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取皮肤数据（已分组）
app.get('/api/:language/skins.json', validateLanguage, validateQuery, async (req, res) => {
  try {
    const { language } = req.params;
    const { weapon, rarity, collection, crate } = req.query;
    
    // 获取基础皮肤数据
    let skins = await getSkins(language);
    
    // 应用过滤条件
    if (weapon) {
      skins = skins.filter(skin => skin.weapon.type === weapon);
    }
    if (rarity) {
      skins = skins.filter(skin => skin.rarity.id === `rarity_${rarity}_weapon`);
    }
    if (collection) {
      skins = skins.filter(skin => 
        skin.collections.some(c => c.id === collection)
      );
    }
    if (crate) {
      skins = skins.filter(skin => 
        skin.crates.some(c => c.id === crate)
      );
    }
    
    res.json(skins);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取皮肤数据（未分组）
app.get('/api/:language/skins_not_grouped.json', validateLanguage, validateQuery, async (req, res) => {
  try {
    const { language } = req.params;
    const { weapon, rarity, collection, crate } = req.query;
    
    // 获取未分组的皮肤数据
    let skins = await getSkins(language, false);
    
    // 应用过滤条件
    if (weapon) {
      skins = skins.filter(skin => skin.weapon.type === weapon);
    }
    if (rarity) {
      skins = skins.filter(skin => skin.rarity.id === `rarity_${rarity}_weapon`);
    }
    if (collection) {
      skins = skins.filter(skin => 
        skin.collections.some(c => c.id === collection)
      );
    }
    if (crate) {
      skins = skins.filter(skin => 
        skin.crates.some(c => c.id === crate)
      );
    }
    
    res.json(skins);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取贴纸数据
app.get('/api/:language/stickers.json', validateLanguage, async (req, res) => {
  try {
    const { language } = req.params;
    const stickers = await getStickers(language);
    res.json(stickers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取收藏品数据
app.get('/api/:language/collections.json', validateLanguage, async (req, res) => {
  try {
    const { language } = req.params;
    const collections = await getCollections(language);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取箱子数据
app.get('/api/:language/crates.json', validateLanguage, async (req, res) => {
  try {
    const { language } = req.params;
    const crates = await getCrates(language);
    res.json(crates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 搜索功能
app.get('/api/:language/search', validateLanguage, async (req, res) => {
  try {
    const { language } = req.params;
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // 获取所有相关数据
    const [skins, stickers, collections, crates] = await Promise.all([
      getSkins(language),
      getStickers(language),
      getCollections(language),
      getCrates(language)
    ]);
    
    // 搜索逻辑
    const results = {
      skins: skins.filter(item => 
        item.name.toLowerCase().includes(q.toLowerCase()) ||
        item.description.toLowerCase().includes(q.toLowerCase())
      ),
      stickers: stickers.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      ),
      collections: collections.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      ),
      crates: crates.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      )
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 健康检查端点
 * 用于监控系统是否正常运行
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * 全局错误处理中间件
 * 捕获并处理所有未处理的错误
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 初始化数据
const initializeData = async () => {
  try {
    await loadData();
    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
};

// 启动服务器
const startServer = async () => {
  await initializeData();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api/{language}/`);
    console.log('Supported languages:', supportedLanguages.join(', '));
  });
};

startServer(); 