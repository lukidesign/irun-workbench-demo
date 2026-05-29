// iRun Workbench — data layer
// All shared constants live here so components stay declarative.


const AGENT_CATEGORIES = {
  tool:       { label: '工具型', enLabel: 'Tool',       cn: '工具', hue: 188, color: '#22d3ee', soft: 'rgba(34,211,238,0.16)' },
  expert:     { label: '专家型', enLabel: 'Expert',     cn: '专家', hue:  38, color: '#fbbf24', soft: 'rgba(251,191,36,0.16)' },
  process:    { label: '流程型', enLabel: 'Process',    cn: '流程', hue: 268, color: '#a78bfa', soft: 'rgba(167,139,250,0.16)' },
  management: { label: '管理型', enLabel: 'Management', cn: '管理', hue: 158, color: '#34d399', soft: 'rgba(52,211,153,0.16)' },
};

const AGENTS = [
  { id: 'alert',   name: '告警智能体',   enName: 'Alarm Agent',     short: '告警', en: 'Alarm',    code: 'ALT', cat: 'process', notif: 2,
    role: '数字监控员', enRole: 'Digital Monitor',
    intro: '7×24 实时跟踪告警/离线/算法预警，智能去噪研判并输出处置建议。',
    enIntro: '24/7 real-time tracking of alarms, offline events and algorithmic warnings; auto-denoises, reviews, and recommends actions.',
    skills: ['事件去噪', '智能研判', '处置建议', '事件升级'],
    enSkills: ['Denoise', 'Auto-Review', 'Action Hints', 'Escalation'],
    metrics: { todayCalls: 612, tokens: '88.9K', success: 96.4 } },
  { id: 'order',   name: '工单智能体',   enName: 'Ticket Agent',    short: '工单', en: 'Ticket',   code: 'ORD', cat: 'process', notif: 0,
    role: '工单全流程引擎', enRole: 'Ticket Workflow Engine',
    intro: '覆盖工单全生命周期：自动创建、智能派单、智能辅助填报、自动验收。',
    enIntro: 'Covers the full ticket lifecycle: auto-create, smart dispatch, assisted filing, and auto-acceptance.',
    skills: ['自动创建', '智能派单', '辅助填报', '自动验收'],
    enSkills: ['Auto-Create', 'Smart Dispatch', 'Assisted Filing', 'Auto-Accept'],
    metrics: { todayCalls: 244, tokens: '41.2K', success: 98.1 } },
  { id: 'sched',   name: '排程智能体',   enName: 'Schedule Agent',  short: '排程', en: 'Schedule', code: 'SCH', cat: 'process', notif: 0,
    role: '资源调度指挥官', enRole: 'Resource Dispatch Commander',
    intro: '基于工单优先级、人员技能、天气路况动态生成最优人力/物资/行程方案。',
    enIntro: 'Dynamically generates optimal staffing / material / routing plans based on ticket priority, crew skills, weather and traffic.',
    skills: ['人力调配', '物资调度', '行程规划', '路径最优'],
    enSkills: ['Staffing', 'Material Dispatch', 'Trip Planning', 'Route Optim.'],
    metrics: { todayCalls: 173, tokens: '28.5K', success: 97.3 } },
  { id: 'warn',    name: '预警智能体',   enName: 'Predict Agent',   short: '预警', en: 'Predict',  code: 'WRN', cat: 'expert', notif: 1,
    role: '电站性能哨兵', enRole: 'Plant Performance Sentinel',
    intro: '识别尚未达到故障阈值但已出现趋势性劣化的运行状态，输出预警信号与初步归因。',
    enIntro: 'Detects trending degradation before fault thresholds are hit; emits early warnings with preliminary root-cause hints.',
    skills: ['低效预警', '趋势识别', '初步归因', '损失量化'],
    enSkills: ['Low-Yield Alert', 'Trend Detect', 'Cause Hint', 'Loss Quant.'],
    metrics: { todayCalls: 318, tokens: '54.1K', success: 97.6 } },
  { id: 'insp',    name: '巡检智能体',   enName: 'Inspect Agent',   short: '巡检', en: 'Inspect',  code: 'INS', cat: 'expert', notif: 0,
    role: '无人机巡检专家', enRole: 'UAV Inspection Specialist',
    intro: '自动分析无人机/摄像头/人工巡检图像，识别二极管故障、异物遮挡、热斑等缺陷。',
    enIntro: 'Auto-analyzes UAV / camera / manual inspection images to detect diode faults, obstructions, hot-spots and other defects.',
    skills: ['图像识别', '缺陷分类', '智能验收', '报告生成'],
    enSkills: ['Vision', 'Defect Class.', 'Auto-Accept', 'Reporting'],
    metrics: { todayCalls: 64, tokens: '94.2K', success: 96.9 } },
  { id: 'diag',    name: '诊断智能体',   enName: 'Diagnose Agent',  short: '诊断', en: 'Diagnose', code: 'DGN', cat: 'expert', notif: 0,
    role: '电站技术专家', enRole: 'Plant Technical Expert',
    intro: '基于运行数据与故障码图谱进行深度诊断，输出结论（如热斑/弃光/遮挡）及处理建议。',
    enIntro: 'Runs deep diagnostics over operating data and fault-code graphs; outputs conclusions (hot-spot / curtailment / shading) with action advice.',
    skills: ['故障诊断', '损失电量量化', '专家经验沉淀', '处置建议'],
    enSkills: ['Diagnostics', 'Loss kWh', 'Expert KB', 'Action Hints'],
    metrics: { todayCalls: 207, tokens: '76.3K', success: 95.8 } },
  { id: 'safe',    name: '安全智能体',   enName: 'Safety Agent',    short: '安全', en: 'Safety',   code: 'SAF', cat: 'expert', notif: 1,
    role: '作业与运行安全风险官', enRole: 'Safety & Risk Officer',
    intro: '融合环境与设备多源数据识别火灾、登高、恶劣天气等安全风险，作业前主动推送提示。',
    enIntro: 'Fuses environmental and equipment data to flag fire, height-work and severe-weather risks; proactively pushes pre-work advisories.',
    skills: ['火情识别', '作业风险研判', '气象联动', '应急升级'],
    enSkills: ['Fire Detect', 'Risk Review', 'Weather Link', 'Escalation'],
    metrics: { todayCalls: 86, tokens: '12.0K', success: 99.7 } },
  { id: 'pv',      name: '光伏助手智能体', enName: 'PV Assist Agent', short: '光伏', en: 'PV Assist', code: 'PVA', cat: 'tool', notif: 0,
    role: '光伏运维知识引擎', enRole: 'PV O&M Knowledge Engine',
    intro: '融合故障案例库、设备手册、运维规程、行业标准，针对运维全流程提供专业解答。',
    enIntro: 'Blends fault case libraries, equipment manuals, SOPs and industry standards to answer questions across the full O&M lifecycle.',
    skills: ['知识检索', '案例匹配', '规程问答', '隐性知识沉淀'],
    enSkills: ['KB Search', 'Case Match', 'SOP Q&A', 'Tacit Capture'],
    metrics: { todayCalls: 287, tokens: '39.6K', success: 99.0 } },
  { id: 'query',   name: '问数智能体',   enName: 'Data Q&A Agent',  short: '问数', en: 'Data Q&A', code: 'QRY', cat: 'tool', notif: 0,
    role: '自然语言数据助手', enRole: 'NL Data Assistant',
    intro: '自然语言即问即答式数据查询与可视化，由"人寻数"转向"数寻人"。',
    enIntro: 'Natural-language ask-and-answer data queries with visualization — shifts the workflow from "humans seek data" to "data finds humans".',
    skills: ['NL2SQL', '页面感知', '可视化生成', '指标解释'],
    enSkills: ['NL2SQL', 'Page Aware', 'Auto-Charts', 'Metric Explain'],
    metrics: { todayCalls: 401, tokens: '32.7K', success: 98.9 } },
  { id: 'ops',     name: '运营智能体',   enName: 'Operate Agent',   short: '运营', en: 'Operate',  code: 'OPS', cat: 'management', notif: 0,
    role: '电站经营指挥官', enRole: 'Plant Operations Commander',
    intro: '聚焦电站长期运行效率与经营指标，对关键KPI持续监测预警，为管理决策提供量化依据。',
    enIntro: 'Focuses on long-term plant efficiency and business KPIs; continuously monitors critical metrics and quantifies inputs for management decisions.',
    skills: ['KPI 监测', '资产健康度', '收益洞察', '预防性维护建议'],
    enSkills: ['KPI Watch', 'Asset Health', 'Yield Insight', 'Preventive Maint.'],
    metrics: { todayCalls: 142, tokens: '23.4K', success: 99.2 } },
];

const AGENT_BY_ID = Object.fromEntries(AGENTS.map(a => [a.id, a]));

// Tenants
const TENANTS = [
  { id: 'ilp', name: 'International Landing Plants', region: 'SE-Asia', enRegion: 'SE-Asia' },
  { id: 'fux', name: '河源·福曦能源',                 region: '广东·河源', enRegion: 'Guangdong · Heyuan' },
  { id: 'rj',  name: '润建能源数字化研究院',           region: '广西·南宁', enRegion: 'Guangxi · Nanning' },
];

