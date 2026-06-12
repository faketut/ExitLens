# exit-lens

**ExitLens · AI 离职真因挖掘器**

通过匿名访谈脚本与本地 mock 洞察数据，演示离职洞察产品形态，为 HR 提供可执行的组织改进行动。

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

### 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 运行模式

- 当前版本为 Mock-only：`/interview/chat` 使用预设对话剧本
- `/dashboard` 使用本地聚合 mock 报告展示
- 无后端 API 路由；所有数据通过浏览器 `localStorage` 持久化

---

## 部署

### 方案一：腾讯 CloudStudio（推荐用于演示）

CloudStudio 是腾讯云的云端开发环境，无需本地配置即可运行项目并获得公网预览链接。

1. 访问 [CloudStudio](https://cloudstudio.net) 并登录
2. 新建工作空间 → 从 Git 仓库导入本项目
3. 在终端安装依赖：
   ```bash
   npm install
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
4. 本项目为 mock-only，无需配置外部模型 API Key
5. 点击「发布」→ 云托管会分配公网域名（`xxx.ap-shanghai.run.tcloudbase.com`）

---

## 项目结构

```
src/
├── app/
│   ├── dashboard/page.tsx       # HR 洞察仪表盘（读取 localStorage 报告）
│   ├── interview/
│   │   ├── page.tsx             # 面谈引导页
│   │   └── chat/page.tsx        # AI 对话界面（预设剧本）
│   └── page.tsx                 # Landing page
└── lib/
    ├── ai/state-machine.ts      # 六阶段对话状态机
    ├── mock-report.ts           # mock 报告生成 + localStorage 读写
    └── types.ts                 # TypeScript 类型定义
```

---

## 环境变量

当前 mock-only 版本无必填环境变量。

---

AI-HR 培训生自由赛道作品 · 2026
