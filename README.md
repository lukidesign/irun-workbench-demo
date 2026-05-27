# iRun · 数字运维工作台 Demo

仿 runjian PMMS 思路、面向新能源电站的「数字孪生运维指挥中心」演示。10 大智能体作为数字团队协同运维，暗色科技风格。

**当前版本：v0.3.3** · 源需求：`design_pkg/workbench-demo-20260525/project/uploads/iRun Workbench Demo-1f363335.md`

## 运行

纯静态站点，零构建：

```bash
python3 -m http.server 8080
# 或
npx serve .
```

访问 http://localhost:8080/ 。设计稿固定 1920×1080，按视口自动缩放，建议宽屏浏览器。

## 文件结构

- `index.html` — 入口 + 全部 CSS
- `data.js` — 租户、电站、智能体、场景、事件流
- `components.jsx` — 通用组件（TopBar / EventStream / DispatchPanel / AgentsRail / PlantAgentField / DispatchedRobot 等）
- `map.jsx` — 总览地图 + Map2Overlay
- `detail.jsx` — 电站详情弹窗（含 SceneStage + DigitalTeam + SceneLog + TokenStrip）+ PlantInlineDock + useScenarioStepping
- `app.jsx` — 应用根

## 核心功能映射（对照原需求 MD）

### 两层视图 [1.3.3.1]

| 层级 | 实现 |
|------|------|
| 电站总览 | `Map2Overlay` 多电站俯瞰 + 12 plants × 3 tenants（ILP / fux / rj）|
| 单电站视图 | img2 模式：背景图 + 多智能体布场（仅 Hanoi-N / Selangor 配 robotField）|

### 托管模式 (auto) · 自主协同场景演示

| 场景 | 步骤序列 | 主参与智能体 |
|------|---------|------------|
| **A · 告警驱动 · 自主闭环** | 11 步 | ALT → DGN → ORD → SCH → SAF → ORD → ORD → OPS |
| **B · 无人机巡检 · 图像驱动** | 8 步 | INS → UAV → DGN → ORD → SCH → OPS |

- A→B→A 自动循环（末步 +4s 切换）
- 当前 step 触发后：
  - 涉及智能体头像高亮 + 浮层显示执行内容
  - SVG 连线（3px 虚线）+ 6px 流动光点 从 from 飞到 to
- UAV 沿蛇形航线持续巡检（36s 循环：4 列 PV 扫描 → 返港 → 起飞）

### 指挥模式 (command) · 人工调度

进入指挥模式：
- 清空 robotField 11 个机器人
- 停止场景循环
- 在 DispatchPanel 点击智能体 → 输入框自动 `@<short> ` 前缀
- 发送指令 → 紫色 iRun 小机器人沿 PLANT_ROBOT_PATH 走入 → 显示执行气泡 → 完毕消失

### 顶部 / 四侧布局 [1.3.4]

| 位置 | 组件 | 内容 |
|------|------|------|
| 顶部 | `TopBar` | 租户切换 · 6 项 KPI · 实时时钟 · 主题/语言切换 |
| 左侧 | `EventStream` / `EventStreamTab` | 实时事件流（可折叠）|
| 右侧 | `DispatchPanel` / `DispatchTab` | 对话调度（可折叠）+ 会话历史 |
| 极右 | `AgentsRail` | 10 智能体垂直栏 + 技能市场入口 + UAV 启动 |
| 底部 dock | `AgentTokenPanel`（总览）/ `PlantInlineDock`（单电站）| Token 卡片或电站 5 卡片 |

### 智能体数据 [1.3.3.2]

10 大智能体（4 分类）：

- **工具型** — 问数 QRY · 光伏助手 PVA
- **专家型** — 预警 WRN · 诊断 DGN · 安全 SAF · 巡检 INS
- **流程型** — 告警 ALT · 工单 ORD · 排程 SCH
- **管理型** — 运营 OPS

状态：`工作中` / `就绪` / `待处理` / `未配备`（原需求"学习中"未单独区分）

Token 数据：总量、强度（MW / min）、成功率、趋势曲线 — 见 `TokenStrip`、`AgentTokenPanel`

## 与原需求的差异 / 增强

### 超出原需求的增强

- 多智能体场地布场 + active 高亮 + 执行气泡（`PlantAgentField`）
- 智能体间动态连线（虚线 + 流动光点）
- UAV 蛇形巡检航线动效
- 亮 / 暗双主题（图1/图2 + 展示/漫游 4 子模式）
- 中英双语切换
- Agent 详情弹窗 + 技能市场弹窗
- 总览页 3 个 iRun 巡逻机器人
- Selangor 默认 B 场景；Hanoi-N 默认 A 场景

### 与原需求有出入

| 原需求 | 现状 |
|--------|------|
| 1.3.4.5 底部左：地图缩略图 | `MiniMap` 组件存在但未在 app 渲染 |
| 1.3.4.5 底部中：Agent Skill 矩阵 | 替换为 `AgentTokenPanel` |
| 1.3.4.5 底部右：快捷功能（工单/token 看板）| 替换为 `PlantInlineDock`（单电站底部 5 卡片）|
| 1.2.2.1 iRun 工作日报 | 未实现 |
| Agent 状态「学习中」 | 未单独区分 |

## 主题 / 子模式

| 模式 | 主题 | 子模式可选 |
|------|------|-----------|
| map2 | 亮 | 图1 (rjgf005) / 图2 (rjgf004) |
| map2 | 暗 | 展示 (rjgf001) / 漫游 (manyou001.mp4 视频背景) |
| img2 | 亮 / 暗 | `plant0XXqian.png` / `plant0XX.png` |

## 部署

GitHub Pages：Settings → Pages → Source 选 `main` 分支 `/ (root)`，约 1 分钟生效。

## 版本历史

- **v0.3.3** — PlantAgentField 智能体连线 + 6px 流动光点
- **v0.3.2** — 修复亮主题总览页 3 巡逻机器人不显示
- **v0.3.1** — PlantDetail 1/6 + 5/6 分栏，模式切换居中
- **v0.3.0** — 多智能体布场 · 指挥模式派遣 · UAV 蛇形航线 · Selangor 默认 B 场景
- **v0.2.3** — 亮 / 暗主题切换 · 天气 pill · 主题化背景
- **v0.2.2** — ILP 布局重整 · map2 背景切换 · 电站名 i18n
- **v0.2.1** — ILP 租户 7 站恢复
- **v0.2.0** — 多租户总览 · 12 电站 · UI 打磨