// Plants — positioned in the abstract map (vw% / vh% of map area)
// mapX / mapY → % position on map2 city background (per-tenant; tenants don't share pins)
const PLANTS = [
  // ── Tenant: ILP (International Landing Plants) · 7 plants ───────────────
  { id: '1879736396404850688', name: '', enName: '',    short: 'Banten-A',  tenant: 'ilp', region: 'Indonesia·万丹',  enRegion: 'Indonesia · Banten',   city: '万丹',     enCity: 'Banten',
    capacity: 50.0, power: 0, gen: 218.4, alerts: 3, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 78, y: 68, mapX: '62%', mapY: '55%',
    agents: ['ops','warn','alert','diag','order','sched','insp','query'],
    defaultScenarioIdx: 1,
    robotField: [
      { agent:'insp',  x:53, y:44 },
      { agent:'drone', x:65, y:33 },
      { agent:'diag',  x:46, y:51 },
      { agent:'order', x:38, y:24 },
      { agent:'sched', x:50, y:18 },
      { agent:'ops',   x:70, y:28 },
    ],
  },

  { id: '1861683646672760832', name: '', enName: '', short: 'Cebu-N',   tenant: 'ilp', region: 'Philippines·宿务', enRegion: 'Philippines · Cebu',   city: '宿务',     enCity: 'Cebu',
    capacity: 42.0, power:0, gen: 184.5, alerts: 5, risk: 'high', status: '指挥模式', enStatus: 'Command Mode',
    x: 84, y: 54, mapX: '82%', mapY: '52%', agents: ['ops','warn','alert','diag','order','sched'] },

  { id: '1881233694553112576', name: '', enName: '',    short: 'Selangor',  tenant: 'ilp', region: 'Malaysia·吉隆坡', enRegion: 'Malaysia · Kuala Lumpur', city: '吉隆坡', enCity: 'Kuala Lumpur',
    capacity: 36.5, power: 0, gen: 162.4, alertsPLANTS: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 64, y: 74, mapX: '41%', mapY: '68%',
    agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'],
    // 演示站：固定场景 A（告警驱动 · 自主闭环）
    defaultScenarioIdx: 0,
    // Multi-robot field — same logical layout as Hanoi-N (PV array + ops on top, field below)
    robotField: [
      { agent:'insp',  x:53, y:44 },  // 巡检 — 阵列中央（B 场景主角）
      { agent:'drone', x:65, y:33 },  // 无人机起降点
      { agent:'diag',  x:46, y:51 },  // 诊断 — 阵列中部靠左
      { agent:'alert', x:36, y:56 },  // 告警 — 阵列左侧中段
      { agent:'warn',  x:30, y:48 },  // 预警 — 左边缘中段
      { agent:'order', x:38, y:24 },  // 工单 — 阵列上部偏左
      { agent:'sched', x:50, y:18 },  // 排程 — 阵列顶部中央
      { agent:'safe',  x:43, y:58 },  // 安全 — 阵列下通道
      { agent:'pv',    x:57, y:57 },  // 光伏助手 — 阵列下部
      { agent:'query', x:60, y:22 },  // 问数 — 阵列上部中右
      { agent:'ops',   x:70, y:28 },  // 运营 — 阵列上部右侧
    ],
  },

  { id: '1879736315115044864', name: '', enName: '', short: 'Manila-E',  tenant: 'ilp', region: 'Philippines·马尼拉', enRegion: 'Philippines · Manila', city: '马尼拉', enCity: 'Manila',
    capacity: 38.0, power: 0, gen: 158.0, alerts: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 70, y: 78, mapX: '42%', mapY: '37%', agents: ['ops','warn','alert','diag','order','sched','query'] },

  { id: '1879736307422691328', name: '', enName: '',  short: 'Penang-W',  tenant: 'ilp', region: 'Malaysia·槟城',  enRegion: 'Malaysia · Penang',    city: '槟城',     enCity: 'Penang',
    capacity: 32.0, power: 0, gen: 138.0, alerts: 3, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 55, y: 32, mapX: '27%', mapY: '55%',
    agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'],
    // Default to Scenario B (UAV inspection — FPV water-surface site)
    defaultScenarioIdx: 1,
    // Multi-robot field — Penang FPV 水面光伏巡检场景
    robotField: [
      { agent:'insp',  x:52, y:42 },  // 巡检 — 水面阵列中央（B 场景主角）
      { agent:'drone', x:64, y:32 },  // 无人机起降点 — 右上角起降区
      { agent:'diag',  x:44, y:50 },  // 诊断 — 阵列中部靠左
      { agent:'alert', x:35, y:55 },  // 告警 — 左侧监控区
      { agent:'warn',  x:29, y:46 },  // 预警 — 左边缘
      { agent:'order', x:37, y:23 },  // 工单 — 上部偏左
      { agent:'sched', x:49, y:17 },  // 排程 — 顶部中央
      { agent:'safe',  x:42, y:57 },  // 安全 — 下方通道（水上作业安全）
      { agent:'pv',    x:56, y:56 },  // 光伏助手 — 下部右侧
      { agent:'query', x:60, y:21 },  // 问数 — 上部中右
      { agent:'ops',   x:69, y:27 },  // 运营 — 右上部
    ],
  },
];

// Compute aggregate KPIs for a subset of plants (used by TopBar per-tenant)
function aggregateOf(plants){
  return {
    plants: plants.length,
    capacity: plants.reduce((s,p)=>s+p.capacity,0),
    power:    plants.reduce((s,p)=>s+p.power,0),
    gen:      plants.reduce((s,p)=>s+p.gen,0),
    alerts:   plants.reduce((s,p)=>s+p.alerts,0),
    risk:     plants.filter(p=>p.risk==='high').length + Math.min(1, plants.filter(p=>p.risk==='mid').length>=2?1:0),
  };
}

// Default top-bar aggregate (kept for back-compat — full set across all tenants)
const AGGREGATE = aggregateOf(PLANTS);

const SCENARIO_A = {
  id: 'A', title: '场景 A · 告警驱动 · 自主闭环', enTitle: 'Scenario A · Alarm-Driven · Self-Closure',
  steps: [
    { t: 0,    from: 'plant', to: 'alert',  type: 'event',   text: '组串 #C03-12 电流异常 / 低效预警 ×3',          en: 'String #C03-12 current anomaly / low-yield warning ×3',     tag: '原始事件', entag: 'Raw Event' },
    { t: 1500, from: 'alert', to: 'alert',  type: 'think',   text: '聚类去噪：3 条事件归为同一组串问题',           en: 'Denoise: 3 events merged into one string issue',             tag: '事件研判', entag: 'Review' },
    { t: 3000, from: 'alert', to: 'diag',   type: 'handoff', text: '移交诊断 → 请确认根因',                          en: 'Handoff to Diagnose → confirm root cause',                   tag: '协同',     entag: 'Handoff' },
    { t: 4200, from: 'diag',  to: 'diag',   type: 'think',   text: '比对故障码图谱 → 疑似 热斑 + 局部遮挡',         en: 'Match fault-code graph → likely hot-spot + partial shading', tag: '深度诊断', entag: 'Deep Dx' },
    { t: 5800, from: 'diag',  to: 'order',  type: 'handoff', text: '诊断结论：热斑 / 损失 ≈ 142 kWh·d',              en: 'Diagnosis: hot-spot / loss ≈ 142 kWh·d',                     tag: '协同',     entag: 'Handoff' },
    { t: 7000, from: 'order', to: 'order',  type: 'action',  text: '创建工单 WO-26052-019 · 优先级 P2',              en: 'Create ticket WO-26052-019 · priority P2',                   tag: '工单',     entag: 'Ticket' },
    { t: 8200, from: 'order', to: 'sched',  type: 'handoff', text: '请求资源排程 · 技能：组串清理',                 en: 'Request scheduling · skill: string cleaning',                tag: '协同',     entag: 'Handoff' },
    { t: 9400, from: 'sched', to: 'sched',  type: 'think',   text: '匹配运维员 张磊（距站 18min）+ 备件 J-204',      en: 'Match technician Zhang Lei (18min away) + spare J-204',      tag: '排程',     entag: 'Schedule' },
    { t:10800, from: 'sched', to: 'safe',   type: 'handoff', text: '行程已生成 → 安全前置校核',                       en: 'Route ready → safety pre-check',                             tag: '协同',     entag: 'Handoff' },
    { t:12000, from: 'safe',  to: 'field',  type: 'action',  text: '风险提示：午后高温 35°C · 提供防暑作业卡',       en: 'Risk note: afternoon 35°C heat · heat-stress card issued',   tag: '安全',     entag: 'Safety' },
    { t:13400, from: 'field', to: 'pv',     type: 'query',   text: '现场咨询：热斑组件标准更换流程？',                en: 'Field query: standard procedure to replace hot-spot module?', tag: '@光伏',   entag: '@PV' },
    { t:14600, from: 'pv',    to: 'field',  type: 'answer',  text: '返回 SOP-PV-037 · 3 步标准化作业指引',           en: 'Reply: SOP-PV-037 · 3-step standardized procedure',          tag: '知识',     entag: 'Knowledge' },
    { t:16000, from: 'field', to: 'query',  type: 'query',   text: '@问数 当前组串 30 天损失功率曲线？',             en: '@Data Q&A 30-day power-loss curve of this string?',          tag: '@问数',   entag: '@Data Q&A' },
    { t:17200, from: 'query', to: 'field',  type: 'answer',  text: '返回曲线 + 同比 -8.2% · 已嵌入工单',             en: 'Curve returned + YoY -8.2% · embedded into ticket',          tag: '数据',     entag: 'Data' },
    { t:18800, from: 'order', to: 'order',  type: 'action',  text: '辅助填报：自动带入诊断/排程/巡检证据链',         en: 'Assisted filing: auto-attach diagnose/sched/inspect evidence', tag: '工单',   entag: 'Ticket' },
    { t:20200, from: 'order', to: 'order',  type: 'action',  text: '自动验收：影像与数据指标合格 ✓',                  en: 'Auto-accept: imagery & metrics pass ✓',                      tag: '验收',     entag: 'Accept' },
    { t:21400, from: 'order', to: 'ops',    type: 'handoff', text: '工单归档 → 运营 KPI 已回升',                     en: 'Ticket archived → ops KPI recovered',                        tag: '归档',     entag: 'Archive' },
  ],
};

// Scenario B: 巡检 → 无人机 → 图像诊断 → 工单 → 排程
const SCENARIO_B = {
  id: 'B', title: '场景 B · 无人机巡检 · 图像驱动', enTitle: 'Scenario B · UAV Inspection · Vision-Driven',
  steps: [
    { t: 0,    from: 'insp',  to: 'insp',   type: 'action',  text: '生成日巡检计划 · 覆盖 18 个方阵',                 en: 'Daily inspection plan · covering 18 arrays',                 tag: '巡检',     entag: 'Inspect' },
    { t: 1400, from: 'insp',  to: 'drone',  type: 'handoff', text: '下发任务 → 无人机 UAV-03',                        en: 'Dispatch task → UAV-03',                                     tag: '终端',     entag: 'Edge' },
    { t: 3000, from: 'drone', to: 'insp',   type: 'event',   text: '回传图像 1284 张 · 红外+可见光',                  en: '1284 images returned · IR + visible',                        tag: '采集',     entag: 'Capture' },
    { t: 4400, from: 'insp',  to: 'insp',   type: 'think',   text: '图像识别：发现 4 处热斑 · 2 处二极管异常',         en: 'Vision: 4 hot-spots · 2 diode anomalies',                    tag: '识别',     entag: 'Detect' },
    { t: 6000, from: 'insp',  to: 'diag',   type: 'handoff', text: '提交缺陷清单 → 请复核',                            en: 'Submit defect list → please review',                         tag: '协同',     entag: 'Handoff' },
    { t: 7200, from: 'diag',  to: 'order',  type: 'handoff', text: '确认 5 项缺陷需现场处置',                          en: 'Confirmed 5 defects need on-site action',                    tag: '协同',     entag: 'Handoff' },
    { t: 8400, from: 'order', to: 'order',  type: 'action',  text: '批量创建工单 ×5 · 关联缺陷影像',                  en: 'Bulk-create 5 tickets · linked defect imagery',              tag: '工单',     entag: 'Ticket' },
    { t: 9800, from: 'order', to: 'sched',  type: 'handoff', text: '请求批量排程 → 同一行程合并',                     en: 'Request bulk scheduling → merge into one trip',              tag: '协同',     entag: 'Handoff' },
    { t:11200, from: 'sched', to: 'field',  type: 'action',  text: '生成最优路径：1 人 · 1 车 · 142 min',              en: 'Optimal route: 1 person · 1 vehicle · 142 min',              tag: '排程',     entag: 'Schedule' },
    { t:13000, from: 'order', to: 'ops',    type: 'handoff', text: '巡检闭环 → 5 项任务进入执行队列',                 en: 'Inspection closed → 5 tasks queued for execution',           tag: '归档',     entag: 'Archive' },
  ],
};

