// iRun Workbench — data layer
// All shared constants live here so components stay declarative.

const AGENT_CATEGORIES = {
  tool:       { label: '工具型', cn: '工具', hue: 188, color: '#22d3ee', soft: 'rgba(34,211,238,0.16)' },
  expert:     { label: '专家型', cn: '专家', hue:  38, color: '#fbbf24', soft: 'rgba(251,191,36,0.16)' },
  process:    { label: '流程型', cn: '流程', hue: 268, color: '#a78bfa', soft: 'rgba(167,139,250,0.16)' },
  management: { label: '管理型', cn: '管理', hue: 158, color: '#34d399', soft: 'rgba(52,211,153,0.16)' },
};

const AGENTS = [
  { id: 'alert',   name: '告警智能体',   short: '告警', en: 'Alarm',    code: 'ALT', cat: 'process', notif: 2,
    role: '数字监控员', enRole: 'Digital Monitor',
    intro: '7×24 实时跟踪告警/离线/算法预警，智能去噪研判并输出处置建议。',
    skills: ['事件去噪', '智能研判', '处置建议', '事件升级'],
    metrics: { todayCalls: 612, tokens: '88.9K', success: 96.4 } },
  { id: 'order',   name: '工单智能体',   short: '工单', en: 'Ticket',   code: 'ORD', cat: 'process', notif: 0,
    role: '工单全流程引擎', enRole: 'Ticket Workflow Engine',
    intro: '覆盖工单全生命周期：自动创建、智能派单、智能辅助填报、自动验收。',
    skills: ['自动创建', '智能派单', '辅助填报', '自动验收'],
    metrics: { todayCalls: 244, tokens: '41.2K', success: 98.1 } },
  { id: 'sched',   name: '排程智能体',   short: '排程', en: 'Schedule', code: 'SCH', cat: 'process', notif: 0,
    role: '资源调度指挥官', enRole: 'Resource Dispatch Commander',
    intro: '基于工单优先级、人员技能、天气路况动态生成最优人力/物资/行程方案。',
    skills: ['人力调配', '物资调度', '行程规划', '路径最优'],
    metrics: { todayCalls: 173, tokens: '28.5K', success: 97.3 } },
  { id: 'warn',    name: '预警智能体',   short: '预警', en: 'Predict',  code: 'WRN', cat: 'expert', notif: 1,
    role: '电站性能哨兵', enRole: 'Plant Performance Sentinel',
    intro: '识别尚未达到故障阈值但已出现趋势性劣化的运行状态，输出预警信号与初步归因。',
    skills: ['低效预警', '趋势识别', '初步归因', '损失量化'],
    metrics: { todayCalls: 318, tokens: '54.1K', success: 97.6 } },
  { id: 'insp',    name: '巡检智能体',   short: '巡检', en: 'Inspect',  code: 'INS', cat: 'expert', notif: 0,
    role: '无人机巡检专家', enRole: 'UAV Inspection Specialist',
    intro: '自动分析无人机/摄像头/人工巡检图像，识别二极管故障、异物遮挡、热斑等缺陷。',
    skills: ['图像识别', '缺陷分类', '智能验收', '报告生成'],
    metrics: { todayCalls: 64, tokens: '94.2K', success: 96.9 } },
  { id: 'diag',    name: '诊断智能体',   short: '诊断', en: 'Diagnose', code: 'DGN', cat: 'expert', notif: 0,
    role: '电站技术专家', enRole: 'Plant Technical Expert',
    intro: '基于运行数据与故障码图谱进行深度诊断，输出结论（如热斑/弃光/遮挡）及处理建议。',
    skills: ['故障诊断', '损失电量量化', '专家经验沉淀', '处置建议'],
    metrics: { todayCalls: 207, tokens: '76.3K', success: 95.8 } },
  { id: 'safe',    name: '安全智能体',   short: '安全', en: 'Safety',   code: 'SAF', cat: 'expert', notif: 1,
    role: '作业与运行安全风险官', enRole: 'Safety & Risk Officer',
    intro: '融合环境与设备多源数据识别火灾、登高、恶劣天气等安全风险，作业前主动推送提示。',
    skills: ['火情识别', '作业风险研判', '气象联动', '应急升级'],
    metrics: { todayCalls: 86, tokens: '12.0K', success: 99.7 } },
  { id: 'pv',      name: '光伏助手智能体', short: '光伏', en: 'PV Assist', code: 'PVA', cat: 'tool', notif: 0,
    role: '光伏运维知识引擎', enRole: 'PV O&M Knowledge Engine',
    intro: '融合故障案例库、设备手册、运维规程、行业标准，针对运维全流程提供专业解答。',
    skills: ['知识检索', '案例匹配', '规程问答', '隐性知识沉淀'],
    metrics: { todayCalls: 287, tokens: '39.6K', success: 99.0 } },
  { id: 'query',   name: '问数智能体',   short: '问数', en: 'Data Q&A', code: 'QRY', cat: 'tool', notif: 0,
    role: '自然语言数据助手', enRole: 'NL Data Assistant',
    intro: '自然语言即问即答式数据查询与可视化，由"人寻数"转向"数寻人"。',
    skills: ['NL2SQL', '页面感知', '可视化生成', '指标解释'],
    metrics: { todayCalls: 401, tokens: '32.7K', success: 98.9 } },
  { id: 'ops',     name: '运营智能体',   short: '运营', en: 'Operate',  code: 'OPS', cat: 'management', notif: 0,
    role: '电站经营指挥官', enRole: 'Plant Operations Commander',
    intro: '聚焦电站长期运行效率与经营指标，对关键KPI持续监测预警，为管理决策提供量化依据。',
    skills: ['KPI 监测', '资产健康度', '收益洞察', '预防性维护建议'],
    metrics: { todayCalls: 142, tokens: '23.4K', success: 99.2 } },
];

