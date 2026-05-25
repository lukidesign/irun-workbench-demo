# iRun · 数字运维工作台 Demo

仿 runjian PMMS 思路、面向新能源电站的「数字孪生运维指挥中心」演示。10 个智能体作为数字团队协同运维，暗色科技风格。

## 运行

纯静态站点，零构建。任选其一：

```bash
# 方式 A：Python
python3 -m http.server 8080

# 方式 B：Node
npx serve .
```

然后访问 http://localhost:8080/

> 设计稿固定 1920×1080，会按视口自动缩放，建议宽屏浏览器查看。

## 文件结构

- `index.html` — 入口，包含全部样式
- `data.js` — 电站、智能体、事件流数据
- `components.jsx` — 通用组件
- `map.jsx` — 全局地图
- `detail.jsx` — 电站详情弹层
- `app.jsx` — 应用根

## 部署 GitHub Pages

仓库 Settings → Pages → Source 选 `main` 分支 `/ (root)`，等 1 分钟即可访问。