const SCENARIOS = [SCENARIO_A, SCENARIO_B];

// Global event templates — 左侧「实时事件流」唯一数据源（按 date 时间序展示）
const GLOBAL_EVENT_TEMPLATES = [
    // ── 05-25 Penang 水面 · 精简消缺 ──
 { date: '2026-05-25 08:00:00', agent: 'diag', text: '【Penang·消缺】接入 3 条告警 · 根因：水面高湿致绝缘/接头腐蚀', en: 'Penang-FPV · 3 alerts diagnosed · humidity-driven insulation/connector corrosion', sev: 'mid' },
 { date: '2026-05-25 08:05:00', agent: 'alert', text: '【Penang·消缺】关联历史工单+72h研判（3 条）· 绝缘故障优先', en: 'Penang-FPV · 3 alerts reviewed w/ history · insulation fault first', sev: 'mid' },
 { date: '2026-05-25 08:06:00', agent: 'alert', text: '【Penang·消缺】研判总结 · 同站 1 工单 · 合并 CB1-3 历史单', en: 'Penang-FPV · summary · 1 site ticket · merged CB1-3 legacy', sev: 'mid' },
 { date: '2026-05-25 08:10:00', agent: 'order', text: '【Penang·消缺】创建工单 WO-2026-0610-PNG-001 · 3 任务项', en: 'Penang-FPV · Ticket WO-2026-0610-PNG-001 created · 3 tasks', sev: 'low' },
 // ── 05-26 ──
 { date: '2026-05-26 09:30:00', agent: 'pv', text: '【Penang·消缺】@光伏 "绝缘排查/电流不平衡/换熔丝"', en: 'Penang-FPV · @PV-Assist "insulation, current imbalance, fuse swap"', sev: 'low' },
 { date: '2026-05-26 15:20:00', agent: 'order', text: '【Penang·消缺】3 任务项回单 · 接头进水/熔丝已处理', en: 'Penang-FPV · 3 tasks reported · water-ingress & fuse fixed', sev: 'low' },
 { date: '2026-05-26 17:30:00', agent: 'order', text: '【Penang·消缺】自动验收归档 · 挽回 ≈ 2,600 kWh/月', en: 'Penang-FPV · auto-accepted & archived · ≈ 2,600 kWh/mo recovered', sev: 'low' },
 // ── 05-28 Johor 消缺触发 ＋ Penang 巡检计划（并行）──
 { date: '2026-05-28 02:00:00', agent: 'ops', text: '【Johor·消缺】⚠ KPI 考核预警 · 风险严重', en: 'Johor · KPI assessment alert · severe', sev: 'high' },
 { date: '2026-05-28 02:00:00', agent: 'ops', text: '【Penang·巡检】季度巡检到期 · 健康度 87.0 分', en: 'Penang-UAV · quarterly inspection due · health 87.0', sev: 'low' },
 { date: '2026-05-28 02:01:06', agent: 'query', text: '【Penang·巡检】调取历史巡检 · 遗留 2 处 PID 待复核', en: 'Penang-UAV · history pulled · 2 legacy PID to recheck', sev: 'low' },
 { date: '2026-05-28 02:05:00', agent: 'order', text: '【Penang·巡检】生成季度巡检计划（草案）', en: 'Penang-UAV · quarterly inspection plan drafted', sev: 'low' },
 { date: '2026-05-28 02:08:00', agent: 'sched', text: '【Penang·巡检】天气/水域窗口 · 05-30 晴低浪最佳', en: 'Penang-UAV · weather/water window · 05-30 best', sev: 'low' },
 { date: '2026-05-28 03:00:04', agent: 'warn', text: '【Johor·消缺】5 台逆变器组串低效', en: 'Johor · 5 inverters with string under-performance', sev: 'mid' },
 { date: '2026-05-28 03:30:09', agent: 'query', text: '【Johor·消缺】拉取告警台账 · 6 未处理 + 1 处理中', en: 'Johor · alert ledger · 6 open + 1 in-progress', sev: 'low' },
 { date: '2026-05-28 03:31:00', agent: 'diag', text: '【Johor·消缺】低效根因完成 · 热斑/遮挡为主', en: 'Johor · root-cause done · hot-spot/shading dominant', sev: 'mid' },
 { date: '2026-05-28 03:31:30', agent: 'diag', text: '【Johor·消缺】5 台设备告警原因分析完成', en: 'Johor · 5 device alert causes analyzed', sev: 'mid' },
 { date: '2026-05-28 03:33:00', agent: 'alert', text: '【Johor·消缺】72h 研判（7 台）· 1 观察 6 消缺', en: 'Johor · 7 units reviewed · 1 watch / 6 fix', sev: 'mid' },
 { date: '2026-05-28 03:33:40', agent: 'alert', text: '【Johor·消缺】研判总结 · 同站 1 工单 · 合并 WO-2026-0520-008', en: 'Johor · summary · 1 site ticket · merged WO-2026-0520-008', sev: 'mid' },
 { date: '2026-05-28 08:00:00', agent: 'order', text: '【Johor·消缺】发起建单 · 并行调用排程/安全', en: 'Johor · ticket init · calling Schedule/Safety', sev: 'low' },
 { date: '2026-05-28 08:00:08', agent: 'sched', text: '【Johor·消缺】人员/技能/天气匹配 · 含路径规划', en: 'Johor · staff/skill/weather matched · route planned', sev: 'low' },
 { date: '2026-05-28 08:05:22', agent: 'safe', text: '【Johor·消缺】作业风险校验 · 整单中高（登高/直流高压）', en: 'Johor · risk check · med-high (climbing/DC HV)', sev: 'mid' },
 { date: '2026-05-28 08:05:40', agent: 'order', text: '【Johor·消缺】工单 WO-2026-0528-001 创建 · 6 任务项', en: 'Johor · Ticket WO-2026-0528-001 created · 6 tasks', sev: 'low' },
 { date: '2026-05-28 14:35:00', agent: 'pv', text: '【Johor·消缺】王工 @光伏 "离线排查 + 换卡恢复"', en: 'Johor · Wang @PV-Assist "offline triage + SIM swap"', sev: 'low' },
 // ── 05-29 Johor 收尾 ＋ Penang 巡检任务下发 ──
 { date: '2026-05-29 08:00:00', agent: 'order', text: '【Penang·巡检】创建无人机任务 INSP-2026-0530-PNG-F01', en: 'Penang-UAV · drone task INSP-2026-0530-PNG-F01 created', sev: 'low' },
 { date: '2026-05-29 09:50:00', agent: 'pv', text: '【Johor·消缺】张工 @光伏 "绝缘测试 + 接头/组件判别"', en: 'Johor · Zhang @PV-Assist "insulation test + connector vs module"', sev: 'low' },
 { date: '2026-05-29 13:35:00', agent: 'pv', text: '【Johor·消缺】李工 @光伏 "散热确认 + 登高遮挡排查"', en: 'Johor · Li @PV-Assist "cooling check + climb shading"', sev: 'low' },
 { date: '2026-05-29 15:10:00', agent: 'order', text: '【Johor·消缺】任务项① COM1-2 回单 · 离线已恢复', en: 'Johor · task① COM1-2 reported · back online', sev: 'low' },
 { date: '2026-05-29 15:12:00', agent: 'order', text: '【Johor·消缺】任务项②③④ COM1-3/4/5 回单 · 接入异常消除', en: 'Johor · task②③④ COM1-3/4/5 · access fault cleared', sev: 'low' },
 { date: '2026-05-29 15:15:00', agent: 'order', text: '【Johor·消缺】任务项⑤⑥ COM1-6/7 回单 · 散热/遮挡消除', en: 'Johor · task⑤⑥ COM1-6/7 · cooling/shading cleared', sev: 'low' },
 { date: '2026-05-29 15:30:00', agent: 'order', text: '【Johor·消缺】整单验收归档 · 回补 ≈ 9000~12000 kWh', en: 'Johor · ticket accepted & archived · ≈ 9-12 MWh recovered', sev: 'low' },
 // ── 05-30 Penang 无人机执行/分析/派单 ＋ Johor 观察 D+1 ──
 { date: '2026-05-30 10:25:00', agent: 'insp', text: '【Penang·巡检】UAV 接收任务 · 起飞前自检通过', en: 'Penang-UAV · task received · pre-flight check OK', sev: 'low' },
 { date: '2026-05-30 10:30:00', agent: 'insp', text: '【Penang·巡检】UAV 巡检中 · 双光实时回传', en: 'Penang-UAV · inspecting · dual-cam live feed', sev: 'low' },
 { date: '2026-05-30 13:50:00', agent: 'insp', text: '【Penang·巡检】UAV 巡检完成 · 回传 1,940 张', en: 'Penang-UAV · finished · 1,940 images uploaded', sev: 'low' },
 { date: '2026-05-30 13:55:00', agent: 'insp', text: '【Penang·巡检】图像分析中 · 红外测温 + AI 识别', en: 'Penang-UAV · analyzing · IR thermography + AI', sev: 'low' },
 { date: '2026-05-30 14:25:00', agent: 'insp', text: '【Penang·巡检】缺陷清单 18 处 · 缺陷率 0.37%', en: 'Penang-UAV · 18 defects found · rate 0.37%', sev: 'mid' },
 { date: '2026-05-30 14:55:00', agent: 'insp', text: '【Penang·巡检】巡检报告生成 RPT-A-PNG-2026-0530-001', en: 'Penang-UAV · report RPT-A-PNG-2026-0530-001 generated', sev: 'low' },
 { date: '2026-05-30 15:00:00', agent: 'order', text: '【Penang·巡检】18 缺陷归集 · 创建电站级消缺工单', en: 'Penang-UAV · 18 defects → 1 site fix ticket', sev: 'mid' },
 { date: '2026-05-30 15:06:00', agent: 'sched', text: '【Penang·巡检】人员/天气匹配 · 含工作艇路径', en: 'Penang-UAV · staff/weather matched · boat route', sev: 'low' },
 { date: '2026-05-30 15:14:00', agent: 'safe', text: '【Penang·巡检】风险校验 · 整单高（直流高压 + 水上溺水）', en: 'Penang-UAV · risk high (DC HV + water/drowning)', sev: 'high' },
 { date: '2026-05-30 15:25:00', agent: 'order', text: '【Penang·巡检】工单 WO-2026-0530-PNG-001 创建 · 5 任务项', en: 'Penang-UAV · Ticket WO-2026-0530-PNG-001 created · 5 tasks', sev: 'low' },
 { date: '2026-05-30 18:00:00', agent: 'ops', text: '【Johor·消缺】观察 D+1 · 告警/低效清零 · 发电 ↑19%', en: 'Johor · D+1 · alerts cleared · yield ↑19%', sev: 'low' },
 // ── 05-31 Penang 现场消缺 ＋ Johor 观察 D+2 ──
 { date: '2026-05-31 09:20:00', agent: 'pv', text: '【Penang·巡检】张工 @光伏 "热斑更换/二极管/PID 治理"', en: 'Penang-UAV · Zhang @PV-Assist "hot-spot/diode/PID"', sev: 'low' },
 { date: '2026-05-31 15:40:00', agent: 'order', text: '【Penang·巡检】回单 · Class3 全消缺 · PID 进入修复期', en: 'Penang-UAV · reported · Class3 cleared · PID in recovery', sev: 'low' },
 { date: '2026-05-31 18:00:00', agent: 'ops', text: '【Johor·消缺】观察 D+2 · 风险降级 · 偏差回补至 -16000 kWh', en: 'Johor · D+2 · risk downgraded · gap → -16,000 kWh', sev: 'low' },
 // ── 06-01 ~ 06-02 Penang 回灌 + 复盘 ──
 { date: '2026-06-01 11:00:00', agent: 'order', text: '【Penang·巡检】同步作业结果 → 巡检智能体 · 台账更新', en: 'Penang-UAV · results synced → Inspect · ledger updated', sev: 'low' },
 { date: '2026-06-02 01:00:00', agent: 'ops', text: '【Penang·巡检】消缺后 KPI 复盘 · 健康度 90.2 分', en: 'Penang-UAV · post-fix KPI review · health 90.2', sev: 'low' },
 { date: '2026-06-02 02:00:00', agent: 'order', text: '【Penang·巡检】更新下次巡检计划 · 下次 ≤ 2026-08-30', en: 'Penang-UAV · next inspection plan ≤ 2026-08-30', sev: 'low' },
];

