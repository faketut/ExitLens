# exit-lens

**ExitLens · AI 离职真因挖掘器**

利用 AI 消除离职面谈中的权力不对等和面子压力，通过动机访谈（MI）技术挖掘真实离职原因，为 HR 提供可执行的组织洞察。

---

## 产品页面

| 页面 | 路径 | 说明 |
|------|------|------|
| Landing | `/` | 产品介绍与价值主张 |
| 面谈引导 | `/interview` | 匿名信息采集 |
| AI 对话 | `/interview/chat` | 六阶段流式对话 |
| 洞察面板 | `/dashboard` | HR 管理后台，聚合分析 |

---

## 本地开发

### 环境要求

- Node.js 20+
- 至少一个 LLM API Key（OpenAI / Anthropic / DeepSeek / Gemini 任选）

### 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置 API Key（编辑 .env.local）
cp .env.example .env.local
# 填入至少一个：OPENAI_API_KEY=sk-xxx  或  DEEPSEEK_API_KEY=  或  GEMINI_API_KEY=

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 多模型支持

系统按以下优先级自动选择可用模型，**所有配置了 Key 的模型都会注册，主模型失败时自动 fallback 到下一个**：

1. OpenAI（`OPENAI_API_KEY`）→ `gpt-4o`
2. Anthropic（`ANTHROPIC_API_KEY`）→ `claude-sonnet-4-20250514`
3. DeepSeek（`DEEPSEEK_API_KEY`）→ `deepseek-chat`
4. Google Gemini（`GEMINI_API_KEY`）→ `gemini-2.0-flash`

---

## 部署

### 方案一：腾讯 CloudStudio（推荐用于演示）

CloudStudio 是腾讯云的云端开发环境，无需本地配置即可运行项目并获得公网预览链接。

1. 访问 [CloudStudio](https://cloudstudio.net) 并登录
2. 新建工作空间 → 从 Git 仓库导入本项目
3. 在终端安装依赖并配置环境变量：
   ```bash
   npm install
   echo "OPENAI_API_KEY=sk-xxx" >> .env.local
   # 或 DEEPSEEK_API_KEY= / ANTHROPIC_API_KEY=
   ```
4. 启动服务：
   ```bash
   npm run build && npm start
   ```
5. 点击右上角「端口预览」→ 选择端口 `3000` → 获取公网访问链接

> CloudStudio 工作空间关闭后链接失效。如需持久部署，使用方案二。

---

### 方案二：腾讯云 CloudBase 云托管（持久部署）

云托管是 CloudBase 提供的容器化托管服务，支持自动伸缩、自定义域名，项目根目录已含 `Dockerfile`。

#### 步骤

**① 构建 Docker 镜像**

```bash
docker build -t exit-lens:latest .
```

**② 推送到腾讯云容器镜像服务（TCR）**

```bash
docker login ccr.ccs.tencentyun.com
docker tag exit-lens:latest ccr.ccs.tencentyun.com/<namespace>/exit-lens:latest
docker push ccr.ccs.tencentyun.com/<namespace>/exit-lens:latest
```

**③ 在 CloudBase 控制台配置云托管**

1. 进入 [CloudBase 控制台](https://console.cloud.tencent.com/tcb) → 选择环境 → **云托管**
2. 新建服务 → 选择「使用镜像」→ 填入镜像地址
3. 端口填 `3000`
4. 在「环境变量」中添加（至少一个，多个同时配置可自动 fallback）：
   - `OPENAI_API_KEY` = `sk-xxx`
   - `DEEPSEEK_API_KEY` = `sk-xxx`
   - `ANTHROPIC_API_KEY` = `sk-ant-xxx`
   - `GEMINI_API_KEY` = `AIza...`
5. 点击「发布」→ 云托管会分配公网域名（`xxx.ap-shanghai.run.tcloudbase.com`）

---

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # 流式对话 API（多模型）
│   │   └── insights/route.ts    # 分析数据 API
│   ├── dashboard/page.tsx       # HR 洞察仪表盘
│   ├── interview/
│   │   ├── page.tsx             # 面谈引导页
│   │   └── chat/page.tsx        # AI 对话界面
│   └── page.tsx                 # Landing page
└── lib/
    ├── ai/
    │   ├── prompts.ts           # 动机访谈 System Prompt（6阶段）
    │   ├── providers.ts         # 多模型适配层
    │   └── state-machine.ts     # 六阶段对话状态机
    ├── storage.ts               # 数据存储 + Mock 数据
    └── types.ts                 # TypeScript 类型定义
```

---

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `OPENAI_API_KEY` | OpenAI API Key | `sk-proj-...` |
| `OPENAI_MODEL` | 模型名（可选，默认 gpt-4o）| `gpt-4o-mini` |
| `ANTHROPIC_API_KEY` | Anthropic API Key | `sk-ant-...` |
| `ANTHROPIC_MODEL` | 模型名（可选）| `claude-sonnet-4-20250514` |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | `sk-...` |
| `DEEPSEEK_MODEL` | 模型名（可选，默认 deepseek-chat）| `deepseek-reasoner` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIza...` |
| `GEMINI_MODEL` | 模型名（可选，默认 gemini-2.0-flash）| `gemini-2.5-pro` |

---

AI-HR 培训生自由赛道作品 · 2026
