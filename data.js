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
  { id: 'p2', name: 'ILP · Banten-A', enName: 'ILP · Banten-A',    short: 'Banten-A',  tenant: 'ilp', region: 'Indonesia·万丹',  enRegion: 'Indonesia · Banten',   city: '万丹',     enCity: 'Banten',
    capacity: 50.0, power: 31.7, gen: 218.4, alerts: 3, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 78, y: 68, mapX: '62%', mapY: '55%', agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p4', name: 'ILP · Cebu-North', enName: 'ILP · Cebu-North', short: 'Cebu-N',   tenant: 'ilp', region: 'Philippines·宿务', enRegion: 'Philippines · Cebu',   city: '宿务',     enCity: 'Cebu',
    capacity: 42.0, power: 26.1, gen: 184.5, alerts: 5, risk: 'high', status: '指挥模式', enStatus: 'Command Mode',
    x: 84, y: 54, mapX: '82%', mapY: '52%', agents: ['ops','warn','alert','diag','order','sched'] },
  { id: 'p6', name: 'ILP · Selangor', enName: 'ILP · Selangor',    short: 'Selangor',  tenant: 'ilp', region: 'Malaysia·吉隆坡', enRegion: 'Malaysia · Kuala Lumpur', city: '吉隆坡', enCity: 'Kuala Lumpur',
    capacity: 36.5, power: 22.4, gen: 158.2, alerts: 4, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 64, y: 74, mapX: '75%', mapY: '53%', agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p8', name: 'ILP · 巴厘南站',  enName: 'ILP · Bali-South',   short: 'Bali-S',    tenant: 'ilp', region: 'Indonesia·巴厘', enRegion: 'Indonesia · Bali',    city: '巴厘',     enCity: 'Bali',
    capacity: 48.0, power: 30.2, gen: 195.0, alerts: 2, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 86, y: 36, mapX: '88%', mapY: '30%', agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p9', name: 'ILP · 马尼拉东站', enName: 'ILP · Manila-East', short: 'Manila-E',  tenant: 'ilp', region: 'Philippines·马尼拉', enRegion: 'Philippines · Manila', city: '马尼拉', enCity: 'Manila',
    capacity: 38.0, power: 24.5, gen: 158.0, alerts: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 70, y: 78, mapX: '70%', mapY: '75%', agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p10', name: 'ILP · 槟城西站', enName: 'ILP · Penang-West',  short: 'Penang-W',  tenant: 'ilp', region: 'Malaysia·槟城',  enRegion: 'Malaysia · Penang',    city: '槟城',     enCity: 'Penang',
    capacity: 32.0, power: 20.0, gen: 138.0, alerts: 3, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 55, y: 32, mapX: '55%', mapY: '35%', agents: ['ops','warn','alert','diag','order','sched','query'] },
  { id: 'p11', name: 'ILP · 河内北站', enName: 'ILP · Hanoi-North',  short: 'Hanoi-N',   tenant: 'ilp', region: 'Vietnam·河内',   enRegion: 'Vietnam · Hanoi',      city: '河内',     enCity: 'Hanoi',
    capacity: 28.0, power: 17.2, gen: 115.0, alerts: 0, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 48, y: 72, mapX: '50%', mapY: '70%', agents: ['ops','warn','alert','diag','order','sched','query'] },

  // ── Tenant: fux (河源·福曦能源) · 5 plants ───────────────────────────────
  { id: 'p1', name: '福曦·东源一号',  enName: 'Fux · Dongyuan #01', short: '东源 #01', tenant: 'fux', region: '广东·河源',      enRegion: 'Guangdong · Heyuan',   city: '河源',     enCity: 'Heyuan',
    capacity: 80.5, power: 62.4, gen: 412.8, alerts: 7, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 60, y: 50, mapX: '41%', mapY: '68%', agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'] },
  { id: 'p5', name: '福曦·东源二号',  enName: 'Fux · Dongyuan #02', short: '东源 #02', tenant: 'fux', region: '广东·河源',      enRegion: 'Guangdong · Heyuan',   city: '广州',     enCity: 'Guangzhou',
    capacity: 60.0, power: 44.8, gen: 296.1, alerts: 2, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 66, y: 40, mapX: '42%', mapY: '37%', agents: ['ops','warn','safe','alert','diag','order','sched','pv','query'] },
  { id: 'f3', name: '福曦·龙川渔光',  enName: 'Fux · Longchuan PV-Fishery', short: '龙川渔光', tenant: 'fux', region: '广东·龙川', enRegion: 'Guangdong · Longchuan', city: '龙川', enCity: 'Longchuan',
    capacity: 55.0, power: 38.2, gen: 252.6, alerts: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 32, y: 58, mapX: '15%', mapY: '50%', agents: ['ops','warn','alert','diag','order','sched','pv','insp'] },
  { id: 'f4', name: '福曦·紫金山光储', enName: 'Fux · Zijinshan PV+ESS',    short: '紫金山',    tenant: 'fux', region: '广东·紫金', enRegion: 'Guangdong · Zijin',     city: '紫金', enCity: 'Zijin',
    capacity: 42.0, power: 27.5, gen: 178.4, alerts: 3, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 72, y: 28, mapX: '70%', mapY: '30%', agents: ['ops','warn','safe','alert','diag','order','sched','query'] },
  { id: 'f5', name: '福曦·和平农光互补', enName: 'Fux · Heping Agri-PV',   short: '和平农光',  tenant: 'fux', region: '广东·和平', enRegion: 'Guangdong · Heping',    city: '和平', enCity: 'Heping',
    capacity: 38.0, power: 24.6, gen: 162.3, alerts: 0, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 88, y: 62, mapX: '88%', mapY: '65%', agents: ['ops','warn','alert','diag','order','sched','pv'] },

  // ── Tenant: rj (润建能源数字化研究院) · 4 plants ─────────────────────────
  { id: 'p3', name: '润建·研究示范站', enName: 'RJ · Pilot Plant',  short: '示范站',    tenant: 'rj',  region: '广西·南宁',       enRegion: 'Guangxi · Nanning',    city: '南宁',     enCity: 'Nanning',
    capacity: 30.2, power: 19.6, gen: 152.6, alerts: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 44, y: 56, mapX: '27%', mapY: '55%', agents: ['ops','warn','safe','alert','diag','order','sched','pv','insp','query'] },
  { id: 'p7', name: '润建·横州渔光',  enName: 'RJ · Hengzhou PV-Fishery', short: '横州渔光', tenant: 'rj',  region: '广西·横州', enRegion: 'Guangxi · Hengzhou',   city: '横州',     enCity: 'Hengzhou',
    capacity: 25.8, power: 16.1, gen: 124.0, alerts: 0, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 40, y: 60, mapX: '12%', mapY: '40%', agents: ['ops','warn','alert','diag','order','sched','pv','insp'] },
  { id: 'r3', name: '润建·百色光储电站', enName: 'RJ · Baise PV+ESS',     short: '百色光储',  tenant: 'rj',  region: '广西·百色', enRegion: 'Guangxi · Baise',       city: '百色', enCity: 'Baise',
    capacity: 45.0, power: 28.4, gen: 198.5, alerts: 2, risk: 'mid',  status: '托管中',   enStatus: 'Managed',
    x: 50, y: 36, mapX: '55%', mapY: '38%', agents: ['ops','warn','safe','alert','diag','order','sched','pv','query'] },
  { id: 'r4', name: '润建·钦州工商业', enName: 'RJ · Qinzhou C&I',        short: '钦州工商业', tenant: 'rj',  region: '广西·钦州', enRegion: 'Guangxi · Qinzhou',     city: '钦州', enCity: 'Qinzhou',
    capacity: 18.5, power: 12.3, gen:  88.6, alerts: 1, risk: 'low',  status: '托管中',   enStatus: 'Managed',
    x: 76, y: 72, mapX: '80%', mapY: '70%', agents: ['ops','warn','alert','diag','order','sched','query'] },
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

// Scenario A: 组串告警 → 去噪 → 诊断 → 工单 → 排程 → 现场 → 安全 → 填报 → 验收 → 归档
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

// Global event templates — used to spawn left-side stream when no plant is focused
const GLOBAL_EVENT_TEMPLATES = [
  { agent: 'alert',  text: 'P3 · 直流汇流箱告警自动归并 → 1 条研判', en: 'P3 · DC combiner alerts auto-merged → 1 review', sev: 'mid' },
  { agent: 'warn',   text: 'P1 · 子方阵 B-07 发电效能 ↓ 4.6% · 出预警', en: 'P1 · Array B-07 yield ↓ 4.6% · warning issued', sev: 'mid' },
  { agent: 'insp',   text: 'P3 · 无人机 UAV-01 完成 18 方阵巡检', en: 'P3 · UAV-01 finished 18-array inspection', sev: 'low' },
  { agent: 'diag',   text: 'P2 · 诊断热斑 ×3 · 损失电量 ≈ 218 kWh', en: 'P2 · 3 hot-spots diagnosed · loss ≈ 218 kWh', sev: 'mid' },
  { agent: 'order',  text: 'P5 · 工单 WO-26052-201 自动验收通过', en: 'P5 · Ticket WO-26052-201 auto-accepted', sev: 'low' },
  { agent: 'sched',  text: 'P4 · 跨站行程合并 · 节省里程 38 km', en: 'P4 · Cross-site routes merged · saved 38 km', sev: 'low' },
  { agent: 'safe',   text: 'P1 · 雷雨临近 · 暂停 2 项登高作业', en: 'P1 · Storm approaching · 2 climbing jobs paused', sev: 'high' },
  { agent: 'query',  text: 'P3 · 张工 @问数 "本月 PR 同比" · 已返回', en: 'P3 · Zhang @Query "MoM PR" · answered', sev: 'low' },
  { agent: 'pv',     text: 'P2 · 新人 @光伏 "组串绝缘检测流程"', en: 'P2 · Onboard @PV-Assist "string insulation test SOP"', sev: 'low' },
  { agent: 'ops',    text: '租户 ILP · 月度可用率 99.41% · 达标', en: 'Tenant ILP · monthly availability 99.41% · on target', sev: 'low' },
  { agent: 'alert',  text: 'P6 · 通信中断 12 min → 已自愈', en: 'P6 · Comm outage 12 min → self-healed', sev: 'mid' },
  { agent: 'warn',   text: 'P7 · IV 曲线偏移预警 · 转诊断', en: 'P7 · IV curve drift warning · forwarded to Diagnose', sev: 'mid' },
];

// Recommended quick prompts for the right-side dispatch console
const QUICK_PROMPTS = [
  { a: 'ops',   t: '生成今日 iRun 日报',         en: 'Generate today\'s iRun report' },
  { a: 'query', t: '本月各电站 PR 排名？',         en: 'Rank this month\'s PR by plant' },
  { a: 'warn',  t: '巡查 P1 全部组串效能',         en: 'Audit all string efficiency at P1' },
  { a: 'insp',  t: '为 P1 编排明日无人机巡检',      en: 'Schedule tomorrow\'s UAV inspection at P1' },
  { a: 'sched', t: '合并 P1、P5 的 3 张工单',       en: 'Merge 3 tickets across P1 & P5' },
  { a: 'safe',  t: '检视未来 24h 高风险作业',       en: 'Review high-risk jobs in next 24h' },
];

window.IRUN = {
  AGENT_CATEGORIES, AGENTS, AGENT_BY_ID,
  TENANTS, PLANTS, AGGREGATE, aggregateOf,
  SCENARIOS, SCENARIO_A, SCENARIO_B,
  GLOBAL_EVENT_TEMPLATES, QUICK_PROMPTS,
};