// Recommended quick prompts for the right-side dispatch console
// PV Expo (2026) · recommended Q&A (CN+EN)
const PV_EXPO_QA = [
  {
    agent: 'pv',
    qZh: '光伏组件热斑',
    qEn: 'PV module hot spots?',
    aZh: `# 光伏组件热斑详解

## 基本概念
热斑效应是指在一定条件下，串联支路中被遮蔽的光伏组件作为负载消耗其他有光照组件产生的能量，导致被遮蔽组件发热升温，出现烧坏暗斑的现象。这种效应会严重破坏太阳能电池。

## 典型表现
1. **随机分布热斑点**：组件出现多个随机分布的热斑，通常由电池片虚焊、隐裂或断栅等问题引起，局部高温可达100℃以上。

![image](assets/pv-expo/751cbbb9-8683-4d77-89e3-6a5be24bf9e3.png)

2. **焊接不良热斑**：焊带焊接问题导致的热斑灼伤，可能烧穿背板。

![image](assets/pv-expo/c1c364a0-0855-40ee-a641-872803121b89.png)

3. **电池低效混挡**：组件中混入低效电池片导致的条状热斑，同时接线盒温度升高。

4. **裂片或虚焊**：电池片破裂或虚焊导致的热斑。

![image](assets/pv-expo/6b38aa19-a49a-4237-9ada-62b95c5e553a.png)

5. **接线盒高温**：表面无热斑但接线盒内部二极管发热。

![image](assets/pv-expo/643480fd-b4f2-4c5e-868f-7d45b0592b3f.png)

6. **块状热斑**：电池片整片高温，清除遮挡后逐渐降温。

![image](assets/pv-expo/d46d1947-9d02-49b9-b9d5-9f579092965b.png)

## 故障原因
### 外部原因
- 组件表面积灰厚薄不均
- 鸟粪、污物、落叶等异物遮挡
- 周边草木、建筑物或电线杆阴影
- 场地不平整或方阵间距不足导致的自阴影

### 内部原因
- 生产制造工艺缺陷（焊接和层压问题）
- 电池片质量问题（反向特性差、边缘漏电流大）
- 电池片内在缺陷

## 检测方法
1. **红外热成像检测**：异常电池片温度显著高于其他电池片。

![image](assets/pv-expo/071a3c0e-26fc-4f3b-9124-4ed00a09aa15.png)

2. **目视检查**：如发现组件背板灼伤发黄、玻璃碎裂等明显损伤。

## 危害影响
- 被遮挡组件消耗有光照组件产生的能量
- 降低系统输出功率
- 可能导致组件永久性损坏甚至烧毁
- 高温可能引发玻璃爆裂、背板老化

## 预防措施
1. 及时清除组件附近杂草、灰尘、鸟粪等异物
2. 合理设定组件清洗时间，避免低温结冰
3. 搬运时避免碰撞，禁止在组件上站立或坐卧
4. 组件接线盒加装旁路二极管
5. 加强巡检和组件清洁维护

## 处理方法
1. 断开相关电气连接并采取安全措施
2. 更换受损组件
3. 更换后检查电压是否正常
4. 确认无接地情况后恢复系统运行

---

>**来源**: 润建新能源运维知识库`,
    aEn: `Here are the manifestations and causes of PV module hot spots, categorized into 6 types with internal/external causes and case analysis:

**1. Hot Spot Manifestations**  
(1) **Randomly Distributed Hot Spots**  
- Caused by cell defects: poor soldering, microcracks, broken grids  
- Local temperatures exceed 100°C, risking glass rupture, backsheet degradation, or fire  
![image](assets/pv-expo/5a6df795-6b19-45d3-bff8-73e875785e76.png)  

(2) **Soldering Defects**  
- Manual soldering errors (V-shaped microcracks from improper start points or excessive pressure)  
- Leads to backsheet burn-through  

(3) **Mixed Low-Efficiency Cells**  
- One/two low-performance cells mixed in a module  
- Causes junction box temperature rise  

(4) **Cracked Cells/Poor Soldering**  
- Visible cell fractures or weak solder joints  

(5) **Junction Box Overheating**  
- No visible cell hot spots but high junction box temperature  
- Causes: Faulty diodes or loose connections increasing contact resistance  

(6) **Block-Shaped Hot Spots**  
- Entire cell overheating; dust removal reveals localized defects  

**2. Internal Causes**  
- Manufacturing flaws (soldering/lamination defects)  
- Cell quality issues (poor reverse characteristics, excessive edge leakage current)  
- Long-term reliability hazard, limiting string output  

**3. External Causes**  
- Uneven dust accumulation, bird droppings, leaves, vegetation shadows  
- Structural shading (buildings, poles), terrain shadows  
- Reverse bias in shaded cells converts power to heat  

**4. Detection & Prevention**  
- **Detection**: Infrared thermography (best performed at dawn)  
  - Abnormal cell temperature indicates hot spots  
- **Prevention**:  
  - Regular cleaning/weed removal  
  - Proper spacing during installation  
  - Avoid mechanical stress during handling  

**Case Example**  
- **Issue**: 20MWp plant showed 5A current drop in a string  
- **Findings**: Bird droppings caused 45°C hot spot, glass shattered  
- **Solution**: Replaced damaged module; restored current balance  
![image](assets/pv-expo/e0e465ad-67e3-4b16-8087-83376fc73eb4.png)  

**Key Impact**: Hot spots permanently damage cells, reduce output, and may cause fires. Bypass diodes mitigate but cannot eliminate risks.

---

>**Source**: RunDo Renewable O&M Knowledge Base`,
  },
  {
    agent: 'pv',
    qZh: '如何更换损坏组件?',
    qEn: 'How to replace damaged PV modules?',
    aZh: `### 更换损坏光伏组件的标准流程及注意事项

---

#### 一、安全准备
1. 断电操作  
   - 断开对应汇流箱断路器及支路熔断器  
   - 拔除待更换组件所在组串的正负极连接器（MC4接头）  
   - 使用绝缘手套和工具，避免电弧风险  
   ![image](assets/pv-expo/5b3ce999-8984-405b-870e-23cec26522e5.png)\n   ![image](assets/pv-expo/5575ae87-37dd-4113-8535-08b69e797e72.png)

2. 设备检查  
   - 确认新组件型号、规格与原组件一致  
   - 检查支架结构稳定性，如发现锈蚀或变形需先处理（参考支架缺陷修复措施）

---

#### 二、组件拆卸
1. 机械固定解除  
   - 螺栓安装型：松开边框4个安装孔不锈钢螺栓  
   ![image](assets/pv-expo/2171d1f0-65c3-4814-8fc1-24d3c17c3156.png)  
   - 压块安装型：拆除压块时需确保相邻组件固定（重合部分至少宽度5mm、长度30mm）  
   ![image](assets/pv-expo/1018270c-c0a9-42a7-8792-62ad8ba2089d.png)

2. 电气分离  
   - 记录原组件接线顺序（正负极连接方向）  
   - 使用专用工具断开接线盒电缆连接  

---

#### 三、新组件安装
1. 机械固定  
   - 按原安装方式恢复（螺栓扭矩需符合厂家要求）  
   - 跟踪支架需同步检查横梁平整度，必要时加装钢制夹板或垫高组件  
   ![image](assets/pv-expo/7adae9f2-6b60-44be-87ee-9cb51a40ca50.png)  \n+   ![image](assets/pv-expo/50755a77-9658-4e07-bbbd-13e8315aaf80.png)

2. 电气连接  
   - 按原组串顺序恢复正负极连接（交叉跨越接线需特别注意）  
   ![image](assets/pv-expo/1811499d-dd33-4a7e-bd5d-eb01267d12a8.png)  
   - 接线盒密封性测试，避免进水  

---

#### 四、调试与验证
1. 功能测试  
   - 红外热成像仪检测新组件无热斑（温差＜20℃）  
   - 钳形表测量组串电流偏差≤5%  

2. 记录归档  
   - 更新组件更换日志，包括序列号、位置、测试数据  

---

#### 关键注意事项  
- 禁止操作：带电插拔连接器、徒手接触破损组件（可能存在玻璃碎片及直流漏电风险）  
- 环境要求：大风/雷雨天气禁止作业，建议清晨或阴天更换  
- 特殊支架：平单轴跟踪系统需先解除推拉杆联动，调整轴承立柱垂直度  
   ![image](assets/pv-expo/f4ea7975-cf6b-453c-901b-6e6850351e9f.png)

---

>来源: 润建新能源运维知识库`,
    aEn: `1. **Safety Precautions**:  
   - Disconnect the corresponding circuit breaker in the combiner box, branch fuse, and the PV module connector linked to the damaged module.

2. **Inspection & Preparation**:  
   - Ensure the replacement module is of the same model and specifications as the damaged one.  
   - Verify the new module’s integrity (no cracks, cable damage, junction box deformation, or backsheet burns).  

3. **Component Removal**:  
   - Carefully detach the damaged module from the mounting structure, avoiding stress on adjacent modules.  
   - Disconnect all electrical connections (cables, junction box links).  

4. **Structural & Electrical Checks**:  
   - Inspect the mounting structure for deformation or corrosion. Reinforce or replace if necessary.  
   - Confirm proper grounding of the metal frame (contact resistance ≤4Ω).  

5. **Installation**:  
   - Secure the new module to the structure, ensuring bolts are tightened (use double nuts if required).  
   - Reconnect electrical wiring, ensuring firm connections and intact insulation.  

6. **Post-Replacement Testing**:  
   - Measure the string’s DC voltage (e.g., ~780V for a typical string) and check grounding.  
   - Use an infrared thermal imager to detect abnormal heating in the junction box or connections.  

7. **Documentation & Follow-Up**:  
   - Record the replacement details (module serial number, location).  
   - Schedule periodic inspections to monitor performance and connection stability.  

**Critical Notes**:  
- Replace modules with identical electrical characteristics to avoid mismatches in strings/arrays.  
- Address root causes of damage (e.g., loose bolts, environmental stress) to prevent recurrence.  

**Example Case**:  
A wind-damaged site required bolt reinforcement and structure realignment after module replacement to enhance wind resistance. ![image](assets/pv-expo/a9d92a2f-fdd3-4241-a7ac-136b97ac16e6.png)  

**Avoid**: Mixing module types in a single string, as this reduces efficiency and risks hotspots.  

(Images show key steps: damaged modules, junction box faults, and grounding issues for visual reference.)

---

>**Source**: RunDo Renewable O&M Knowledge Base`,
  },
  {
    agent: 'pv',
    qZh: '运维人员需要参与哪些培训？',
    qEn: 'What training should Operation and Maintenance personnel undergo?',
    aZh: `1. **安全教育培训**  
   - 包括电力生产安全知识、7S管理规范、应急预案演练等  

2. **技术类培训**  
   - **基础理论**：光伏系统原理、电气一次/二次设备知识、继电保护  
   - **设备操作**：高低压设备操作规范、逆变器维护保养、通信自动化系统  
   - **故障处理**：常见故障分析判断、新技术应用（如无人机巡检、红外检测）  
   - **专项技能**：调度联系管理、电力交易规则  

3. **管理类培训**  
   - 经营管理和财务基础知识（针对站长/区域管理人员）  
   - 绩效考核标准、法律合规要求  

4. **分级培训形式**  
   - **总部级**：线上直播/线下课程，定期下发学习材料并组织考试  
   - **场站级**：以老带新实践培训（安全规程、设备操作、故障案例解析）  
   - **外部集训**：技能比武（理论+实操结合，覆盖技术标准、运行规程等）  

5. **证书资质培训**  
   - 必须持有：特种作业高压电工证、调度员证  
   - 可选持有：安全员证、登高证（分布式电站适用）  

6. **培训管理标准**（站长职责）  
   ![image](assets/pv-expo/77bdcdd1-6509-41ce-9911-59017c4fe06e.png)

---

>**来源**: 润建新能源运维知识库`,
    aEn: `### 1. **Safety Training**  
- **General Safety**: Electrical safety, fire safety, hazard identification, and emergency response.  
- **Workplace Safety**: Compliance with national and industry safety regulations (e.g., lockout/tagout procedures, PPE usage).  
- **Specialized Safety**:  
  - High-voltage equipment handling.  
  - Chemical safety for hazardous materials (e.g., battery storage systems).  

### 2. **Technical Training**  
- **Electrical Systems**:  
  - PV system components (inverters, transformers, combiner boxes).  
  - Troubleshooting electrical faults (e.g., short circuits, grounding issues).  
- **Equipment Maintenance**:  
  - Preventive and corrective maintenance for solar panels, trackers, and SCADA systems.  
  - Infrared thermography and drone inspections for fault detection.  
- **Software Tools**:  
  - SCADA systems, data analytics platforms, and remote monitoring tools.  

### 3. **Operational Procedures**  
- **Standard Protocols**:  
  - "Two-Ticket Three-System" (work permits, operation tickets, shift handover, patrol inspections, equipment testing).  
  - Step-by-step guides for startup/shutdown, grid synchronization.  
- **Emergency Drills**:  
  - Simulated responses to grid failures, fires, or natural disasters.  

### 4. **Regulatory Compliance**  
- **Grid Codes**: Local utility interconnection standards and power quality requirements.  
- **Environmental Regulations**: Waste disposal (e.g., damaged panels, batteries) and spill management.  

### 5. **Soft Skills & Leadership**  
- **Team Coordination**: Effective communication during shift changes or multi-team projects.  
- **Problem-Solving**: Root-cause analysis for recurring issues (e.g., underperformance, inverter failures).  

### 6. **Certifications & Continuous Learning**  
- **Mandatory Certifications**:  
  - Certified PV O&M Engineer (e.g., CSO/CPV), electrical safety certifications.  
- **Ongoing Education**:  
  - Annual refreshers on new technologies (e.g., bifacial panels, energy storage).  
  - Workshops on AI-driven predictive maintenance.  

### 7. **On-the-Job Training**  
- **Mentorship**: Senior technicians guide new hires through hands-on tasks (e.g., replacing fuses, calibrating sensors).  
- **Skill Assessments**: Periodic evaluations via mock scenarios (e.g., rapid shutdown during faults).  

### 8. **Specialized Scenarios**  
- **Extreme Conditions**: Training for dust storms (desert plants) or snow load management (alpine sites).  
- **Cybersecurity**: Protecting OT systems from cyber threats.  

---  
*(Note: Training programs should align with the plant’s specific equipment and risks, with records maintained for audits.)*

---

>**Source**: RunDo Renewable O&M Knowledge Base`,
  },
  {
    agent: 'pv',
    qZh: '如何处理逆变器离线？',
    qEn: 'How to handle inverter loss of communication?',
    aZh: `### 逆变器离线故障处理步骤

#### 1. 初步检查
- **通信状态灯检查**：确认通信灯是否为绿灯闪烁（正常状态应为绿色闪烁，红灯常亮表示故障）
- **电源与运行灯**：检查电源灯和运行灯是否常亮（常亮表示逆变器本体正常运行）

#### 2. 通信线路排查
- **RS485通信线检测**：
  - 检查数据采集器至逆变器的通信线是否松动或断路
  - 测量逆变器侧通信输出端电压（正常应为直流12V），若为0V则排查线路或通信模块
- **干扰排查**：确认通信线与电力线未混绑走线

#### 3. 通信模块处理
- **重启测试**：断开逆变器交直流侧电源，5分钟后重启，观察故障是否消除
- **模块更换**：若重启无效，更换通信模块并重新设置通信地址参数

#### 4. 备件管理
- **备机更换**：若确认模块损坏且无维修条件，直接更换备机（组串式逆变器推荐整体更换）

#### 5. 临时控制措施（如需）
- **手动调节**：通过监控平台手动解列部分逆变器或微调有功负荷，确保电网调度合规

---

### 故障原因分析
- **主要原因**：
  - 通信模块故障（占比较高）
  - 通信线松动/断路（12V电压异常时需重点排查）
  - 灰尘积聚导致接触不良或散热异常
- **次要原因**：逆变器内部连接线破损导致接地（需测量对地绝缘阻值）

---

### 预防措施
1. **日常巡检**：
   - 每日检查逆变器通信状态灯及运行数据
   - 对比相邻逆变器参数，发现异常及时处理
2. **定期维护**：
   - 每季度清理防尘网和散热通道
   - 紧固通信线缆端子，避免振动脱落
3. **备件储备**：常备通信模块等关键部件

---

---

>**来源**: 润建新能源运维知识库`,
    aEn: `**Inverter Communication Loss Troubleshooting Steps:**  

### 1. **Check Backend Monitoring & Combiner Box Communication**  
   - Verify if the combiner box communication is functioning normally.  
   - If communication is normal at the combiner box, exclude issues related to:  
     - Fiber optic channel failure.  
     - Transformer control unit malfunctions.  

### 2. **Inspect RS-485 Terminal Wiring**  
   - Locally check the inverter’s **RS-485 terminal connections**.  
   - Ensure no wiring errors (e.g., loose, reversed polarity, or disconnected wires).  

### 3. **Test RS-485 Communication Line Voltage**  
   - Measure the voltage of the **RS-485 communication line**.  
   - Normal voltage confirms no issues with:  
     - Line damage (e.g., cuts, abrasions).  
     - Grounding faults.  

### 4. **Verify RS-485 Wiring Sequence (Common Error)**  
   - **Example Case**:  
     - A project with **11 inverters** showed 7 working but 4 failing due to reversed polarity (white = positive, blue = negative).  
     - Correcting the wiring restored communication.  
   - **Diagnostic Methods**:  
     - Measure port voltage.  
     - Check continuity of communication lines.  
     - Use protocol analysis software for packet inspection.  

### 5. **Review Configuration Errors**  
   - **Scenario**: Inverter data shows abnormal values (e.g., current inflated by 1000x).  
   - **Solution**:  
     - Check backend monitoring settings (e.g., correct scaling factors in the configuration).  

### 6. **Additional Checks**  
   - Ensure communication cables are **not tangled** or touching other lines/casing to avoid interference.  
   - Confirm communication protocols and address parameters match the system design.  

**Common Causes of Communication Loss**:  
- Incorrect wiring (e.g., reversed RS-485 polarity).  
- Damaged/loose communication cables.  
- Faulty inverter communication board.  
- Configuration errors in monitoring systems.  

**Preventive Measures**:  
- Strictly follow wiring diagrams during installation.  
- Secure connections and avoid cable interference.  
- Regularly inspect communication hardware and software settings.  

*(Note: If communication issues persist after these steps, consult manufacturer support for advanced diagnostics.)*

---

>**Source**: RunDo Renewable O&M Knowledge Base`,
  },
];