const AGENT_BY_ID = Object.fromEntries(AGENTS.map(a => [a.id, a]));

// Tenants
const TENANTS = [
  { id: 'ilp', name: 'International Landing Plants', region: 'SE-Asia' },
  { id: 'fux', name: '河源·福曦能源',                 region: '广东·河源' },
  { id: 'rj',  name: '润建能源数字化研究院',           region: '广西·南宁' },
];

// Plants — positioned in the abstract map (vw% / vh% of map area)
const PLANTS = [
  { id: 'p1', name: '福曦·东源一号',  short: '东源 #01', tenant: 'fux', region: '广东·河源', city: '河源',
    capacity: 80.5, power: 62.4, gen: 412.8, alerts: 7, risk: 'low',  status: '托管中',
    x: 60, y: 50, agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'] },
  { id: 'p2', name: 'ILP · Banten-A', short: 'Banten-A', tenant: 'ilp', region: 'Indonesia·万丹', city: '万丹',
    capacity: 50.0, power: 31.7, gen: 218.4, alerts: 3, risk: 'mid',  status: '托管中',
    x: 78, y: 68, agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p3', name: '润建·研究示范站', short: '示范站',    tenant: 'rj',  region: '广西·南宁', city: '南宁',
    capacity: 30.2, power: 19.6, gen: 152.6, alerts: 1, risk: 'low',  status: '托管中',
    x: 44, y: 56, agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'] },
  { id: 'p4', name: 'ILP · Cebu-North', short: 'Cebu-N',  tenant: 'ilp', region: 'Philippines·宿务', city: '宿务',
    capacity: 42.0, power: 26.1, gen: 184.5, alerts: 5, risk: 'high', status: '指挥模式',
    x: 84, y: 54, agents: ['ops','warn','alert','diag','order','sched'] },
  { id: 'p5', name: '福曦·东源二号',  short: '东源 #02', tenant: 'fux', region: '广东·河源', city: '广州',
    capacity: 60.0, power: 44.8, gen: 296.1, alerts: 2, risk: 'low',  status: '托管中',
    x: 66, y: 40, agents: ['ops','warn','safe','alert','diag','order','sched','pv','query'] },
  { id: 'p6', name: 'ILP · Selangor', short: 'Selangor', tenant: 'ilp', region: 'Malaysia·吉隆坡', city: '吉隆坡',
    capacity: 36.5, power: 22.4, gen: 158.2, alerts: 4, risk: 'mid',  status: '托管中',
    x: 64, y: 74, agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p7', name: '润建·横州渔光',  short: '横州渔光', tenant: 'rj',  region: '广西·横州', city: '横州',
    capacity: 25.8, power: 16.1, gen: 124.0, alerts: 0, risk: 'low',  status: '托管中',
    x: 40, y: 60, agents: ['ops','warn','alert','diag','order','sched','pv','insp'] },
];

// Aggregate KPIs derived from PLANTS at render time, but precomputed for top bar
const AGGREGATE = {
  plants: PLANTS.length,
  capacity: PLANTS.reduce((s,p)=>s+p.capacity,0),  // MW
  power:    PLANTS.reduce((s,p)=>s+p.power,0),     // MW
  gen:      PLANTS.reduce((s,p)=>s+p.gen,0),       // MWh
  alerts:   PLANTS.reduce((s,p)=>s+p.alerts,0),
  risk:     2,  // plants with elevated KPI risk
};

// Scenario A: 组串告警 → 去噪 → 诊断 → 工单 → 排程 → 现场 → 安全 → 填报 → 验收 → 归档
const SCENARIO_A = {
  id: 'A', title: '场景 A · 告警驱动 · 自主闭环',
  steps: [
    { t: 0,    from: 'plant', to: 'alert',  type: 'event',   text: '组串 #C03-12 电流异常 / 低效预警 ×3', tag: '原始事件' },
    { t: 1500, from: 'alert', to: 'alert',  type: 'think',   text: '聚类去噪：3 条事件归为同一组串问题', tag: '事件研判' },
    { t: 3000, from: 'alert', to: 'diag',   type: 'handoff', text: '移交诊断 → 请确认根因', tag: '协同' },
    { t: 4200, from: 'diag',  to: 'diag',   type: 'think',   text: '比对故障码图谱 → 疑似 热斑 + 局部遮挡', tag: '深度诊断' },
    { t: 5800, from: 'diag',  to: 'order',  type: 'handoff', text: '诊断结论：热斑 / 损失 ≈ 142 kWh·d', tag: '协同' },
    { t: 7000, from: 'order', to: 'order',  type: 'action',  text: '创建工单 WO-26052-019 · 优先级 P2', tag: '工单' },
    { t: 8200, from: 'order', to: 'sched',  type: 'handoff', text: '请求资源排程 · 技能：组串清理', tag: '协同' },
    { t: 9400, from: 'sched', to: 'sched',  type: 'think',   text: '匹配运维员 张磊（距站 18min）+ 备件 J-204', tag: '排程' },
    { t:10800, from: 'sched', to: 'safe',   type: 'handoff', text: '行程已生成 → 安全前置校核', tag: '协同' },
    { t:12000, from: 'safe',  to: 'field',  type: 'action',  text: '风险提示：午后高温 35°C · 提供防暑作业卡', tag: '安全' },
    { t:13400, from: 'field', to: 'pv',     type: 'query',   text: '现场咨询：热斑组件标准更换流程？', tag: '@光伏' },
    { t:14600, from: 'pv',    to: 'field',  type: 'answer',  text: '返回 SOP-PV-037 · 3 步标准化作业指引', tag: '知识' },
    { t:16000, from: 'field', to: 'query',  type: 'query',   text: '@问数 当前组串 30 天损失功率曲线？', tag: '@问数' },
    { t:17200, from: 'query', to: 'field',  type: 'answer',  text: '返回曲线 + 同比 -8.2% · 已嵌入工单', tag: '数据' },
    { t:18800, from: 'order', to: 'order',  type: 'action',  text: '辅助填报：自动带入诊断/排程/巡检证据链', tag: '工单' },
    { t:20200, from: 'order', to: 'order',  type: 'action',  text: '自动验收：影像与数据指标合格 ✓', tag: '验收' },
    { t:21400, from: 'order', to: 'ops',    type: 'handoff', text: '工单归档 → 运营 KPI 已回升', tag: '归档' },
  ],
};

// Scenario B: 巡检 → 无人机 → 图像诊断 → 工单 → 排程
const SCENARIO_B = {
  id: 'B', title: '场景 B · 无人机巡检 · 图像驱动',
  steps: [
    { t: 0,    from: 'insp',  to: 'insp',   type: 'action',  text: '生成日巡检计划 · 覆盖 18 个方阵', tag: '巡检' },
    { t: 1400, from: 'insp',  to: 'drone',  type: 'handoff', text: '下发任务 → 无人机 UAV-03', tag: '终端' },
    { t: 3000, from: 'drone', to: 'insp',   type: 'event',   text: '回传图像 1284 张 · 红外+可见光', tag: '采集' },
    { t: 4400, from: 'insp',  to: 'insp',   type: 'think',   text: '图像识别：发现 4 处热斑 · 2 处二极管异常', tag: '识别' },
    { t: 6000, from: 'insp',  to: 'diag',   type: 'handoff', text: '提交缺陷清单 → 请复核', tag: '协同' },
    { t: 7200, from: 'diag',  to: 'order',  type: 'handoff', text: '确认 5 项缺陷需现场处置', tag: '协同' },
    { t: 8400, from: 'order', to: 'order',  type: 'action',  text: '批量创建工单 ×5 · 关联缺陷影像', tag: '工单' },
    { t: 9800, from: 'order', to: 'sched',  type: 'handoff', text: '请求批量排程 → 同一行程合并', tag: '协同' },
    { t:11200, from: 'sched', to: 'field',  type: 'action',  text: '生成最优路径：1 人 · 1 车 · 142 min', tag: '排程' },
    { t:13000, from: 'order', to: 'ops',    type: 'handoff', text: '巡检闭环 → 5 项任务进入执行队列', tag: '归档' },
  ],
};

const SCENARIOS = [SCENARIO_A, SCENARIO_B];

// Global event templates — used to spawn left-side stream when no plant is focused
const GLOBAL_EVENT_TEMPLATES = [
  { agent: 'alert',  text: 'P3 · 直流汇流箱告警自动归并 → 1 条研判', sev: 'mid' },
  { agent: 'warn',   text: 'P1 · 子方阵 B-07 发电效能 ↓ 4.6% · 出预警', sev: 'mid' },
  { agent: 'insp',   text: 'P3 · 无人机 UAV-01 完成 18 方阵巡检', sev: 'low' },
  { agent: 'diag',   text: 'P2 · 诊断热斑 ×3 · 损失电量 ≈ 218 kWh', sev: 'mid' },
  { agent: 'order',  text: 'P5 · 工单 WO-26052-201 自动验收通过', sev: 'low' },
  { agent: 'sched',  text: 'P4 · 跨站行程合并 · 节省里程 38 km', sev: 'low' },
  { agent: 'safe',   text: 'P1 · 雷雨临近 · 暂停 2 项登高作业', sev: 'high' },
  { agent: 'query',  text: 'P3 · 张工 @问数 "本月 PR 同比" · 已返回', sev: 'low' },
  { agent: 'pv',     text: 'P2 · 新人 @光伏 "组串绝缘检测流程"', sev: 'low' },
  { agent: 'ops',    text: '租户 ILP · 月度可用率 99.41% · 达标', sev: 'low' },
  { agent: 'alert',  text: 'P6 · 通信中断 12 min → 已自愈', sev: 'mid' },
  { agent: 'warn',   text: 'P7 · IV 曲线偏移预警 · 转诊断', sev: 'mid' },
];

// Recommended quick prompts for the right-side dispatch console
const QUICK_PROMPTS = [
  { a: 'ops',   t: '生成今日 iRun 日报' },
  { a: 'query', t: '本月各电站 PR 排名？' },
  { a: 'warn',  t: '巡查 P1 全部组串效能' },
  { a: 'insp',  t: '为 P1 编排明日无人机巡检' },
  { a: 'sched', t: '合并 P1、P5 的 3 张工单' },
  { a: 'safe',  t: '检视未来 24h 高风险作业' },
];

window.IRUN = {
  AGENT_CATEGORIES, AGENTS, AGENT_BY_ID,
  TENANTS, PLANTS, AGGREGATE,
  SCENARIOS, SCENARIO_A, SCENARIO_B,
  GLOBAL_EVENT_TEMPLATES, QUICK_PROMPTS,
};