// PV Expo (2026) · Data Q&A Agent recommended dialogues (CN+EN)
const PV_EXPO_QUERY_QA = [
  {
    agent: 'query',
    qZh: '查询Melaka-Commercial-409kWp4月的generation',
    qEn: 'Query the generation of Melaka-Commercial-409kWp in April',
    aZh: `# 1.查询Melaka-Commercial-409kWp4月的generation

~~~plaintext
df: "[{\"日期\":\"2026-04-01 00:00:00\",\"发电量\":\"225.2\"},{\"日期\":\"2026-04-02 00:00:00\",\"发电量\":\"210.1\"},{\"日期\":\"2026-04-03 00:00:00\",\"发电量\":\"168.0\"},{\"日期\":\"2026-04-04 00:00:00\",\"发电量\":\"236.2\"},{\"日期\":\"2026-04-05 00:00:00\",\"发电量\":\"230.3\"},{\"日期\":\"2026-04-06 00:00:00\",\"发电量\":\"248.3\"},{\"日期\":\"2026-04-07 00:00:00\",\"发电量\":\"247.4\"},{\"日期\":\"2026-04-08 00:00:00\",\"发电量\":\"112.5\"},{\"日期\":\"2026-04-09 00:00:00\",\"发电量\":\"98.6\"},{\"日期\":\"2026-04-10 00:00:00\",\"发电量\":\"249.8\"},{\"日期\":\"2026-04-11 00:00:00\",\"发电量\":\"238.3\"},{\"日期\":\"2026-04-12 00:00:00\",\"发电量\":\"201.5\"},{\"日期\":\"2026-04-13 00:00:00\",\"发电量\":\"137.6\"},{\"日期\":\"2026-04-14 00:00:00\",\"发电量\":\"145.6\"},{\"日期\":\"2026-04-15 00:00:00\",\"发电量\":\"198.3\"},{\"日期\":\"2026-04-16 00:00:00\",\"发电量\":\"77.1\"},{\"日期\":\"2026-04-17 00:00:00\",\"发电量\":\"181.3\"},{\"日期\":\"2026-04-18 00:00:00\",\"发电量\":\"222.3\"},{\"日期\":\"2026-04-19 00:00:00\",\"发电量\":\"120.8\"},{\"日期\":\"2026-04-20 00:00:00\",\"发电量\":\"256.4\"},{\"日期\":\"2026-04-21 00:00:00\",\"发电量\":\"179.3\"},{\"日期\":\"2026-04-22 00:00:00\",\"发电量\":\"212.9\"},{\"日期\":\"2026-04-23 00:00:00\",\"发电量\":\"214.3\"},{\"日期\":\"2026-04-24 00:00:00\",\"发电量\":\"189.0\"},{\"日期\":\"2026-04-25 00:00:00\",\"发电量\":\"208.0\"},{\"日期\":\"2026-04-26 00:00:00\",\"发电量\":\"172.5\"},{\"日期\":\"2026-04-27 00:00:00\",\"发电量\":\"239.8\"},{\"日期\":\"2026-04-28 00:00:00\",\"发电量\":\"204.3\"},{\"日期\":\"2026-04-29 00:00:00\",\"发电量\":\"236.5\"},{\"日期\":\"2026-04-30 00:00:00\",\"发电量\":\"229.5\"}]"
~~~

chart：

![image.png](assets/query-expo/7f5c8900-8cad-413b-b659-6c1dadfbcf0e.png)

text：**Melaka-Commercial-409kWp** 在 **2026年4月**（4月1日至4月30日）的generation统计如下：

* **月度总generation**：**5,830.9 kWh**
* **日均generation**：约 **194.36 kWh**
* **最高单日generation**：**256.4 kWh**（4月20日）
* **最低单日generation**：**77.1 kWh**（4月16日）

4月份整体发电表现有波动，上旬和中旬出现几天较低值（如4月8日112.5、4月9日98.6、4月16日77.1），可能与天气或设备因素有关；下旬generation相对稳定，多日保持在200 kWh以上。总generation接近5,831 kWh。`,
    aEn: `# 5.Query the generation of Melaka-Commercial-409kWp in April

~~~plaintext
df: "[{\"date\":\"2026-04-01 00:00:00\",\"generation\":\"225.2\"},{\"date\":\"2026-04-02 00:00:00\",\"generation\":\"210.1\"},{\"date\":\"2026-04-03 00:00:00\",\"generation\":\"168.0\"},{\"date\":\"2026-04-04 00:00:00\",\"generation\":\"236.2\"},{\"date\":\"2026-04-05 00:00:00\",\"generation\":\"230.3\"},{\"date\":\"2026-04-06 00:00:00\",\"generation\":\"248.3\"},{\"date\":\"2026-04-07 00:00:00\",\"generation\":\"247.4\"},{\"date\":\"2026-04-08 00:00:00\",\"generation\":\"112.5\"},{\"date\":\"2026-04-09 00:00:00\",\"generation\":\"98.6\"},{\"date\":\"2026-04-10 00:00:00\",\"generation\":\"249.8\"},{\"date\":\"2026-04-11 00:00:00\",\"generation\":\"238.3\"},{\"date\":\"2026-04-12 00:00:00\",\"generation\":\"201.5\"},{\"date\":\"2026-04-13 00:00:00\",\"generation\":\"137.6\"},{\"date\":\"2026-04-14 00:00:00\",\"generation\":\"145.6\"},{\"date\":\"2026-04-15 00:00:00\",\"generation\":\"198.3\"},{\"date\":\"2026-04-16 00:00:00\",\"generation\":\"77.1\"},{\"date\":\"2026-04-17 00:00:00\",\"generation\":\"181.3\"},{\"date\":\"2026-04-18 00:00:00\",\"generation\":\"222.3\"},{\"date\":\"2026-04-19 00:00:00\",\"generation\":\"120.8\"},{\"date\":\"2026-04-20 00:00:00\",\"generation\":\"256.4\"},{\"date\":\"2026-04-21 00:00:00\",\"generation\":\"179.3\"},{\"date\":\"2026-04-22 00:00:00\",\"generation\":\"212.9\"},{\"date\":\"2026-04-23 00:00:00\",\"generation\":\"214.3\"},{\"date\":\"2026-04-24 00:00:00\",\"generation\":\"189.0\"},{\"date\":\"2026-04-25 00:00:00\",\"generation\":\"208.0\"},{\"date\":\"2026-04-26 00:00:00\",\"generation\":\"172.5\"},{\"date\":\"2026-04-27 00:00:00\",\"generation\":\"239.8\"},{\"date\":\"2026-04-28 00:00:00\",\"generation\":\"204.3\"},{\"date\":\"2026-04-29 00:00:00\",\"generation\":\"236.5\"},{\"date\":\"2026-04-30 00:00:00\",\"generation\":\"229.5\"}]"
~~~

chart：

![image.png](assets/query-expo/7f5c8900-8cad-413b-b659-6c1dadfbcf0e.png)

The power generation statistics for the Melaka-Commercial-409kWp power plant in April 2026 (April 1st to April 30th) are as follows:

- Total monthly power generation: 5,830.9 kWh
- Average daily power generation: Approximately 194.36 kWh
- Highest single-day power generation: 256.4 kWh (April 20th)
- Lowest single-day power generation: 77.1 kWh (April 16th)

Overall power generation in April fluctuated, with several days of lower values in the first and middle of the month (e.g., 112.5 kWh on April 8th, 98.6 kWh on April 9th, and 77.1 kWh on April 16th), possibly related to weather or equipment factors. Power generation was relatively stable in the latter part of the month, remaining above 200 kWh for many days. The total power generation was close to 5,831 kWh.`,
  },
  {
    agent: 'query',
    qZh: '查询Melaka-Commercial-409kWp电站5月28号的发电功率',
    qEn: 'Check the power of the Melaka-Commercial-409kWp power plant on May 28th.',
    aZh: `# 2.查询Melaka-Commercial-409kWp电站5月28号的发电功率

（数据较长，保持原始输出结构）

chart：

![image.png](assets/query-expo/2ee795d5-7ec6-4529-b3c3-c15695bb0246.png)

text：

根据查询，**Melaka-Commercial-409kWp** 电站在 **2026年5月28日** 的发电功率数据如下：

* **有效发电时间**：05:15 开始出现功率，至 16:15 结束，其余时段功率为 null（无发电或未采集）。
* **最大功率**：**32.83 kW**（出现在 12:15）。
* **功率峰值区间**：11:30 至 12:45 之间，功率稳定在 **32.31 kW ~ 32.83 kW**。
* **功率变化趋势**：
  * 05:15–07:00：从 0.33 kW 快速上升至 6.05 kW
  * 07:00–11:00：持续上升至 31.90 kW
  * 11:00–12:15：达到全天峰值区间（最高 32.83 kW）
  * 12:15–16:15：逐渐下降至 18.93 kW
  * 16:30 后：无功率数据`,
    aEn: `# 6.Check the power of the Melaka-Commercial-409kWp power plant on May 28th.

chart：

![image.png](assets/query-expo/2ee795d5-7ec6-4529-b3c3-c15695bb0246.png)

Power generation analysis:

- Effective generation time: 05:15 to 16:15; other time points are null (no generation or no collection).
- Maximum power: 32.83 kW (at 12:15).
- Peak interval: 11:30 to 12:45, stable at 32.31 kW to 32.83 kW.
- Trend:
  - 05:15–07:00: rises from 0.33 kW to 6.05 kW
  - 07:00–11:00: continues rising to 31.90 kW
  - 11:00–12:15: reaches the daily peak (32.83 kW)
  - 12:15–16:15: gradually decreases to 18.93 kW
  - After 16:30: no power data available`,
  },
  {
    agent: 'query',
    qZh: '4月的巡检工单统计',
    qEn: 'Inspection work order statistics for April',
    aZh: `# 3.4月的巡检工单统计

~~~plaintext
[
  {
    "电站": "Penang-Commercial-2757.0kWp",
    "已完成": 1,
    "未处理": 0,
    "已取消": 3,
    "处理中": 0,
    "合计": 4
  },
  {
    "电站": "Perak-Commercial-2855.0kWp",
    "已完成": 1,
    "未处理": 0,
    "已取消": 2,
    "处理中": 0,
    "合计": 3
  },
  {
    "电站": "Johor-Commercial-1160.0kWp",
    "已完成": 1,
    "未处理": 0,
    "已取消": 3,
    "处理中": 0,
    "合计": 4
  },
  {
    "电站": "Kedah-Commercial-307.44kWp",
    "已完成": 1,
    "未处理": 0,
    "已取消": 2,
    "处理中": 0,
    "合计": 3
  },
  {
    "电站": "Melaka-Commercial-409kWp",
    "已完成": 0,
    "未处理": 1,
    "已取消": 0,
    "处理中": 0,
    "合计": 1
  }
]
~~~

chart：

![image.png](assets/query-expo/987f1241-8e12-4c89-9ca3-96979ecd9103.png)

* **工单总量**：4月份共产生巡检工单 **15** 笔。
* **完成情况**：已成功完成 **4** 笔；目前仅 **Melaka** 电站有 **1** 笔工单处于**未处理**状态，需要留意跟进。
* **异常提示**：4月**已取消**的工单数量较多（共 **10** 笔），主要集中在 Penang、Perak 和 Johor 电站，建议核实是否有关联的重复派单或计划调整。`,
    aEn: `# 7.Inspection work order statistics for April

chart：

![image.png](assets/query-expo/987f1241-8e12-4c89-9ca3-96979ecd9103.png)

- Total Work Orders: A total of 15 inspection work orders were generated in April.
- Completion Status: 4 work orders have been successfully completed; currently, only one work order at the Melaka power plant is pending and requires monitoring.
- Anomaly Alert: A relatively large number of work orders were cancelled in April (10 in total), mainly concentrated at the Penang, Perak, and Johor power plants. It is recommended to check for any related duplicate work orders or plan adjustments.`,
  },
  {
    agent: 'query',
    qZh: '4月的告警统计',
    qEn: 'Alarm statistics for April',
    aZh: `# 4.4月的告警统计

chart：

![image.png](assets/query-expo/3fd583a6-2add-4462-8632-742402a49e99.png)

* **告警总量**：4月份累计发生各类故障告警 **121** 次。
* **故障分类占比**：
  * **直流故障**：共 **75** 次（占比最高，约占总告警的 62%），是本月最主要的故障类型。
  * **交流故障**：共 **26** 次（占比约 21.5%）。
  * **逆变器故障**：共 **20** 次（占比约 16.5%）。
* **单日故障高峰**（三大故障类型的最高单日告警数均为 **7** 次）：
  * **逆变器故障高峰**：出现在 **4月8日**（单日 7 次），当天需要关注是否有集中断连或批量离线。
  * **直流故障高峰**：出现在 **4月19日**（单日 7 次）。
  * **交流故障高峰**：出现在 **4月21日**（单日 7 次），当天交流故障突增，可能与外部电网波动或并网端异常有关。
* **趋势建议**：
  * 本月**直流故障**持续处于高位，且在下旬（21日-30日）呈现上升趋势（下旬高达 30 次），建议安排巡检人员重点排查直流侧的组串、接线端子及绝缘情况。
  * **交流故障**在 4月21日 出现异常突峰（7 次），建议核对当天电网环境或并网柜开关状态。`,
    aEn: `# 8.Alarm statistics for April

chart：

![image.png](assets/query-expo/3fd583a6-2add-4462-8632-742402a49e99.png)

- Total Alarms: A total of 121 fault alarms occurred in April.
- Fault Category Percentage:
  - DC Faults: 75 alarms (highest percentage, approximately 62% of total alarms), the most prevalent fault type this month.
  - AC Faults: 26 alarms (approximately 21.5%).
  - Inverter Faults: 20 alarms (approximately 16.5%).
- Daily Fault Peaks (maximum daily alarm count for all three fault types: 7):
  - Inverter Fault Peak: April 8th (7 alarms). Monitoring for concentrated disconnections or batch offline events is necessary on this day.
  - DC Fault Peak: April 19th (7 alarms).
  - AC Fault Peak: April 21st (7 alarms). The sudden increase in AC faults on this day may be related to external grid fluctuations or grid connection anomalies.
- Trend Recommendations:
  - DC faults remained high this month, with an upward trend in the latter half of the month (April 21-30) (reaching up to 30 times). It is recommended that inspection personnel focus on checking the DC side strings, terminals, and insulation.
  - AC faults experienced an abnormal peak on April 21 (7 times). It is recommended to check the grid environment or the status of the grid-connected cabinet switches on that day.`,
  },
];

// PV Expo (2026) · Alarm Agent recommended dialogues (CN+EN)
const PV_EXPO_ALERT_QA = [
  {
    agent: 'alert',
    qZh: '进行告警关联分析',
    qEn: 'Perform Alarm Correlation Analysis',
    aZh: `当前电站在近72小时内复发18次PV接入异常(60011)告警，故障呈现以下特征：

- 时序规律：每日高频触发(日均6次)，集中在08：37-17:43时段，尤其午后14:28-17：44复发密集。
- 持续时长：多数故障在10分钟内自动恢复(最短41秒)，但存在3次超1小时的长时异常(最长5小时21分)。
- 恢复状态：历史告警均标记为已恢复且处理状态为已处理，但无工单记录，需警惕未根治的隐患。
- 并发故障状态：无其他伴随故障(本设备/同电站其他故障总数均为0)
- 同站关联详情：本站无其他设备报出此类故障(同电站同类故障总数=0)，属单机独立触发。
- 防重派提示：所有历史告警均未关联工单，需核查是否漏派或未闭环处理。

基于单机高频复发PV接入异常且无同站关联的特征，推断可能原因如下：

1. 设备级硬件缺陷：逆变器PV侧端子接触不良、DC继电器老化等导致间歇性断连，需重点检查物理连接。
2. 环境干扰：午后高温可能加剧元件热胀冷缩，引发保护性脱扣(与14：00后故障密集现象吻合)。
3. 软件逻辑缺陷：阈值设置过于敏感或防抖机制失效，导致短暂波动误报为异常。

排除性指征：
- 非共模故障(无同站设备关联)
- 非通讯问题（无网络类告警伴随）`,
    aEn: `The current site has experienced 18 recurrences of PV Access Anomaly (60011) alarms within the past 72 hours. The fault exhibits the following characteristics:

- **Temporal Pattern**: High-frequency triggering daily (avg. 6 times/day), concentrated between 08:37–17:43, with particularly dense recurrence during the afternoon period (14:28–17:44).
- **Duration**: Most faults auto-recover within 10 minutes (shortest: 41 seconds), but 3 instances exceeded 1 hour (longest: 5 hours 21 minutes).
- **Recovery Status**: All historical alarms are marked as Restored with processing status Processed. However, no work orders have been created — latent unresolved root causes should be investigated.
- **Concurrent Fault Status**: No other accompanying faults detected (total faults on this device / other devices at the same site = 0).
- **Same-Site Correlation Details**: No other devices at this site have reported this type of fault (same-site same-fault count = 0). This is a single-device independent trigger.
- **Duplicate Dispatch Alert**: None of the historical alarms are associated with work orders. Verify whether dispatches were missed or left unclosed.

Based on the pattern of high-frequency single-device PV Access Anomaly recurrence with no same-site correlation, the probable root causes are:

1. **Device-Level Hardware Defect**: Inverter PV-side terminal contact failure, aging DC relay, or similar issues causing intermittent disconnection. Physical connections should be prioritized for inspection.
2. **Environmental Interference**: Afternoon high temperatures may exacerbate thermal expansion/contraction of components, triggering protective trip-outs (consistent with the post-14:00 fault clustering pattern).
3. **Software Logic Defect**: Overly sensitive threshold settings or anti-bounce mechanism failure, causing brief fluctuations to be falsely reported as anomalies.

**Exclusionary Indicators**:
- Not a common-mode fault (no same-site device correlation)
- Not a communication issue (no network-type alarms accompanying)`,
  },
  {
    agent: 'alert',
    qZh: '当前的告警工单情况如何',
    qEn: 'What Is the Current Alarm Work Order Status?',
    aZh: `## 场景 A：存在活跃告警工单

当前电站存在 7 条未闭环告警工单，其中 3 条已逾期。按紧急程度分布：紧急 2 条、重要 3 条、一般 2 条。建议优先处理逾期工单并对同区域同类型故障进行聚合派发，以提高运维效率。

### 工单明细

| 工单编号 | 工单名称 | 类型 | 等级 | 状态 | 负责人 | 关联电站 | 关联设备SN | 计划截止 | 逾期情况 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2029042400012 | 白庙局站逆变器无电网及采集器故障处置 | 消缺 | 紧急 | 处理中 | 李志远 | TJ天津市河北区白庙局站（光伏一期） | 1000000345832413 | 2026-04-30 | ⚠️ 逾期28天 |
| 2029050900018 | 周村职业学院南传输机房逆变器供电恢复 | 消缺 | 重要 | 处理中 | 张磊 | 中国山东淄博周村职业学院南传输机房 | A2331306101 | 2026-05-15 | ⚠️ 逾期13天 |
| 2029051900025 | 阳信河流2机房无电网故障现场排查 | 消缺 | 重要 | 待接单 | — | 中国山东滨州阳信河流2机房传输 | A2270602890 | 2026-05-23 | ⚠️ 逾期5天 |
| 2029052200031 | 莱西片区基站光伏系统电网巡检 | 巡检 | 一般 | 处理中 | 周伟 | 青岛莱西院上镇七岌站点/青岛莱西武备机房 | A2260612890/A2260612891 | 2026-05-29 | 明日到期 |
| 2029052700038 | 东崔家营机房无线逆变器无电网排查 | 消缺 | 重要 | 处理中 | 张磊 | 中国山东青岛平度东崔家营机房无线 | A2251938414 | 2026-05-30 | 剩余2天 |
| 2029052700042 | 白庙局站逆变器二次检修与功率采集器更换 | 消缺 | 紧急 | 处理中 | 李志远 | TJ天津市河北区白庙局站（光伏一期） | 1000000345832413 | 2026-06-03 | 剩余6天 |
| 2029052800055 | 东营片区基站光伏无电网集中排查 | 消缺 | 一般 | 待接单 | — | 东营青青花园自留基站/东营码头业务区机房/东营广饶花官机房无线 | A2270850566/A2270851292/A2270851113 | 2026-06-04 | 剩余7天 |

## 场景 B：无活跃告警工单

当前电站无活跃告警工单，所有历史工单均已闭环处理。`,
    aEn: `### Scenario A: Active Work Orders Exist

The current site has 7 unclosed alarm work orders, of which 3 are overdue. Distribution by priority: Critical — 2, Major — 3, General — 2. It is recommended to prioritize overdue orders and aggregate same-region, same-type faults for batch dispatching to improve O&M efficiency.

### Work Order Details

| Order ID | Order Name | Type | Priority | Status | Assignee | Associated Site | Associated Device SN | Deadline | Overdue Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2029042400012 | Baimiao Station inverter grid-loss & collector fault repair | Defect | Critical | In Progress | Li Zhiyuan | TJ Tianjin Hebei Baimiao Station (PV Phase I) | 1000000345832413 | 2026-04-30 | ⚠️ 28 days overdue |
| 2029050900018 | Zhoucun Vocational College South transmission room inverter power restoration | Defect | Major | In Progress | Zhang Lei | Shandong Zibo Zhoucun Vocational College South Transmission Room | A2331306101 | 2026-05-15 | ⚠️ 13 days overdue |
| 2029051900025 | Yangxin Heliu 2 room grid-loss fault on-site investigation | Defect | Major | Pending Acceptance | — | Shandong Binzhou Yangxin Heliu 2 Transmission Room | A2270602890 | 2026-05-23 | ⚠️ 5 days overdue |
| 2029052200031 | Laixi area base station PV grid inspection | Inspection | General | In Progress | Zhou Wei | Qingdao Laixi Yuanshang Qiji Site / Qingdao Laixi Wubei Room | A2260612890 / A2260612891 | 2026-05-29 | Due tomorrow |
| 2029052700038 | Dongcuijiaying wireless room inverter grid-loss investigation | Defect | Major | In Progress | Zhang Lei | Shandong Qingdao Pingdu Dongcuijiaying Wireless Room | A2251938414 | 2026-05-30 | 2 days remaining |
| 2029052700042 | Baimiao Station inverter re-inspection & power collector replacement | Defect | Critical | In Progress | Li Zhiyuan | TJ Tianjin Hebei Baimiao Station (PV Phase I) | 1000000345832413 | 2026-06-03 | 6 days remaining |
| 2029052800055 | Dongying area base station PV grid-loss consolidated investigation | Defect | General | Pending Acceptance | — | Dongying Qingqing Garden Base / Dongying Wharf Business Area Room / Dongying Guangrao Huaguan Wireless Room | A2270850566 / A2270851292 / A2270851113 | 2026-06-04 | 7 days remaining |

### Scenario B: No Active Work Orders

The current site has no active alarm work orders. All historical orders have been closed and resolved.`,
  },
  {
    agent: 'alert',
    qZh: '对最新告警决策',
    qEn: 'Make a Decision on the Latest Alarm',
    aZh: `识别到最新告警来自电站 Melaka-Commercial 的逆变器设备，告警类型为直流输入极性接反（PV Reverse Polarity），故障码 PV-REV-001，告警等级初判为紧急。该故障表明光伏组串直流输入端正负极发生接反且持续超过30秒，存在极高的设备物理损坏及短路起火风险，需立即响应处理。

建议处置：
1. 立即安排现场运维人员断开该逆变器直流侧开关，消除短路起火隐患
2. 逐一排查该逆变器所辖组串的MC4连接器和汇流箱接线端子，重点检查是否存在极性反接、虚接或氧化腐蚀
3. 使用万用表测量各组串正负极对地电压，确认极性是否正确
4. 检修完成后监测24小时，确认告警不再复发后关闭跟踪`,
    aEn: `The latest alarm has been identified from the Melaka-Commercial site, originating from an inverter device. The alarm type is DC Input Reverse Polarity (PV Reverse Polarity), fault code PV-REV-001, with an initial severity assessment of Critical. This fault indicates that the positive and negative terminals of the PV string DC input have been reversed for more than 30 seconds, presenting an extremely high risk of physical equipment damage and short-circuit fire. Immediate response is required.

Recommended Actions:
1. Immediately arrange on-site O&M personnel to disconnect the inverter's DC-side switch to eliminate the short-circuit fire hazard.
2. Systematically inspect all MC4 connectors and combiner box terminal connections under this inverter, focusing on reverse polarity, loose contacts, or oxidative corrosion.
3. Use a multimeter to measure the positive/negative-to-ground voltage of each string to verify correct polarity.
4. After repair, monitor for 24 hours. Close the tracking item only after confirming no further alarm recurrence.`,
  },
  {
    agent: 'alert',
    qZh: '当前正在跟踪的告警',
    qEn: 'View Currently Tracked Alarms',
    aZh: `当前智能体共有 6 项告警处于活跃跟踪状态，涵盖 5 个电站、6 台逆变器设备。以下为各跟踪项的详细状态：

| # | 电站 | 设备SN | 故障码 | 告警类型 | 跟踪状态 | 进入观察时间 | 最近检查 | 累计检查 | 研判理由 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 中国山东青岛平度东崔家营机房无线 | A2251938414 | 60005 | 无电网 | 观察中 | 05-27 04:58 | 05-28 16:30 | 3次 | 逆变器1检测到无电网告警（故障码60005），持续1天13小时。初步判断为电网侧供电异常或并网开关跳闸引起的暂态失电，系统已进入自愈观察周期。24h内未见恢复信号，趋势平稳。 |
| 2 | 中国山东滨州阳信河流2机房传输 | A2270602890 | 60005 | 无电网 | 建议派单(待复核) | 05-18 06:06 | 05-28 12:06 | 8次 | 无电网告警已持续10天12小时未恢复，远超正常自愈窗口期。经8轮周期评估后指标无改善迹象，趋势恶化，已自动升级为建议派单待人工复核。需现场核实电网侧断路器状态及供电线路完整性。 |
| 3 | 中国山东淄博周村职业学院南传输机房 | A2331306101 | 60005 | 无电网 | 派单跟踪中 | 05-08 04:58 | 05-28 10:00 | 15次 | 无电网告警持续超20天，已确认派单。关联工单：2029050900018。设备长期处于失电离网状态，需排查站点侧市电接入是否中断或电表箱是否跳闸。当前业务状态：已派单(SendOrders)。 |
| 4 | TJ天津市河北区白庙局站（光伏一期） | 1000000345832413 | 2032 | 无电网 | 派单跟踪中 | 04-23 12:20 | 05-28 09:20 | 20次 | 华为逆变器INV-HV21B0270227无电网告警已持续35天5小时。同设备另存在功率采集器故障（故障码2067），两项告警高度关联。已确认派单，关联工单：2029042400012。当前业务状态：已派单(SendOrders)，但工单已逾期未闭环。 |
| 5 | 青岛莱西院上镇七岌站点 | A2260612890 | 60005 | 无电网 | 建议派单(待复核) | 04-09 12:55 | 05-28 14:55 | 25次 | 无电网告警持续49天5小时，严重超期。该站点逆变器长期处于InAlarm状态，初始工单创建截止时间（04-10）已过期近50天仍未处理。趋势持续恶化，强烈建议立即派单并升级处理优先级。 |
| 6 | 东营码头业务区机房 | A2270851292 | 60005 | 无电网 | 建议派单(待复核) | 03-17 06:21 | 05-28 12:21 | 30次 | 无电网告警持续72天11小时，为当前跟踪队列中持续时间最长的异常项。长期失电导致该站光伏系统完全停机，发电量归零。已多次自动建议派单但未获人工确认，建议立即介入处理。 |

整体分析：
- 当前6项跟踪告警中，仅1项处于初期观察阶段（东崔家营），其余5项均已进入派单或建议派单状态，反映出大量长期未恢复的无电网故障积压。
- 告警类型高度集中：6项中有5项为无电网（故障码60005），1项为无电网（故障码2032），均属交流故障分类，故障根因可能涉及市电中断、并网开关异常或电表箱跳闸等共性问题。
- 天津白庙局站存在同设备多告警叠加（无电网+功率采集器故障），建议合并排查。
- 青岛莱西七岌站点和东营码头两站告警持续时间分别为49天和72天，属严重超期未处理项，建议优先督办。`,
    aEn: `The agent currently has 6 alarms in active tracking status, spanning 5 sites and 6 inverter devices. Detailed status for each tracked item is as follows:

| # | Site | Device SN | Fault Code | Alarm Type | Tracking Status | Observation Start | Last Check | Total Checks | Decision Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Shandong Qingdao Pingdu Dongcuijiaying Wireless Room | A2251938414 | 60005 | Grid Loss | Observing | 05-27 04:58 | 05-28 16:30 | 3 | Inverter 1 detected a grid-loss alarm (fault code 60005), persisting for 1 day 13 hours. Preliminary assessment: transient power loss caused by grid-side supply anomaly or grid-tie switch trip. System has entered self-healing observation cycle. No recovery signal observed within 24h; trend is stable. |
| 2 | Shandong Binzhou Yangxin Heliu 2 Transmission Room | A2270602890 | 60005 | Grid Loss | Dispatch Recommended (Pending Review) | 05-18 06:06 | 05-28 12:06 | 8 | Grid-loss alarm has persisted for 10 days 12 hours without recovery, far exceeding the normal self-healing window. After 8 evaluation cycles, no improvement detected; trend is deteriorating. Auto-escalated to dispatch recommendation pending manual review. On-site verification of grid-side breaker status and power supply line integrity required. |
| 3 | Shandong Zibo Zhoucun Vocational College South Transmission Room | A2331306101 | 60005 | Grid Loss | Dispatch Tracking | 05-08 04:58 | 05-28 10:00 | 15 | Grid-loss alarm has persisted for over 20 days. Dispatch confirmed. Associated work order: 2029050900018. Device has been in prolonged off-grid power-loss state. Site-side utility power supply and meter box breaker status require investigation. Current business status: Dispatched (SendOrders). |
| 4 | TJ Tianjin Hebei Baimiao Station (PV Phase I) | 1000000345832413 | 2032 | Grid Loss | Dispatch Tracking | 04-23 12:20 | 05-28 09:20 | 20 | Huawei inverter INV-HV21B0270227 grid-loss alarm has persisted for 35 days 5 hours. The same device also has a Power Collector Fault (fault code 2067); the two alarms are highly correlated. Dispatch confirmed. Associated work order: 2029042400012. Current business status: Dispatched (SendOrders), but the work order is overdue and unclosed. |
| 5 | Qingdao Laixi Yuanshang Qiji Site | A2260612890 | 60005 | Grid Loss | Dispatch Recommended (Pending Review) | 04-09 12:55 | 05-28 14:55 | 25 | Grid-loss alarm has persisted for 49 days 5 hours — severely overdue. The inverter at this site has been in InAlarm status long-term. The initial ticket creation deadline (04-10) has been exceeded by nearly 50 days with no action taken. Trend continues to deteriorate. Immediate dispatch with elevated priority is strongly recommended. |
| 6 | Dongying Wharf Business Area Room | A2270851292 | 60005 | Grid Loss | Dispatch Recommended (Pending Review) | 03-17 06:21 | 05-28 12:21 | 30 | Grid-loss alarm has persisted for 72 days 11 hours — the longest-running anomaly in the current tracking queue. Prolonged power loss has caused the site's PV system to shut down completely, with power generation at zero. Automatic dispatch recommendations have been issued multiple times but have not received manual confirmation. Immediate intervention is advised. |

Overall Analysis:
- Of the 6 tracked alarms, only 1 is in the early observation stage (Dongcuijiaying). The remaining 5 have all entered dispatch or dispatch-recommended status, reflecting a significant backlog of long-standing unrecovered grid-loss faults.
- Alarm types are highly concentrated: 5 of the 6 items are Grid Loss (fault code 60005), and 1 is Grid Loss (fault code 2032). All fall under the AC Fault classification. Root causes may involve common issues such as utility power interruption, grid-tie switch malfunction, or meter box breaker trip.
- The Tianjin Baimiao Station has multiple overlapping alarms on the same device (Grid Loss + Power Collector Fault). A consolidated investigation is recommended.
- The Qingdao Laixi Qiji site and Dongying Wharf station have alarm durations of 49 days and 72 days respectively — these are severely overdue unprocessed items and should be prioritized for escalation.`,
  },
];

const QUICK_PROMPTS = [
  ...PV_EXPO_QA.map(x => ({ a: 'pv', t: x.qZh, en: x.qEn })),
  ...PV_EXPO_QUERY_QA.map(x => ({ a: 'query', t: x.qZh, en: x.qEn })),
  ...PV_EXPO_ALERT_QA.map(x => ({ a: 'alert', t: x.qZh, en: x.qEn })),
];

/** 聚焦时隐藏右侧对话调度的电站 */
const DISPATCH_HIDDEN_PLANT_IDS = new Set([
  '1881233694553112576',
  '1879736396404850688',
]);
function isDispatchHiddenPlant(id) {
  return id != null && DISPATCH_HIDDEN_PLANT_IDS.has(String(id));
}

/** 演示电站：托管锁定、固定场景、时间轴文案（不展示 A/B 切换） */
const DEMO_PLANT_PROFILES = {
  '1881233694553112576': {
    scenarioIdx: 0,
    timelineZh: '告警驱动 · 自主闭环',
    timelineEn: 'Alarm-Driven · Self-Closure',
    grayInspInTeam: true,
  },
  '1879736396404850688': {
    scenarioIdx: 1,
    timelineZh: '无人机巡检 · 图像驱动',
    timelineEn: 'UAV Inspection · Vision-Driven',
  },
};
function getDemoPlantProfile(id) {
  if (id == null) return null;
  return DEMO_PLANT_PROFILES[String(id)] || null;
}

window.IRUN = {
  AGENT_CATEGORIES, AGENTS, AGENT_BY_ID,
  TENANTS, PLANTS, AGGREGATE, aggregateOf,
  SCENARIOS, SCENARIO_A, SCENARIO_B,
  DISPATCH_HIDDEN_PLANT_IDS, isDispatchHiddenPlant,
  DEMO_PLANT_PROFILES, getDemoPlantProfile,
  GLOBAL_EVENT_TEMPLATES, QUICK_PROMPTS,
  PV_EXPO_QA,
  PV_EXPO_QUERY_QA,
  PV_EXPO_ALERT_QA,
};
