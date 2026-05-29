// iRun Workbench — UI components (no top-level App; mounted from app.jsx)

// ── Language Context ────────────────────────────────────────────────────
const LangCtx = React.createContext('zh');
const useLang = () => React.useContext(LangCtx);
// t(zh, en) — picks text based on current lang context
function T({z, e}){ const l = useLang(); return l==='zh' ? z : e; }

function catLabel(cat, zh) { return zh ? cat.label : (cat.enLabel || cat.label); }
function agentName(a, zh) { return zh ? a.name : (a.enName || a.name); }
function agentShort(a, zh) { return zh ? a.short : (a.en || a.short); }
function agentRole(a, zh) { return zh ? a.role : (a.enRole || a.role); }
function agentIntro(a, zh) { return zh ? a.intro : (a.enIntro || a.intro); }
function agentSkill(a, i, zh) {
  const s = a.skills[i];
  return zh ? s : (a.enSkills?.[i] || s);
}

function stepText(s, zh) { return zh ? s.text : (s.en || s.text); }
function stepTag(s, zh) { return zh ? s.tag : (s.entag || s.tag); }
function isSafetyStep(s) { return s?.tag === '安全' || s?.entag === 'Safety'; }

const {
  AGENTS: _AGENTS,
  AGENT_BY_ID: _ABI,
  AGENT_CATEGORIES: _CATS,
  PLANTS: _PLANTS,
  AGGREGATE: _AGG,
  GLOBAL_EVENT_TEMPLATES: _GET,
  QUICK_PROMPTS: _QP,
  TENANTS: _TENANTS
} = window.IRUN;

function Markdown({ text }) {
  const md = String(text ?? '');
  // Fallback: if deps aren't loaded, render as plain text.
  if (!window.marked || !window.DOMPurify) return <div style={{whiteSpace:'pre-wrap'}}>{md}</div>;

  // Configure marked for chat rendering.
  try {
    window.marked.setOptions?.({ gfm: true, breaks: true, mangle: false, headerIds: false });
  } catch (e) {}

  let html = '';
  try {
    html = window.marked.parse(md);
  } catch (e) {
    return <div style={{whiteSpace:'pre-wrap'}}>{md}</div>;
  }

  // Sanitize + force external links to be safe.
  const clean = window.DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });

  // Post-process links with target=_blank
  const withSafeLinks = clean
    .replaceAll('<a ', '<a target="_blank" rel="noopener noreferrer" ');

  return <div className="md-body" dangerouslySetInnerHTML={{ __html: withSafeLinks }} />;
}

// ──────────────────────────────────────────────────────────────────────
// Live clock
function useClock(){
  const [t,setT] = useState(()=>new Date());
  useEffect(()=>{ const id=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); },[]);
  return t;
}
function fmtTime(d){
  const p = n => String(n).padStart(2,'0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function fmtDate(d){
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())}`;
}
function fmtDateTime(d){
  return `${fmtDate(d)} ${fmtTime(d)}`;
}

// ── Weather mock (deterministic by seed; Seniverse-style icons) ──────
const WX_TABLE = [
  { key:'sunny',    cn:'晴',     en:'Sunny',    icon:'sun' },
  { key:'cloudy',   cn:'多云',   en:'Cloudy',   icon:'cloud-sun' },
  { key:'overcast', cn:'阴',     en:'Overcast', icon:'cloud' },
  { key:'rain',     cn:'小雨',   en:'Rain',     icon:'rain' },
  { key:'thunder',  cn:'雷阵雨', en:'Thunder',  icon:'thunder' },
];
function pickWx(seed){
  const s = String(seed || 'demo');
  const h = s.split('').reduce((a,c)=>a+c.charCodeAt(0), 0);
  return { ...WX_TABLE[h % WX_TABLE.length], temp: 18 + (h % 18) };
}
function WxIcon({type}){
  const props = { width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(type){
    case 'sun': return (
      <svg {...props}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.9" y2="6.9"/><line x1="17.1" y1="17.1" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.9" y2="17.1"/><line x1="17.1" y1="6.9" x2="19.1" y2="4.9"/></svg>
    );
    case 'cloud-sun': return (
      <svg {...props}><circle cx="7" cy="8" r="2.5"/><line x1="7" y1="3" x2="7" y2="4.5"/><line x1="2.5" y1="8" x2="4" y2="8"/><line x1="3.8" y1="4.8" x2="4.8" y2="5.8"/><path d="M9 17h8a3 3 0 0 0 0-6 5 5 0 0 0-9.7-1"/></svg>
    );
    case 'cloud': return (
      <svg {...props}><path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1A4 4 0 0 0 7 18z"/></svg>
    );
    case 'rain': return (
      <svg {...props}><path d="M7 14h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1A4 4 0 0 0 7 14z"/><line x1="8" y1="17" x2="8" y2="20"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="16" y1="17" x2="16" y2="20"/></svg>
    );
    case 'thunder': return (
      <svg {...props}><path d="M7 14h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1A4 4 0 0 0 7 14z"/><polyline points="11,17 9,21 13,21 11,23"/></svg>
    );
    default: return null;
  }
}
function ThemeIcon({mode}){
  const props = { width:14, height:14, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round' };
  return mode === 'light'
    ? (<svg {...props}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.9" y2="6.9"/><line x1="17.1" y1="17.1" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.9" y2="17.1"/><line x1="17.1" y1="6.9" x2="19.1" y2="4.9"/></svg>)
    : (<svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>);
}

// ──────────────────────────────────────────────────────────────────────
// Top bar
function TopBar({focusPlant, plants, agg, onPlantChange, tenant, tenantIdx, onTenant, onBack, lang, onLang, theme, onTheme}){
  const clock = useClock();
  const zh = lang !== 'en';
  const [plantPickerOpen, setPlantPickerOpen] = useState(false);
  const [overview, setOverview] = useState(null);
  const pickerRef = React.useRef(null);
  // Click-outside + ESC to close the plant picker
  React.useEffect(()=>{
    if(!plantPickerOpen) return;
    const onDown = e => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPlantPickerOpen(false);
      }
    };
    const onKey = e => { if(e.key==='Escape') setPlantPickerOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return ()=>{
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [plantPickerOpen]);

  // When no plant is focused, fetch overview KPIs from API
  useEffect(() => {
    if (focusPlant) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await window.IRUN_FETCH?.getPlantPowerGenerationOverview?.();
        if (!cancelled) setOverview(res || null);
      } catch (e) {
        if (!cancelled) setOverview(null);
        console.warn('getPlantPowerGenerationOverview failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, [focusPlant?.id]);

  const A = agg || _AGG;
  const k = focusPlant
    ? {
        // 将 plant 上下文合并进 k，便于上层直接使用（id/name/enName/alarmStatus/alarmList 等）
        ...focusPlant,
        cap: focusPlant?.installCapacity ? Number(focusPlant.installCapacity) : 0,
        pwr: focusPlant?.power ? Number(focusPlant.power) : 0,
        gen: focusPlant?.dayEnergy ? Number(focusPlant.dayEnergy) : 0,
        al: focusPlant?.alarmTotal ? Number(focusPlant.alarmTotal) : 0,
        plants: 1,
        risk: focusPlant.risk === 'high' ? 1 : 0,
        pendingAlerts: Number(focusPlant.pendingAlerts ?? 0),
        noiseReductionRate:focusPlant?.noiseReductionRate? Number(focusPlant.noiseReductionRate ?? 0):0,
        powerRate: ((Number(focusPlant?.power || 0) / (Number(focusPlant?.installCapacity || 0) || 1)) * 100).toFixed(2),
      }
    : (overview
        ? {
          ...overview,
            cap: Number(overview.cap || 0),
            pwr: Number(overview.pwr || 0),
            gen: Number(overview.gen || 0),
            al:  Number(overview.al  || 0),
            plants: A.plants,
            risk: Number(overview.risk || 0),
            noiseReductionRate: Number(overview.noiseReductionRate ?? 0),
            pendingAlerts: Number(overview.pendingAlerts ?? 0),
          }
        : {
            cap: A.capacity, pwr: A.power, gen: A.gen, al: A.alerts,
            plants: A.plants, risk: A.risk,
            noiseReductionRate: 0,
            pendingAlerts: 0,
          });
  const displayPwr = theme === 'dark' ? 0 : k.pwr;
  const util = theme === 'dark'
    ? '0.00'
    : (k.powerRate ?? ((Number(k.pwr || 0) / (Number(k.cap || 0) || 1)) * 100).toFixed(1));
  const yoy = React.useMemo(() => (Math.random() * 10).toFixed(1), [focusPlant?.id]);

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark"><img src="irun-icon.png" alt="iRun" className="brand-icon"/></div>
        <div className="brand-text">
          <b>iRUN<span style={{color:'var(--cyan)'}}>·</span>WORKBENCH</b>
        </div>
      </div>

      <div className="crumbs">
        <span className={`crumb crumb-top ${!focusPlant?'active':''}`} onClick={onBack} style={{cursor:focusPlant?'pointer':'default'}}>{zh?'总览':'Overview'}</span>
        {focusPlant && <>
          <div className="crumb-picker" ref={pickerRef}>
            <button type="button"
                    className={`crumb active picker-btn${plantPickerOpen?' open':''}`}
                    onMouseDown={(e)=>{
                      e.preventDefault();
                      e.stopPropagation();
                      setPlantPickerOpen(o=>!o);
                    }}>
              <span className="picker-btn-name">{zh ? focusPlant.name : (focusPlant.enName || focusPlant.name)}</span>
              <span className={`picker-caret${plantPickerOpen?' open':''}`}>▼</span>
            </button>
            {plantPickerOpen && (
              <div className="crumb-picker-menu" onMouseDown={e=>e.stopPropagation()}>
                <div className="cpm-h">{zh?'切换电站':'Switch Plant'}</div>
                {(plants||[]).map(p=>(
                  <div key={p.id}
                       className={`cpm-item${p.id===focusPlant.id?' active':''}`}
                       onMouseDown={(e)=>{
                         e.preventDefault();
                         e.stopPropagation();
                         onPlantChange?.(p.id);
                         setPlantPickerOpen(false);
                       }}>
                    <span className={`cpm-dot cpm-dot-${p.risk||'low'}`}/>
                    <span className="cpm-name">{zh ? p.name : (p.enName || p.name)}</span>
                    <span className="cpm-meta">{p.power.toFixed(1)} kWp</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>}
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="l">{zh?'在管电站':'Stations'}</div>
          <div className="v mono">{k.plants}<small>{zh?`座 · ${focusPlant?'当前聚焦':'全租户'}`:`· ${focusPlant?'Current':'All'}`}</small></div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'装机容量':'Capacity'}</div>
          <div className="v mono">{k.cap.toFixed(2)}<small>MWp</small></div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'实时功率':'Live Power'}</div>
          <div className="v mono" style={{whiteSpace:'nowrap'}}>{displayPwr.toFixed(2)}<small>MW · {util}%</small></div>
          <div className="kpi-bar"><i style={{width:util+'%'}}/></div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'今日发电':"Today's Gen"}</div>
          <div className="v mono">{k.gen.toFixed(2)}<small>MWh</small></div>
          <div className="delta">▲ {yoy}% · {zh?'同比':'YoY'}</div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'活跃告警':'Alerts'}</div>
          <div className="v mono" style={{color: k.al>10?'var(--rose)':'#fff'}}>
            {k.al}
            <small>{zh?`条 · 待研判 ${Math.max(0, k.pendingAlerts ?? Math.max(0,k.al-12))}`:`· Pending ${Math.max(0, k.pendingAlerts ?? Math.max(0,k.al-12))}`}</small>
          </div>
          <div className="delta warn">{zh?'告警去噪率 '+k.noiseReductionRate+'%':'Noise Reduction '+k.noiseReductionRate+'%'}</div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'KPI 风险':'KPI Risk'}</div>
          <div className="v mono" style={{color: k.risk?'var(--amber)':'var(--emerald)'}}>{k.risk}<small>{zh?'站需关注':' Needs Attn'}</small></div>
          <div className="delta">{zh?'运营智能体 · 持续监测':'Ops Agent · Monitoring'}</div>
        </div>
      </div>

      <div className="right">
        <div className="r-row r-row-top">
          <div className="live-wrap">
            <div className="live-time">
              <span className="dt">{fmtDate(clock)}</span>
              <span className="tm">{fmtTime(clock)}</span>
            </div>
          </div>
          <button className="lang-toggle" onClick={onLang} title={zh?'Switch to English':'切换中文'}>
            <span className={zh?'lt-active':''}> 中 </span>
            <span className="lt-sep">/</span>
            <span className={!zh?'lt-active':''}>EN</span>
          </button>
        </div>
        <div className="r-row r-row-bot">
          {(() => {
            const w = pickWx(focusPlant?.id || tenant?.id);
            return (
              <div className="weather-pill" title={`${zh?w.cn:w.en} · ${w.temp}°C`}>
                <WxIcon type={w.icon}/>
                <span className="wx-name">{zh?w.cn:w.en}</span>
                <span className="wx-sep">·</span>
                <span className="wx-t">{w.temp}°C</span>
              </div>
            );
          })()}
          <button className="theme-toggle" onClick={onTheme}
                  title={theme==='light' ? (zh?'切换到暗色':'Switch to Dark') : (zh?'切换到亮色':'Switch to Light')}>
            <ThemeIcon mode={theme}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Live event stream (left) — 仅展示 data.js GLOBAL_EVENT_TEMPLATES，按时间序逐条推送并滚动
function EventStream({onCollapse}){
  const l = useLang(); const zh = l !== 'en';
  const containerRef = useRef(null);

  const allEvents = React.useMemo(() => {
    return [..._GET]
      .map((tpl, i) => ({ id: `global-${i}`, ...tpl }))
      .sort((a, b) => {
        const ta = new Date(String(a.date).replace(' ', 'T')).getTime();
        const tb = new Date(String(b.date).replace(' ', 'T')).getTime();
        return ta - tb;
      });
  }, []);

  const [visibleCount, setVisibleCount] = useState(0);

  // 逐条揭示事件（数据源不变，仅恢复「实时流入」滚动体验）
  useEffect(() => {
    if (!allEvents.length) return;
    const seed = Math.min(8, allEvents.length);
    setVisibleCount(seed);
    if (allEvents.length <= seed) return;
    let cur = seed;
    const id = setInterval(() => {
      cur += 1;
      setVisibleCount(cur);
      if (cur >= allEvents.length) clearInterval(id);
    }, 2800);
    return () => clearInterval(id);
  }, [allEvents]);

  const list = allEvents.slice(0, visibleCount);

  // 新事件进入时平滑滚到底部
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [visibleCount, zh]);

  return (
    <div className="panel stream corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="实时事件流" e="Event Stream"/></span>
        <span style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-mute)',fontSize:10}}>
          <button className="panel-collapse" onClick={onCollapse} title="收起">‹</button>
        </span>
      </div>
      <div className="stream-body">
        <div className="stream-list" ref={containerRef}>
          {list.map(e=>{
            const ag = _ABI[e.agent];
            const cat = ag && _CATS[ag.cat];
            const time = new Date(String(e.date).replace(' ', 'T'));
            const evtText = (!zh && e.en) ? e.en : e.text;
            return (
              <div key={e.id} className={`evt sev-${e.sev||'low'}`}>
                <div className="row1">
                  <span className="mono">{fmtDateTime(time)}</span>
                  <span className="ag" style={{color:cat?.color,borderColor:cat?cat.color+'55':undefined}}>{ag?.code}</span>
                  <span className="who">{zh ? ag?.short : ag?.en}</span>
                </div>
                <div className="txt">{evtText}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Dispatch / chat panel (right)

// Mock chat sessions — full multi-turn conversations (zh + en)
function sessTitle(s, zh) { return zh ? s.title : (s.enTitle || s.title); }
function sessTime(s, zh) { return zh ? s.t : (s.enT || s.t); }
function msgText(m, zh) { return zh ? m.text : (m.enText || m.text); }

const _SESSIONS_SYS_ZH = '已连接 iRun 数字团队 · 10 智能体在线';
const _SESSIONS_SYS_EN = 'Connected to iRun Digital Team · 10 agents online';

const _SESSIONS_SEED = [
  { id:'s_cur', t:'当前', enT:'Current', dateLabel:'today', agent:'ops', title:'当前会话', enTitle:'Current Session', isCurrent:true,
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'agent', agent:'ops',
        text:'今日 06:00 ~ 现在，3 站托管运行良好。已自主闭环 2 起组串告警，0 起需人工介入。',
        enText:'From 06:00 today through now, 3 managed sites running well. 2 string alarms closed autonomously, 0 requiring manual intervention.' },
    ]},
  { id:'s_h1', t:'09:42', enT:'09:42', dateLabel:'today', agent:'alert', title:'横州渔光 · 组串告警闭环', enTitle:'Hengzhou PV · String Alarm Closed',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@告警 横州渔光 C03 组串又跳了，查一下', enText:'@Alarm Hengzhou PV C03 string tripped again, check it' },
      { role:'agent', agent:'alert',
        text:'已聚类去噪：3 条原始告警归并为 1 起组串异常事件 EVT-A203，已派发诊断。',
        enText:'Clustered & deduplicated: 3 raw alarms merged into 1 string anomaly event EVT-A203; diagnosis dispatched.' },
      { role:'agent', agent:'diag',
        text:'诊断初判：C03-12 组串 IV 偏移 0.42，疑似接线松动；建议派工现场复核。',
        enText:'Initial diagnosis: C03-12 string IV drift 0.42, suspected loose connection; recommend field verification.' },
      { role:'user', text:'@排程 安排明早派单', enText:'@Schedule dispatch for tomorrow morning' },
      { role:'agent', agent:'sched',
        text:'已排入明日 08:00 优先工单，分配给驻站员小李，预计 30 分钟闭环。',
        enText:'Scheduled priority ticket for tomorrow 08:00, assigned to on-site tech Li, est. 30 min to close.' },
      { role:'user', text:'@工单 看看历史相似工单', enText:'@Ticket show similar historical tickets' },
      { role:'agent', agent:'order',
        text:'近 30 天该方阵共 4 起类似工单，3 起为接线松动，1 起为压块腐蚀。',
        enText:'4 similar tickets in this array in the last 30 days: 3 loose connections, 1 clamp corrosion.' },
    ]},
  { id:'s_h2', t:'08:15', enT:'08:15', dateLabel:'today', agent:'query', title:'今日 PR 排名速览', enTitle:"Today's PR Ranking Snapshot",
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@问数 本月各电站 PR 排名？', enText:'@Data Q&A PR ranking by plant this month?' },
      { role:'agent', agent:'query',
        text:'本月 PR 排名 福曦#01 (85.2%) > ILP-Banten (83.9%) > 横州渔光 (82.6%) > 示范站 (81.4%)。',
        enText:'This month PR ranking: Fuxi #01 (85.2%) > ILP-Banten (83.9%) > Hengzhou PV (82.6%) > Demo Site (81.4%).' },
    ]},
  { id:'s_h3', t:'昨日 17:30', enT:'Yesterday 17:30', dateLabel:'earlier', agent:'sched', title:'Banten-A 巡检调度', enTitle:'Banten-A Inspection Scheduling',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@排程 Banten-A 明天需要做一次组串巡检', enText:'@Schedule Banten-A needs a string inspection tomorrow' },
      { role:'agent', agent:'sched',
        text:'已编排 UAV-03 明日 08:30 巡检 · 覆盖 22 个方阵 · 预计 142 分钟。',
        enText:'UAV-03 scheduled tomorrow 08:30 · 22 arrays · est. 142 min.' },
      { role:'user', text:'@巡检 巡检覆盖率？', enText:'@Inspect inspection coverage?' },
      { role:'agent', agent:'insp',
        text:'本周累计巡检覆盖率 87%，剩余 13% 计划本周末完成。',
        enText:'Cumulative inspection coverage this week 87%; remaining 13% planned for this weekend.' },
      { role:'user', text:'@安全 巡检期间是否有作业冲突？', enText:'@Safety any work conflicts during inspection?' },
      { role:'agent', agent:'safe',
        text:'08:30-11:00 时段无登高作业冲突，可安全执行无人机巡检。',
        enText:'08:30–11:00 window has no elevated-work conflicts; drone inspection can proceed safely.' },
      { role:'user', text:'@工单 自动派单', enText:'@Ticket auto-dispatch' },
      { role:'agent', agent:'order',
        text:'已生成工单 W-2625-007，派发驻站员李工，已通知。',
        enText:'Ticket W-2625-007 generated, assigned to on-site engineer Li, notified.' },
    ]},
  { id:'s_h4', t:'昨日 14:08', enT:'Yesterday 14:08', dateLabel:'earlier', agent:'pv', title:'光伏组件 SOP 检索', enTitle:'PV Module SOP Lookup',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@光伏 组件绝缘检测的标准流程？', enText:'@PV Assist standard procedure for module insulation test?' },
      { role:'agent', agent:'pv',
        text:'SOP-PV-211 组件绝缘检测，包含 6 步关键操作与 3 项安全注意，是否查看完整文档？',
        enText:'SOP-PV-211 module insulation test — 6 key steps & 3 safety notes; view full document?' },
      { role:'user', text:'是的，发给我', enText:'Yes, send it' },
      { role:'agent', agent:'pv',
        text:'已发送至工作台 → 文档中心 → SOP-PV-211。建议巡检前阅读。',
        enText:'Sent to Workbench → Document Center → SOP-PV-211. Recommend reading before inspection.' },
    ]},
  { id:'s_h5', t:'昨日 10:42', enT:'Yesterday 10:42', dateLabel:'earlier', agent:'safe', title:'高风险作业 24h 检视', enTitle:'High-Risk Work 24h Review',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@安全 未来 24h 高风险作业有哪些？', enText:'@Safety what high-risk work in the next 24h?' },
      { role:'agent', agent:'safe',
        text:'未来 24h：3 项登高作业、1 项带电检修；已对应推送防护建议。',
        enText:'Next 24h: 3 elevated tasks, 1 live electrical work; protection recommendations pushed.' },
      { role:'user', text:'@安全 带电检修是哪个站？', enText:'@Safety which site for live electrical work?' },
      { role:'agent', agent:'safe',
        text:'示范站 INV-04 直流侧检修，作业人 2 名，已要求落实双人监护。',
        enText:'Demo Site INV-04 DC-side repair, 2 workers, dual-supervision required.' },
      { role:'user', text:'@排程 调整时间到下午', enText:'@Schedule move to afternoon' },
      { role:'agent', agent:'sched',
        text:'已与现场协调，作业时间调整至 14:00-16:00，避开早间发电高峰。',
        enText:'Coordinated with site; work rescheduled to 14:00–16:00, avoiding morning peak generation.' },
    ]},
  { id:'s_h6', t:'05-24 16:20', enT:'05-24 16:20', dateLabel:'earlier', agent:'diag', title:'东源 #01 IV 偏移诊断', enTitle:'Dongyuan #01 IV Drift Diagnosis',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@诊断 东源 #01 最近 IV 曲线异常', enText:'@Diagnose Dongyuan #01 recent IV curve anomalies' },
      { role:'agent', agent:'diag',
        text:'近 7 天检测到 5 处 IV 偏移，主要集中在 P3 方阵 INV-04 ~ INV-06。',
        enText:'5 IV drifts detected in the last 7 days, mainly P3 array INV-04 ~ INV-06.' },
      { role:'user', text:'@诊断 给出可能原因', enText:'@Diagnose possible causes' },
      { role:'agent', agent:'diag',
        text:'可能原因：① 组件 PID 衰减 (置信 64%)；② 组件遮挡 (置信 22%)；③ 接线箱接触不良 (置信 14%)。',
        enText:'Possible causes: ① PID degradation (64%); ② shading (22%); ③ junction box contact issue (14%).' },
      { role:'user', text:'@巡检 安排现场排查', enText:'@Inspect arrange on-site check' },
      { role:'agent', agent:'insp',
        text:'UAV 巡检已安排明日 09:00，结合 IV 数据生成定向检测路径。',
        enText:'UAV inspection scheduled tomorrow 09:00, directional path from IV data.' },
      { role:'user', text:'@光伏 PID 治理方案', enText:'@PV Assist PID mitigation plan' },
      { role:'agent', agent:'pv',
        text:'推荐夜间正向偏压治理，连续 7 晚每晚 8h；预计恢复 75% 衰减功率。',
        enText:'Recommend nightly forward-bias treatment, 8h × 7 nights; est. 75% power recovery.' },
    ]},
  { id:'s_h7', t:'05-24 09:00', enT:'05-24 09:00', dateLabel:'earlier', agent:'ops', title:'iRun 日报生成 · 周一', enTitle:'iRun Daily Report · Monday',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'agent', agent:'ops',
        text:'周一日报已生成：可用率 99.42%、PR 82.8%、人均工单 3.5 张，3 项 KPI 风险已转工单。',
        enText:'Monday report generated: availability 99.42%, PR 82.8%, 3.5 tickets per person, 3 KPI risks escalated to tickets.' },
    ]},
  { id:'s_h8', t:'05-23 11:15', enT:'05-23 11:15', dateLabel:'earlier', agent:'order', title:'工单合并方案审议', enTitle:'Ticket Merge Plan Review',
    msgs:[
      { role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN },
      { role:'user', text:'@工单 今日待处理工单太分散，能不能合并？', enText:"@Ticket today's pending tickets are too scattered — can we merge?" },
      { role:'agent', agent:'order',
        text:'今日 14 张工单可合并为 8 张，节省 38 km、56 min。',
        enText:"Today's 14 tickets can merge into 8, saving 38 km and 56 min." },
      { role:'user', text:'@排程 出一份合并方案', enText:'@Schedule produce a merge plan' },
      { role:'agent', agent:'sched',
        text:'合并方案已生成 · 1 人 1 车 1 趟 · 节省里程 38 km、节省时间 56 min。',
        enText:'Merge plan ready · 1 person, 1 vehicle, 1 trip · saves 38 km and 56 min.' },
      { role:'user', text:'@安全 合并后作业是否安全', enText:'@Safety is merged work safe?' },
      { role:'agent', agent:'safe',
        text:'合并后无作业冲突，已审核通过。',
        enText:'No work conflicts after merge; approved.' },
      { role:'user', text:'@工单 按方案下发', enText:'@Ticket dispatch per plan' },
      { role:'agent', agent:'order',
        text:'14 张工单已重排为 8 张派单，已通知现场人员。',
        enText:'14 tickets re-dispatched as 8 orders; field staff notified.' },
      { role:'user', text:'@运营 跟踪结果', enText:'@Operate track results' },
      { role:'agent', agent:'ops',
        text:'已开启工单闭环跟踪，每 30 分钟同步进度至本对话。',
        enText:'Ticket close-loop tracking enabled; progress synced to this chat every 30 min.' },
      { role:'user', text:'@运营 完成情况', enText:'@Operate completion status' },
      { role:'agent', agent:'ops',
        text:'截至 17:00，8 张工单已闭环 7 张，1 张延期至明早。',
        enText:'As of 17:00, 7 of 8 tickets closed; 1 deferred to tomorrow morning.' },
    ]},
];

// ── Dispatch chat helpers (PV Expo Q&A + streaming) ───────────────────
function parseAgentFromText(text) {
  const m = String(text || '').match(/^@(\S+)/);
  if (!m) return null;
  const token = m[1];
  return _AGENTS.find(a => a.short === token || a.en === token) || null;
}

function stripAgentPrefix(text) {
  return String(text || '').replace(/^@\S+\s*/, '').trim();
}

function splitAgentCommand(text) {
  const raw = String(text || '');
  const m = raw.match(/^(@\S+\s*)(.*)$/);
  return m ? { prefix: m[1], body: m[2].trim() } : { prefix: '', body: raw.trim() };
}

function getKnownPlantNames() {
  const plants = window.IRUN?.PLANTS || [];
  return plants
    .flatMap(p => [p?.name, p?.enName, p?.short])
    .filter(Boolean)
    .map(x => String(x).trim())
    .filter(Boolean);
}

function includesKnownPlantName(text) {
  const s = String(text || '');
  return getKnownPlantNames().some(name => s.includes(name));
}

function isKnownPlantName(text) {
  const s = String(text || '').trim();
  return getKnownPlantNames().some(name => s === name);
}

function extractPlantNameFromInput(text) {
  const { body } = splitAgentCommand(text);
  if (!body) return '';
  if (isKnownPlantName(body)) return body;
  const names = [...new Set(getKnownPlantNames())].sort((a, b) => b.length - a.length);
  return names.find(name => body.includes(name)) || '';
}

function composePlantInput(text, plantName) {
  const name = String(plantName || '').trim();
  if (!name) return text;
  const { prefix, body } = splitAgentCommand(text);
  if (!body) return prefix + name;
  if (isKnownPlantName(body)) return prefix + name;
  if (includesKnownPlantName(body)) return text;
  return prefix + name + body;
}

function composeQuestionInput(prefix, question, plantName) {
  const q = String(question || '').trim();
  const name = String(plantName || '').trim();
  if (!name || includesKnownPlantName(q)) return prefix + q;
  return prefix + name + q;
}

function stripPlantNameFromQuestion(text, plant) {
  let clean = stripAgentPrefix(text);
  const names = [...new Set([
    ...getKnownPlantNames(),
    plant?.name, plant?.enName, plant?.short,
  ].filter(Boolean).map(x => String(x).trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (clean.startsWith(name)) {
      clean = clean.slice(name.length).trim();
      break;
    }
  }
  return clean;
}

function normQaText(s) {
  return String(s).trim().toLowerCase();
}

function findExpoQAFuzzy(list, cleanText) {
  const c = normQaText(cleanText);
  if (!c) return null;

  const exact = list.find(x => normQaText(x.qZh) === c || normQaText(x.qEn) === c);
  if (exact) return exact;

  const questionInInput = list.filter(x =>
    c.includes(normQaText(x.qZh)) || c.includes(normQaText(x.qEn))
  );
  if (questionInInput.length === 1) return questionInInput[0];

  const contains = list.filter(x =>
    normQaText(x.qZh).includes(c) || normQaText(x.qEn).includes(c) ||
    c.split(/\s+/).filter(Boolean).every(tok =>
      normQaText(x.qZh).includes(tok) || normQaText(x.qEn).includes(tok)
    )
  );
  if (contains.length === 1) return contains[0];

  const byKey = list.filter(x =>
    (x.matchKeys || []).some(k => c.includes(normQaText(k))) ||
    normQaText(x.qZh).includes(c) || normQaText(x.qEn).includes(c)
  );
  if (byKey.length === 1) return byKey[0];
  return null;
}

function findQueryQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_QUERY_QA || [], cleanText);
}

function findOpsQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_OPS_QA || [], cleanText);
}

function findSafeQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_SAFE_QA || [], cleanText);
}

function findDiagQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_DIAG_QA || [], cleanText);
}

function findInspQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_INSP_QA || [], cleanText);
}

function findWarnQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_WARN_QA || [], cleanText);
}

function findSchedQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_SCHED_QA || [], cleanText);
}

function findOrderQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_ORDER_QA || [], cleanText);
}

function findAlertQA(cleanText) {
  return findExpoQAFuzzy(window.IRUN?.PV_EXPO_ALERT_QA || [], cleanText);
}

function findExpoQA(agentId, cleanText) {
  const c = normQaText(cleanText);
  if (!c) return null;
  if (agentId === 'query') return findQueryQA(cleanText);
  if (agentId === 'ops') return findOpsQA(cleanText);
  if (agentId === 'safe') return findSafeQA(cleanText);
  if (agentId === 'diag') return findDiagQA(cleanText);
  if (agentId === 'insp') return findInspQA(cleanText);
  if (agentId === 'warn') return findWarnQA(cleanText);
  if (agentId === 'sched') return findSchedQA(cleanText);
  if (agentId === 'order') return findOrderQA(cleanText);
  if (agentId === 'alert') return findAlertQA(cleanText);
  const key = agentId === 'pv' ? 'PV_EXPO_QA'
    : null;
  if (!key) return null;
  const list = window.IRUN?.[key] || [];
  return list.find(x => normQaText(x.qZh) === c || normQaText(x.qEn) === c) || null;
}

function pickExpoAnswer(hit, cleanText, zh) {
  if (!hit) return '';
  if (normQaText(hit.qEn) === normQaText(cleanText)) return hit.aEn;
  if (normQaText(hit.qZh) === normQaText(cleanText)) return hit.aZh;
  return zh ? hit.aZh : hit.aEn;
}

function parseStreamSegments(md) {
  const lines = String(md ?? '').split('\n');
  const segments = [];
  let buf = [];
  const flush = () => {
    if (buf.length) {
      segments.push({ type: 'text', text: buf.join('\n') });
      buf = [];
    }
  };
  for (const line of lines) {
    const pauseM = line.trim().match(/^pause\s*[:：]\s*(\d+(?:\.\d+)?)\s*s\s*$/i);
    if (pauseM) {
      flush();
      segments.push({ type: 'pause', ms: parseFloat(pauseM[1]) * 1000 });
    } else {
      buf.push(line);
    }
  }
  flush();
  return segments;
}

function resolveAgentReply(text, agentId, plant, zh) {
  const cleanText = stripPlantNameFromQuestion(text, plant);
  const hit = findExpoQA(agentId, cleanText);
  if (hit) {
    return {
      stream: true,
      text: pickExpoAnswer(hit, cleanText, zh),
    };
  }
  if (agentId === 'query' || agentId === 'ops' || agentId === 'safe' || agentId === 'diag' || agentId === 'insp' || agentId === 'warn' || agentId === 'sched' || agentId === 'order' || agentId === 'alert') {
    return {
      stream: false,
      text: zh
        ? '请从下方推荐问题中选择，或输入完整问题。'
        : 'Please pick a suggested question below, or type the full question.',
    };
  }
  return { stream: false, text: respondTo(text, agentId, plant) };
}

function DispatchPanel({focusPlant, dispatchPlantCtx, selectedAgent, onSelectAgent, onClearDispatchPlantCtx, onOpenAgent, onCollapse, mode, onDispatchCommand}){
  const [sessions, setSessions] = useState(_SESSIONS_SEED);
  const [currentId, setCurrentId] = useState('s_cur');
  const [input, setInput] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [activePlantCtx, setActivePlantCtx] = useState(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const renameInputRef = useRef(null);
  const streamAbortRef = useRef(null);
  const prevSelectedAgentRef = useRef(null);
  const l = useLang(); const zh = l !== 'en';
  const plantCtx = dispatchPlantCtx || focusPlant || null;
  const plantName = activePlantCtx?.name || '';
  const bindPlantToQuestions = !!activePlantCtx?.bindToQuestions;

  function consumePlantCtx() {
    setActivePlantCtx(null);
    onClearDispatchPlantCtx?.();
  }

  useEffect(() => () => { streamAbortRef.current?.abort?.(); }, []);

  function startStreamReply(sessionId, msgIndex, fullText) {
    streamAbortRef.current?.abort?.();
    const ac = new AbortController();
    streamAbortRef.current = ac;
    const { signal } = ac;
    const CHAR_DELAY = 16;
    const CHUNK = 3;

    (async () => {
      const segments = parseStreamSegments(fullText);
      let accumulated = '';

      const update = (text, streaming) => {
        setSessions(prev => prev.map(s => {
          if (s.id !== sessionId) return s;
          const msgs = s.msgs.map((m, i) =>
            i === msgIndex ? { ...m, text, streaming } : m
          );
          return { ...s, msgs };
        }));
      };

      const sleep = ms => new Promise((res, rej) => {
        const t = setTimeout(res, ms);
        signal.addEventListener('abort', () => { clearTimeout(t); rej(new Error('abort')); }, { once: true });
      });

      try {
        for (const seg of segments) {
          if (signal.aborted) return;
          if (seg.type === 'pause') {
            await sleep(seg.ms);
            continue;
          }
          const chars = [...seg.text];
          for (let i = 0; i < chars.length; i += CHUNK) {
            if (signal.aborted) return;
            accumulated += chars.slice(i, i + CHUNK).join('');
            update(accumulated, true);
            await sleep(CHAR_DELAY);
          }
        }
        if (!signal.aborted) update(accumulated, false);
      } catch (e) {
        if (!signal.aborted) update(accumulated, false);
      }
    })();
  }

  function startRename(s, e){
    e?.stopPropagation();
    setEditingId(s.id);
    setEditValue(sessTitle(s, zh));
    setTimeout(()=>{
      if (renameInputRef.current){
        renameInputRef.current.focus();
        renameInputRef.current.select();
      }
    }, 30);
  }
  function commitRename(){
    if (!editingId) return;
    const v = editValue.trim();
    if (v) {
      setSessions(prev => prev.map(s => s.id===editingId
        ? (zh ? {...s, title:v} : {...s, enTitle:v})
        : s));
    }
    setEditingId(null);
    setEditValue('');
  }
  function cancelRename(){
    setEditingId(null);
    setEditValue('');
  }
  function deleteSession(id, e){
    e?.stopPropagation();
    if (currentId === id) streamAbortRef.current?.abort?.();
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      // ensure there's always at least one session
      if (next.length === 0){
        const fresh = { id:'s_cur', t:'当前', enT:'Current', dateLabel:'today', agent:'ops',
          title:'当前会话', enTitle:'Current Session', isCurrent:true,
          msgs:[{ role:'sys', text:_SESSIONS_SYS_ZH, enText:_SESSIONS_SYS_EN }] };
        if (currentId === id) setCurrentId('s_cur');
        return [fresh];
      }
      if (currentId === id) setCurrentId(next[0].id);
      return next;
    });
  }

  const currentSession = sessions.find(s => s.id === currentId) || sessions[0];
  const messages = currentSession.msgs;

  useEffect(()=>{
    if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  },[messages, currentId]);

  // Filter + sort history list
  const filteredSessions = sessions.filter(s => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return sessTitle(s, zh).toLowerCase().includes(q) ||
           s.msgs.some(m => msgText(m, zh).toLowerCase().includes(q));
  });

  function selectSession(id){
    streamAbortRef.current?.abort?.();
    setCurrentId(id);
    setHistoryOpen(false);
    setInput('');
    onSelectAgent?.(null);
  }

  function newSession(){
    streamAbortRef.current?.abort?.();
    const id = 's_' + Date.now();
    const now = new Date();
    const p = n => String(n).padStart(2,'0');
    const tLabel = `${p(now.getHours())}:${p(now.getMinutes())}`;
    const fresh = {
      id, t: tLabel, enT: tLabel, dateLabel:'today', agent:'ops',
      title: zh?'新会话':'New Session', enTitle:'New Session', isCurrent:true,
      msgs:[
        { role:'sys',
          text: zh?'已开始新会话 · iRun 数字团队待命':'New session started · iRun team standby',
          enText:'New session started · iRun team standby' },
      ],
    };
    setSessions(prev => [fresh, ...prev]);
    setCurrentId(id);
    setHistoryOpen(false);
    setInput('');
    onSelectAgent?.(null);
    setTimeout(()=>{ inputRef.current?.focus(); }, 50);
  }

  // Sync one-shot plant context from map click (consumed on agent switch / send / quick chip).
  useEffect(()=>{
    if (!dispatchPlantCtx?.clickKey) return;
    if (dispatchPlantCtx?.name) {
      setActivePlantCtx({
        id: dispatchPlantCtx.id,
        name: dispatchPlantCtx.name,
        bindToQuestions: !!dispatchPlantCtx.bindPlantToQuestions,
      });
    }
  }, [dispatchPlantCtx?.clickKey, dispatchPlantCtx?.id, dispatchPlantCtx?.name, dispatchPlantCtx?.bindPlantToQuestions]);

  // When an agent is selected, auto-prefill `@<agent> ` into the input and focus it
  useEffect(()=>{
    if (!selectedAgent) {
      prevSelectedAgentRef.current = null;
      return;
    }
    const ag = _ABI[selectedAgent];
    if (!ag) return;
    const prefix = `@${zh ? ag.short : ag.en} `;
    const switched = prevSelectedAgentRef.current && prevSelectedAgentRef.current !== selectedAgent;
    if (switched) consumePlantCtx();
    const pendingPlant = activePlantCtx?.name || dispatchPlantCtx?.name;
    setInput(prev => {
      const current = splitAgentCommand(prev);
      if (switched || current.prefix) return prefix;
      if (pendingPlant && isKnownPlantName(current.body)) return prefix + current.body;
      return prefix;
    });
    prevSelectedAgentRef.current = selectedAgent;
    setTimeout(()=>{
      if (inputRef.current){
        inputRef.current.focus();
        const v = inputRef.current.value;
        inputRef.current.setSelectionRange(v.length, v.length);
      }
    }, 30);
  },[selectedAgent]);

  // Clicking a plant on the map can push context into dispatch input.
  useEffect(()=>{
    const name = dispatchPlantCtx?.name;
    if (!name) return;
    setInput(prev => dispatchPlantCtx?.resetInput ? name : composePlantInput(prev, name));
    setTimeout(()=>{ inputRef.current?.focus(); }, 0);
  }, [dispatchPlantCtx?.id, dispatchPlantCtx?.name, dispatchPlantCtx?.resetInput, dispatchPlantCtx?.clickKey]);

  const send = (text, agentIdOverride) => {
    if (!text.trim()) return;
    const parsed = parseAgentFromText(text);
    const targetId = agentIdOverride || parsed?.id || selectedAgent;
    if (!targetId) return;

    // In command mode → dispatch a walking robot with the cleaned command text
    if (mode === 'command' && onDispatchCommand){
      const cleanText = stripAgentPrefix(text);
      onDispatchCommand(targetId, cleanText || text);
    }

    const reply = resolveAgentReply(text, targetId, plantCtx, zh);
    const userMsg = { role:'user', text };
    const agentMsg = reply.stream
      ? { role:'agent', agent: targetId, text: '', streaming: true }
      : { role:'agent', agent: targetId, text: reply.text };

    const sid = currentId;
    setSessions(prev => prev.map(s => {
      if (s.id !== sid) return s;
      const newMsgs = [...s.msgs, userMsg, agentMsg];
      const isFirstUser = !s.msgs.some(m => m.role === 'user');
      const cleanText = stripAgentPrefix(text);
      const newTitle = isFirstUser && cleanText
        ? cleanText.slice(0, 18) + (cleanText.length>18?'…':'')
        : s.title;
      if (reply.stream) {
        const msgIdx = newMsgs.length - 1;
        setTimeout(() => startStreamReply(sid, msgIdx, reply.text), 0);
      }
      return { ...s, msgs: newMsgs, title: newTitle, agent: targetId };
    }));
    if (activePlantCtx?.name && text.includes(activePlantCtx.name)) consumePlantCtx();
    setInput('');
    onSelectAgent?.(null);
  };

  const parsedInputAgent = parseAgentFromText(input);
  const qaInput = stripPlantNameFromQuestion(input, plantCtx);
  const queryHit = parsedInputAgent?.id === 'query' ? findQueryQA(qaInput) : null;
  const opsHit = parsedInputAgent?.id === 'ops' ? findOpsQA(qaInput) : null;
  const safeHit = parsedInputAgent?.id === 'safe' ? findSafeQA(qaInput) : null;
  const diagHit = parsedInputAgent?.id === 'diag' ? findDiagQA(qaInput) : null;
  const inspHit = parsedInputAgent?.id === 'insp' ? findInspQA(qaInput) : null;
  const warnHit = parsedInputAgent?.id === 'warn' ? findWarnQA(qaInput) : null;
  const schedHit = parsedInputAgent?.id === 'sched' ? findSchedQA(qaInput) : null;
  const orderHit = parsedInputAgent?.id === 'order' ? findOrderQA(qaInput) : null;
  const alertHit = parsedInputAgent?.id === 'alert' ? findAlertQA(qaInput) : null;
  const expoHit = parsedInputAgent && ['pv'].includes(parsedInputAgent.id)
    ? findExpoQA(parsedInputAgent.id, qaInput)
    : null;
  const canSend = !!parsedInputAgent && qaInput.length > 0 && (
    parsedInputAgent.id === 'query' ? !!queryHit
    : parsedInputAgent.id === 'ops' ? !!opsHit
    : parsedInputAgent.id === 'safe' ? !!safeHit
    : parsedInputAgent.id === 'diag' ? !!diagHit
    : parsedInputAgent.id === 'insp' ? !!inspHit
    : parsedInputAgent.id === 'warn' ? !!warnHit
    : parsedInputAgent.id === 'sched' ? !!schedHit
    : parsedInputAgent.id === 'order' ? !!orderHit
    : parsedInputAgent.id === 'alert' ? !!alertHit
    : ['pv'].includes(parsedInputAgent.id) ? !!expoHit
    : true
  );

  const targetAgent = (parsedInputAgent || (selectedAgent && _ABI[selectedAgent])) || null;
  const chipAgentId = parsedInputAgent?.id || selectedAgent || null;

  return (
    <div className="panel dispatch corners"><span className="c1"/>
      <div className="panel-hd">
        <span style={{display:'flex',alignItems:'center',gap:8}}>
          <button className={`history-toggle${historyOpen?' on':''}`}
                  onClick={()=>setHistoryOpen(v=>!v)}
                  title={zh?'对话历史':'Chat History'}>
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="8" cy="8" r="6.2"/>
              <path d="M8 4.2 V8 L10.4 10"/>
            </svg>
          </button>
          <span className="dot" style={{background:'var(--violet)',boxShadow:'0 0 8px var(--violet)'}}/>
          <T z="对话调度" e="AI Dispatch"/>
        </span>
        <span style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-mute)',fontSize:10}}>
          <button className="panel-collapse" onClick={onCollapse} title="收起">›</button>
        </span>
      </div>

      {/* History flyout — appears to the LEFT of dispatch panel, sliding rightward into view */}
      {historyOpen && (
        <div className="history-flyout">
          <div className="hf-hd">
            <span><T z="对话历史" e="Chat History"/> <em className="hf-count">{sessions.length}</em></span>
            <button className="hf-close" onClick={()=>setHistoryOpen(false)}>×</button>
          </div>
          <div className="hf-search">
            <input placeholder={zh?'搜索历史会话…':'Search history…'}
                   value={searchQ}
                   onChange={e=>setSearchQ(e.target.value)}/>
          </div>
          <div className="hf-list">
            {['today','earlier'].map(group=>{
              const items = filteredSessions.filter(s => s.dateLabel === group);
              if (!items.length) return null;
              return (
                <div key={group} className="hf-group">
                  <div className="hf-group-hd">{group==='today' ? (zh?'今天':'Today') : (zh?'更早':'Earlier')}</div>
                  {items.map(s=>{
                    const ag = _ABI[s.agent];
                    const cat = ag && _CATS[ag.cat];
                    const active = s.id === currentId;
                    const isEditing = editingId === s.id;
                    return (
                      <div key={s.id}
                           className={`hf-item${active?' active':''}${isEditing?' editing':''}`}
                           onClick={()=>{ if (!isEditing) selectSession(s.id); }}
                           title={sessTitle(s, zh)}>
                        <span className="hf-tag" style={{color:cat?.color, borderColor:(cat?.color||'#666')+'55'}}>{ag?.code}</span>
                        <div className="hf-info">
                          {isEditing ? (
                            <input
                              ref={renameInputRef}
                              className="hf-rename-input"
                              value={editValue}
                              onChange={e=>setEditValue(e.target.value)}
                              onBlur={commitRename}
                              onClick={e=>e.stopPropagation()}
                              onKeyDown={e=>{
                                e.stopPropagation();
                                if (e.key==='Enter') commitRename();
                                else if (e.key==='Escape') cancelRename();
                              }}
                            />
                          ) : (
                            <div className="hf-title">{sessTitle(s, zh)}</div>
                          )}
                          <div className="hf-meta">{sessTime(s, zh)}</div>
                        </div>
                        {!isEditing && (
                          <div className="hf-actions">
                            <button className="hf-act-btn" title={zh?'重命名':'Rename'} onClick={(e)=>startRename(s, e)}>
                              <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                                <path d="M2 10 L2 12 L4 12 L11 5 L9 3 Z"/>
                                <path d="M9 3 L11 5"/>
                              </svg>
                            </button>
                            <button className="hf-act-btn hf-act-del" title={zh?'删除':'Delete'} onClick={(e)=>deleteSession(s.id, e)}>
                              <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                                <path d="M3 4 L11 4"/>
                                <path d="M5 4 V3 a1 1 0 0 1 1 -1 h2 a1 1 0 0 1 1 1 V4"/>
                                <path d="M4 4 L4.5 12 a1 1 0 0 0 1 1 h3 a1 1 0 0 0 1 -1 L10 4"/>
                              </svg>
                            </button>
                          </div>
                        )}
                        {active && !isEditing && <span className="hf-active-dot"/>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {filteredSessions.length === 0 && (
              <div className="hf-empty">{zh?'无匹配会话':'No matches'}</div>
            )}
          </div>
          <div className="hf-foot">
            <button className="hf-newbtn" onClick={newSession}>+ {zh?'新建会话':'New Session'}</button>
          </div>
        </div>
      )}

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m,i)=>{
          const body = msgText(m, zh);
          if (m.role==='sys') return <div key={i} className="tag-line" style={{textAlign:'center',padding:'4px 0'}}>· {body} ·</div>;
          const ag = m.role==='agent' ? _ABI[m.agent] : null;
          const cat = ag && _CATS[ag.cat];
          return (
            <div key={i} className={`msg ${m.role}`}>
              <div className="a" style={{borderColor:m.role==='user'?'var(--cyan)':cat?.color, color:m.role==='user'?'var(--cyan)':cat?.color}}>
                {m.role==='user' ? 'YOU' : ag?.code}
              </div>
              <div className="b">
                <div className="name">{m.role==='user' ? (zh?'指挥官':'Commander') : agentName(ag, zh)}</div>
                {m.role === 'agent' ? (
                  <>
                    <Markdown text={body} />
                    {m.streaming && <span className="stream-cursor">▍</span>}
                  </>
                ) : <div>{body}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quick">
        {(() => {
          let list = chipAgentId ? _QP.filter(x => x.a === chipAgentId) : _QP;
          return list.map((q,i)=>{
          const ag = _ABI[q.a];
          const cat = _CATS[ag.cat];
          const qLabel = zh ? q.t : (q.en || q.t);
          const prefix = `@${zh ? ag.short : ag.en} `;
          return (
            <div key={i} className="q-chip" onClick={()=>{
              const plantFromInput = extractPlantNameFromInput(input);
              const effectivePlant = plantName || plantFromInput;
              if (effectivePlant && !includesKnownPlantName(qLabel)) {
                setInput(composeQuestionInput(prefix, qLabel, effectivePlant));
                if (!bindPlantToQuestions) consumePlantCtx();
              } else {
                consumePlantCtx();
                setInput(prefix + qLabel);
              }
              setTimeout(()=>{ inputRef.current?.focus(); }, 0);
            }}>
              <span className="tag" style={{color:cat.color}}>@{zh ? ag.short : ag.en}</span>
              <span>{qLabel}</span>
            </div>
          );
          });
        })()}
      </div>

      <div className="composer">
        <input
          ref={inputRef}
          data-plant-id={activePlantCtx?.id || dispatchPlantCtx?.id || focusPlant?.id || ''}
          data-plant-name={activePlantCtx?.name || dispatchPlantCtx?.name || focusPlant?.name || ''}
          style={targetAgent ? {'--ph-color': _CATS[targetAgent.cat].color} : undefined}
          placeholder={targetAgent
            ? (zh ? `@${targetAgent.short} 输入指令…` : `@${targetAgent.en} type command…`)
            : (zh ? '@智能体 输入指令… 例如：@排程 合并今日工单' : '@agent type command… e.g. @Schedule merge today\'s tickets')}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter' && canSend) send(input); }}
        />
        <button disabled={!canSend} onClick={()=>send(input)}><T z="发送" e="Send"/></button>
      </div>

      {targetAgent && (
        <div className="target-strip target-strip-bottom">
          <span className="lbl"><T z="当前指挥" e="Target"/></span>
          <span className="who" style={{color: _CATS[targetAgent.cat].color}}>
            @{zh ? targetAgent.short : targetAgent.en}{zh ? ` · ${targetAgent.en}` : ''}
          </span>
          <span className="dismiss" onClick={()=>onSelectAgent?.(null)}><T z="清除" e="Clear"/></span>
        </div>
      )}
    </div>
  );
}

function respondTo(text, agentId, plant){
  const ag = _ABI[agentId];
  const ctx = plant ? `（${plant.short}）` : '';
  // PV Expo fixed Q&A: exact-match on the recommended questions (CN/EN)
  if (agentId === 'pv') {
    const cleanText = String(text || '').replace(/^@\S+\s*/, '').trim();
    const list = window.IRUN?.PV_EXPO_QA || [];
    const hit = list.find(x => x && (x.qZh === cleanText || x.qEn === cleanText));
    if (hit) {
      // Return the answer language based on which question was matched.
      return hit.qEn === cleanText ? hit.aEn : hit.aZh;
    }
  }
  // PV Expo (2026) fixed dialogues (fallback; send() uses resolveAgentReply)
  if (agentId === 'query') {
    const cleanText = stripAgentPrefix(text);
    const hit = findQueryQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'ops') {
    const cleanText = stripAgentPrefix(text);
    const hit = findOpsQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'safe') {
    const cleanText = stripAgentPrefix(text);
    const hit = findSafeQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'diag') {
    const cleanText = stripAgentPrefix(text);
    const hit = findDiagQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'insp') {
    const cleanText = stripAgentPrefix(text);
    const hit = findInspQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'warn') {
    const cleanText = stripAgentPrefix(text);
    const hit = findWarnQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'sched') {
    const cleanText = stripAgentPrefix(text);
    const hit = findSchedQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  if (agentId === 'order') {
    const cleanText = stripAgentPrefix(text);
    const hit = findOrderQA(cleanText);
    if (hit) return pickExpoAnswer(hit, cleanText, true);
  }
  // PV Expo (2026) fixed dialogues for Alarm agent
  if (agentId === 'alert') {
    const cleanText = String(text || '').replace(/^@\S+\s*/, '').trim();
    const list = window.IRUN?.PV_EXPO_ALERT_QA || [];
    const hit = list.find(x => x && (x.qZh === cleanText || x.qEn === cleanText));
    if (hit) return hit.qEn === cleanText ? hit.aEn : hit.aZh;
  }
  // canned replies depending on agent
  switch(agentId){
    case 'ops':   return `日报已生成${ctx}：可用率 99.41%、PR 82.6%、人均工单 3.7 张，3 项 KPI 风险已转工单。`;
    case 'query': return `已查询${ctx}：本月 PR 排名 福曦#01 > ILP-Banten > 示范站。图表已嵌入会话。`;
    case 'warn':  return `${ctx}巡查启动，扫描 184 个组串 · 命中 4 处趋势性劣化，已生成预警 W-26052-{04~07}。`;
    case 'insp':  return `${ctx}已编排 UAV-03 明日 08:30 巡检 · 覆盖 22 个方阵 · 预计 142 分钟。`;
    case 'sched': return `合并方案${ctx}已生成 · 1 人 1 车 1 趟 · 节省里程 38 km、节省时间 56 min。`;
    case 'safe':  return `${ctx}未来 24h：3 项登高作业、1 项带电检修 · 已对应推送防护建议。`;
    case 'order': return `${ctx}工单状态：今日新建 9 / 完成 6 / 自动验收 4 / 平均闭环 3h12m。`;
    case 'pv':    return `${ctx}已检索：组串绝缘检测 SOP-PV-211，包含 6 步关键操作与 3 项安全注意。`;
    case 'alert': return `${ctx}事件去噪完成 · 12 条原始告警归并为 4 起待研判，已派发 2 条。`;
    case 'diag':  return `${ctx}诊断初判：4 起事件中 2 起热斑、1 起 IV 偏移、1 起接线松动。`;
    default:      return '已收到指令，开始处理。';
  }
}

// ──────────────────────────────────────────────────────────────────────
// Agent skill matrix (center of dock)
function AgentDock({focusPlant, busyMap, onOpen}){
  const l = useLang(); const zh = l !== 'en';
  const cats = ['management','expert','process','tool'];
  return (
    <div className="panel skill-matrix corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="智能体矩阵" e="Agent Skill Matrix"/></span>
        <span style={{display:'flex',gap:14,color:'var(--text-mute)',fontSize:10,letterSpacing:'0.12em'}}>
          {cats.map(c => {
            const cat = _CATS[c];
            const n = _AGENTS.filter(a=>a.cat===c).length;
            return <span key={c}><i style={{display:'inline-block',width:8,height:8,background:cat.color,marginRight:4,verticalAlign:0}}/>{catLabel(cat, zh)} · {n}</span>;
          })}
        </span>
      </div>
      <div className="matrix-grid">
        {_AGENTS.map(a => {
          const cat = _CATS[a.cat];
          const isOff = focusPlant && !focusPlant.agents.includes(a.id);
          const busy = busyMap?.[a.id];
          const status = isOff
            ? (zh ? '未启用' : 'Off')
            : busy ? (zh ? '工作中' : 'Working')
            : (Math.random()<0.25 ? (zh ? '学习中' : 'Learning') : (zh ? '空闲' : 'Idle'));
          const statusCls = busy ? 'work' : (status===(zh?'学习中':'Learning') ? 'learn' : 'idle');
          return (
            <div key={a.id}
                 className={`agent-card ${busy?'busy':''}`}
                 style={{'--cat-color':cat.color, opacity:isOff?0.35:1}}
                 onClick={()=>onOpen(a.id)}>
              <div className="cat-strip"/>
              <div className="top">
                <div style={{flexShrink:0}}><RobotAvatar agent={a} size={28} glow={busy}/></div>
                <div>
                  <div className="nm">{agentName(a, zh)}</div>
                  <div className="rl">{agentRole(a, zh)}</div>
                </div>
              </div>
              <div className="meta">
                <span className={`badge ${statusCls}`}>{status}</span>
                <span className="tok" title={`${a.metrics.tokens} tok · ${a.metrics.todayCalls} calls`}>{a.metrics.tokens}k·{a.metrics.todayCalls}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Mini map (bottom-left)
function MiniMap({focusPlant, onFocus}){
  return (
    <div className="panel mini-map corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="区域分布" e="Area Map"/></span>
        <span style={{color:'var(--text-mute)',fontSize:10}}>{_PLANTS.length} SITES</span>
      </div>
      <div className="mm-canvas" style={{height:'calc(100% - 38px)'}}>
        <svg viewBox="0 0 260 130" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
          {/* Stylized landmass outline — abstract */}
          <path d="M20 70 Q40 50 65 55 T130 50 Q160 48 185 60 T240 58 L240 100 Q200 110 160 102 T80 105 Q40 110 20 95 Z"
                fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="0.6" strokeDasharray="2 3"/>
          <path d="M70 75 Q100 70 130 72 T200 70" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="0.5"/>
          {/* lat/lng grid */}
          {[20,50,80,110].map(y=><line key={y} x1="0" y1={y} x2="260" y2={y} stroke="rgba(120,160,220,0.05)"/>)}
          {[40,100,160,220].map(x=><line key={x} y1="0" y2="130" x1={x} x2={x} stroke="rgba(120,160,220,0.05)"/>)}
        </svg>
        {_PLANTS.map(p=>{
          const cls = p.risk==='high'?'high':(p.risk==='mid'?'mid':'');
          const focus = focusPlant?.id===p.id;
          return (
            <div key={p.id} className={`mm-marker ${cls} ${focus?'focus':''}`}
                 style={{left:p.x+'%',top:p.y+'%',cursor:'pointer'}}
                 onClick={()=>onFocus(p.id)}
                 title={p.name}/>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Quick functions (bottom-right) — tokens, work orders, KPI
function QuickFuncs({focusPlant, totalTokens, busyCount}){
  const l = useLang(); const zh = l !== 'en';
  const items = [
    { id:'tok', ic:'TK', label: zh?'Token 消耗':'Token Usage', sub: zh?'今日累计 · 全团队':'Today · All Agents', val: (totalTokens/1000).toFixed(1), unit:'K' },
    { id:'wo',  ic:'WO', label: zh?'工单看板':'Work Orders',   sub: zh?'今日 · 新建/完成':'Today · New/Done', val:'14/11', unit:'' },
    { id:'kpi', ic:'PR', label: zh?'PR 指标':'PR Index',       sub: zh?'电站等效满发小时数':'Full-Load Hours', val:'4.62', unit:'h' },
    { id:'rpt', ic:'RP', label: zh?'iRun 日报':'Daily Report', sub: zh?'运营智能体 · 自动生成':'Ops Agent · Auto', val:'06:00', unit:'' },
    { id:'bus', ic:'AG', label: zh?'活跃智能体':'Active Agents', sub: zh?'实时工作中':'Working Now', val: busyCount, unit:`/${_AGENTS.length}` },
  ];
  return (
    <div className="panel quick-funcs corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="快捷功能" e="Quick Panels"/></span>
        <span style={{color:'var(--text-mute)',fontSize:10}}>QUICK · PANELS</span>
      </div>
      <div className="qf-list">
        {items.map(i=>(
          <div className="qf-item" key={i.id}>
            <div className="qf-ic">{i.ic}</div>
            <div className="qf-tx">{i.label}<small>{i.sub}</small></div>
            <div className="qf-val">{i.val}{i.unit && <small>{i.unit}</small>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Excel-backed scrolling sparkline (24 points)
const SPARK_HOURS = 24;
const SPARK_TICK_MS = 1200; // 比原先 700ms 略慢

function _normHourlySeries(raw) {
  if (!raw?.length) return Array.from({ length: SPARK_HOURS }, () => 0.03);
  const maxV = Math.max(...raw, 1);
  const norm = raw.map(v => Math.max(0.03, v / maxV));
  while (norm.length < SPARK_HOURS) norm.push(norm[norm.length - 1] ?? 0.03);
  return norm.slice(0, SPARK_HOURS);
}

/** token消耗曲线（小时）：00:00 ~ 当前小时（含），按 slice 归一化 */
function _tokenHourlySparkToNow(agentId, hourIdx, minuteFrac) {
  const hourly = window.IRUN_AGENT_TOKEN?.byAgentId?.[agentId]?.tokenHourly;
  if (!hourly?.length) return [0.03];
  const h = Math.max(0, Math.min(SPARK_HOURS - 1, Math.floor(hourIdx)));
  const frac = Math.max(0, Math.min(1, minuteFrac));
  const slice = hourly.slice(0, h + 1).map(v => Number(v) || 0);
  if (frac > 0 && slice.length) {
    const cur = hourly[h] ?? 0;
    const prev = h > 0 ? (hourly[h - 1] ?? 0) : 0;
    slice[slice.length - 1] = h > 0 ? prev + (cur - prev) * frac : cur * frac;
  }
  const maxV = Math.max(...slice, 1);
  return slice.map(v => Math.max(0.03, v / maxV));
}

function _excelCallsShape(agentId) {
  const rec = window.IRUN_AGENT_TOKEN?.byAgentId?.[agentId];
  return _normHourlySeries(rec?.callsCumulative);
}

function _tickScrollingSpark(shape, prev, agentIndex) {
  const hSim = ((Date.now() / 1000) / 5 + agentIndex * 0.7) % SPARK_HOURS;
  const base = shape[Math.floor(hSim)] ?? shape[shape.length - 1] ?? 0.5;
  const noise = (Math.random() - 0.5) * 0.1;
  const last = prev[prev.length - 1];
  const next = Math.max(0.03, Math.min(1, base * 0.7 + last * 0.2 + noise + 0.05));
  return [...prev.slice(1), next];
}

// Agent modal — drill into a single agent's working pane
function AgentModal({agentId, onClose, busyMap, onChat}){
  if(!agentId) return null;
  const l = useLang(); const zh = l !== 'en';
  const a = _ABI[agentId];
  const cat = _CATS[a.cat];
  const isBusy = busyMap?.[agentId];

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const hourIdx = now.getHours();
  const snap = React.useMemo(
    () => window.IRUN_AGENT_TOKEN?.getSnapshot(agentId, hourIdx) ?? null,
    [agentId, hourIdx]
  );
  const [trendSpark, setTrendSpark] = useState(() => _excelCallsShape(agentId));
  useEffect(() => { setTrendSpark(_excelCallsShape(agentId)); }, [agentId, hourIdx]);
  useEffect(() => {
    const id = setInterval(() => {
      setTrendSpark(prev => _tickScrollingSpark(_excelCallsShape(agentId), prev, 0));
    }, SPARK_TICK_MS);
    return () => clearInterval(id);
  }, [agentId]);
  const tokenBarLabels = { reasoning: zh ? '推理' : 'Reason', tool: zh ? '工具' : 'Tools', retrieval: zh ? '检索' : 'Retrieval' };

  // synthetic workflow log
  const log = useMemo(()=>{
    const tokenN = Math.floor(Math.random()*900+200);
    return zh ? [
      ['09:42:18', '订阅事件总线 · 监听 alert.* 通道'],
      ['09:42:33', '收到 evt#A203 → 进入分析阶段'],
      ['09:42:34', '召回 RAG · 3 条相似案例 (相似度 0.91)'],
      ['09:42:36', '调用工具 plant.metrics.read · 384ms'],
      ['09:42:37', `生成结论 · 推理 token 消耗 ${tokenN}`],
      ['09:42:38', '产出工单字段并提交 → ord-agent'],
      ['09:42:40', '空闲 · 等待下一事件 …'],
    ] : [
      ['09:42:18', 'Subscribed event bus · listening on alert.* channel'],
      ['09:42:33', 'Received evt#A203 → entering analysis'],
      ['09:42:34', 'RAG recall · 3 similar cases (similarity 0.91)'],
      ['09:42:36', 'Invoked plant.metrics.read · 384ms'],
      ['09:42:37', `Synthesised conclusion · reasoning tokens ${tokenN}`],
      ['09:42:38', 'Emitted ticket fields → ord-agent'],
      ['09:42:40', 'Idle · waiting next event …'],
    ];
  },[agentId, zh]);

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal corners" onClick={e=>e.stopPropagation()} style={{'--cat-color':cat.color}}>
        <span className="c1"/>
        <div className="modal-hd">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="live" style={{color:cat.color}}>● {isBusy?(zh?'工作中':'Working'):(zh?'待命':'Idle')}</span>
            <span className="tag-line">AGENT · WORKING PANE</span>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span className="kbd">ESC</span>
            <div className="detail-close" onClick={onClose}>×</div>
          </div>
        </div>
        <div className="modal-bd-inner">
          <div>
            <div className="profile">
              <div className="avatar">{a.code}</div>
              <div>
                <h2>{agentName(a, zh)}</h2>
                <div className="role" style={{color:cat.color}}>{catLabel(cat, zh)} · {agentRole(a, zh)}</div>
                <p>{agentIntro(a, zh)}</p>
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>{zh?'核心技能':'Core Skills'}</h3>
              <div className="skill-chips">
                {a.skills.map((s,si)=><span key={s} style={{color:cat.color,borderColor:cat.color+'55'}}>{agentSkill(a, si, zh)}</span>)}
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>{zh?'今日工作统计':"Today's Stats"}</h3>
              <div className="stat-grid">
                <div className="c"><div className="l">{zh?'调用次数':'Calls'}</div><div className="v mono">{snap?.calls ?? a.metrics.todayCalls}</div></div>
                <div className="c"><div className="l">Token</div><div className="v mono">{snap?.tokensText ?? a.metrics.tokens}</div></div>
                <div className="c"><div className="l">{zh?'成功率':'Success'}</div><div className="v mono">{snap?.successRateText ?? a.metrics.success}%</div></div>
              </div>
              <div className="token-bars">
                {(snap?.tokenBars ?? [
                  { key: 'reasoning', pct: 72, text: '17.4K' },
                  { key: 'tool', pct: 34, text: '8.1K' },
                  { key: 'retrieval', pct: 52, text: '12.3K' },
                ]).map(bar => (
                  <div key={bar.key} className="row">
                    <span className="n">{tokenBarLabels[bar.key] ?? bar.key}</span>
                    <div className="b"><i style={{width: `${bar.pct}%`}}/></div>
                    <span className="v mono">{bar.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="section">
              <h3>{zh?'值班台 · 实时工作流':'Duty Console · Live Workflow'}</h3>
              <div className="workflow">
                {log.map((l,i)=>(
                  <div key={i} className="ln"><span className="ts">{l[0]}</span><span>{l[1]}</span></div>
                ))}
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>{zh?'今日趋势 · 调用频次':"Today's Trend · Call Frequency"}</h3>
              <svg viewBox="0 0 240 80" style={{width:'100%',height:80,marginTop:6}}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={cat.color} stopOpacity="0.4"/>
                    <stop offset="100%" stopColor={cat.color} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline
                  fill="none" stroke={cat.color} strokeWidth="1.5"
                  points={trendSpark.map((v,i)=>`${i*(240/(SPARK_HOURS-1))},${80-v*70}`).join(' ')}
                  style={{transition:'all .6s ease-out'}}
                />
                <polygon
                  fill="url(#g1)"
                  points={`0,80 ${trendSpark.map((v,i)=>`${i*(240/(SPARK_HOURS-1))},${80-v*70}`).join(' ')} 240,80`}
                  style={{transition:'all .6s ease-out'}}
                />
                {[0,20,40,60,80].map(y=><line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgba(120,160,220,0.05)"/>)}
              </svg>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>操作</h3>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button
                  className="q-chip"
                  style={{borderColor:cat.color+'66',color:cat.color}}
                  onClick={(e)=>{
                    e.stopPropagation();
                    onChat?.(agentId);
                    onClose?.();
                  }}
                >
                  与该智能体对话 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// View mode strip — vertical buttons on far left
function ModeStrip({mode, onChange}){
  const l = useLang(); const zh = l !== 'en';
  const modes = [
    {id:'map2',  ic:'🌆', lb: zh?'地图模式2':'Map Mode 2'},
    {id:'img2',  ic:'▤',  lb: zh?'图片模式2':'Img Mode 2'},
  ];
  return (
    <div className="mode-strip">
      {modes.map(m=>(
        <div key={m.id}
             className={`mode-btn ${mode===m.id?'on':''}`}
             onClick={()=>onChange(m.id)}
             title={m.lb}>
          <span className="ic">{m.ic}</span>
          <span className="lb">{m.lb}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Agent Token Analytics Panel (replaces AgentDock in map2 mode)
function AgentTokenPanel({ busyMap, onOpen }) {
  const l = useLang(); const zh = l !== 'en';
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const hourIdx = now.getHours();
  const minuteFrac = now.getMinutes() / 60;
  const getSnap = window.IRUN_AGENT_TOKEN?.getSnapshot;

  const tokenSparks = React.useMemo(
    () => _AGENTS.map(a => _tokenHourlySparkToNow(a.id, hourIdx, minuteFrac)),
    [hourIdx, minuteFrac]
  );

  const agentSnaps = React.useMemo(
    () => _AGENTS.map(a => (getSnap ? getSnap(a.id, hourIdx) : null)),
    [hourIdx, getSnap]
  );
  const GLOBAL_MAX_TOK = Math.max(
    ...agentSnaps.map((s, i) => s?.tokenTotal ?? (parseFloat(String(_AGENTS[i].metrics.tokens)) || 0)),
    1
  );

  const W = 100, H = 32;

  // duplicate the agent list for seamless infinite scroll
  const list = [..._AGENTS, ..._AGENTS];

  return (
    <div className="panel agent-token-panel corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="智能体算力 · AGENT ANALYTICS" e="Agent Analytics · TOKEN USAGE"/></span>
        <span style={{color:'var(--text-mute)',fontSize:10,letterSpacing:'0.1em'}}>24H TOKEN CURVE</span>
      </div>
      <div className="token-grid">
        <div className="token-track">
          {list.map((a, dupIdx) => {
            const i = dupIdx % _AGENTS.length;
            const snap = agentSnaps[i];
            const cat = _CATS[a.cat];
            const busy = busyMap?.[a.id];
            const spark = tokenSparks[i] || [0.03];
            const peakH = snap?.peakHour;
            const color = busy ? '#22d3ee' : cat.color;
            const tokVal = snap?.tokenTotal ?? 0;
            const agentScale = Math.max(0.18, tokVal / GLOBAL_MAX_TOK);
            const xDenom = Math.max(spark.length - 1, 1);
            const polyPts = spark.map((v, idx) =>
              `${(idx / xDenom) * W},${H - 2 - v * agentScale * (H - 5)}`
            ).join(' ');
            const areaPts = `0,${H} ${polyPts} ${W},${H}`;
            return (
              <div key={`${a.id}-${dupIdx}`}
                   className={`token-card${busy ? ' busy' : ''}`}
                   style={{'--cat-color': color}}
                   onClick={() => onOpen(a.id)}>
                <div className="tc-top">
                  <RobotAvatar agent={a} size={32} glow={busy}/>
                  <div className="tc-info">
                    <span className="tc-name">{agentShort(a, zh)}</span>
                    <span className={`tc-st ${busy ? 'work' : 'idle'}`}>{zh?'● 运行':'● Active'}</span>
                  </div>
                  <span className="tc-tok">{snap?.tokensText ?? a.metrics.tokens}</span>
                </div>
                <svg className="tc-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                  <polygon points={areaPts} fill={color} fillOpacity="0.13"/>
                  <polyline points={polyPts} fill="none" stroke={color} strokeWidth="0.75" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <div className="tc-foot">
                  <span>{snap?.calls ?? a.metrics.todayCalls} calls</span>
                  <span>{zh?'峰':'Peak'} {peakH != null ? peakH : '--'}:00 · {snap?.successRateText ?? a.metrics.success}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Skill Market Modal
const _SKILL_CATS = [
  { key:'全部', zh:'全部', en:'All' },
  { key:'数据分析', zh:'数据分析', en:'Analytics' },
  { key:'运维工具', zh:'运维工具', en:'Ops Tools' },
  { key:'安全合规', zh:'安全合规', en:'Safety' },
  { key:'通知推送', zh:'通知推送', en:'Notify' },
  { key:'自定义', zh:'自定义', en:'Custom' },
];
const _SKILLS = [
  { id:'weather', icon:'🌤', name:'气象预测', en:'Weather Forecast', cat:'运维工具', ver:'2.1.0',
    desc:'聚合多源气象数据，提供 7 天辐照度、温度、风速、降水预报',
    enDesc:'Multi-source weather data with 7-day irradiance, temperature, wind, precipitation outlook',
    status:'loaded', provider:'润建聚合', enProvider:'RunJian aggregation' },
  { id:'pvdefect', icon:'📸', name:'组件缺陷识别', en:'PV Defect Vision', cat:'运维工具', ver:'1.4.2',
    desc:'无人机与红外巡检图像识别，覆盖热斑、隐裂、积灰、遮挡、破损五类缺陷',
    enDesc:'Drone & thermal image recognition for hot spots, micro-cracks, soiling, shading, breakage',
    status:'loaded', provider:'润建', enProvider:'RunJian' },
  { id:'notify', icon:'🔔', name:'通知中心', en:'Notification Hub', cat:'通知推送', ver:'3.0.1',
    desc:'统一消息通道，支持钉钉/企微/邮件/短信/WhatsApp，含审批联动',
    enDesc:'Unified channel for DingTalk / WeCom / Email / SMS / WhatsApp, with approval workflow',
    status:'loaded', provider:'润建', enProvider:'RunJian' },
  { id:'dataqa', icon:'🔍', name:'数据问答', en:'Data Q&A', cat:'数据分析', ver:'1.0.0',
    desc:'自然语言转 SQL 查询运维数据库，返回结构化数据与简单图表',
    enDesc:'Natural-language to SQL over operations database; returns structured data and simple charts',
    status:'installed', provider:'智维中台', enProvider:'iRun Platform' },
  { id:'safety', icon:'🛡', name:'安全合规', en:'Safety Guard', cat:'安全合规', ver:'2.0.0',
    desc:'作业票智能审核、现场危险源比对、应急预案触发与全过程存档',
    enDesc:'Permit-to-work auditing, on-site hazard matching, emergency-plan trigger with full audit trail',
    status:'installed', provider:'润建', enProvider:'RunJian' },
  { id:'carbon', icon:'🌱', name:'碳排放计算', en:'Carbon Accounting', cat:'数据分析', ver:'1.2.0',
    desc:'实时核算光伏减碳量，支持 CCER / I-REC / GRES 申报辅助',
    enDesc:'Real-time PV carbon-reduction accounting; supports CCER / I-REC / GRES filing',
    status:'available', provider:'润建', enProvider:'RunJian' },
  { id:'report', icon:'📊', name:'报表引擎', en:'Report Engine', cat:'数据分析', ver:'2.3.1',
    desc:'日/周/月报自动生成，支持 PDF/Excel 导出与邮件定时分发',
    enDesc:'Auto-generated daily / weekly / monthly reports with PDF/Excel export & scheduled email',
    status:'available', provider:'润建', enProvider:'RunJian' },
  { id:'edge', icon:'🖥', name:'边缘推理节点', en:'Edge Inference', cat:'运维工具', ver:'0.9.0-beta',
    desc:'本地化推理与告警闭环，断网场景维持核心智能体在线',
    enDesc:'On-prem inference keeping core alert & diagnosis agents online when offline',
    status:'beta', provider:'润建', enProvider:'RunJian' },
  { id:'pvfore', icon:'📈', name:'发电预测', en:'PV Forecast', cat:'数据分析', ver:'1.9.0',
    desc:'历史数据 + 气象融合的功率预测，日前 MAE ≤8%、超短期 ≤5%',
    enDesc:'Historical + weather fusion forecast; day-ahead MAE ≤ 8%, ultra-short ≤ 5%',
    status:'available', provider:'润建', enProvider:'RunJian' },
  { id:'grid', icon:'⚡', name:'电网接入适配', en:'Grid Adapter', cat:'运维工具', ver:'0.1.0-beta',
    desc:'适配 D5000 调度数据上送、AGC/AVC 响应、并网点状态同步',
    enDesc:'Dispatch data upload (D5000), AGC/AVC response, grid-point status sync',
    status:'beta', provider:'润建', enProvider:'RunJian' },
  { id:'knowledge', icon:'📚', name:'知识库检索', en:'Knowledge Retrieval', cat:'数据分析', ver:'1.0.0',
    desc:'规程、案例、设备手册的 RAG 检索，支撑数字专家与知识助手',
    enDesc:'RAG over SOPs, case base, equipment manuals — fueling Expert / Diagnosis / Knowledge agents',
    status:'loaded', provider:'智维中台', enProvider:'iRun Platform' },
  { id:'api', icon:'⚙', name:'通用 API 适配', en:'API Connector', cat:'自定义', ver:'1.0.0',
    desc:'基于 OpenAPI 3.0 的低代码配置接入，对接客户业务系统',
    enDesc:'Low-code connector based on OpenAPI 3.0, for customer system integration',
    status:'available', provider:'智维中台', enProvider:'iRun Platform' },
];

function SkillModal({ onClose }){
  const l = useLang(); const zh = l !== 'en';
  const [cat, setCat] = useState('全部');
  const [q, setQ] = useState('');
  const qLower = q.toLowerCase();
  const filtered = _SKILLS.filter(s => {
    if (cat !== '全部' && s.cat !== cat) return false;
    if (!q) return true;
    const hay = [s.name, s.en, s.desc, s.enDesc, s.provider, s.enProvider].join(' ').toLowerCase();
    return hay.includes(qLower);
  });
  const loaded = _SKILLS.filter(s => s.status === 'loaded').length;
  const installed = _SKILLS.filter(s => s.status === 'installed').length;

  const statusLabel = zh
    ? { loaded:'已加载', installed:'已安装', available:'可安装', beta:'Beta' }
    : { loaded:'Loaded', installed:'Installed', available:'Available', beta:'Beta' };

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="skill-modal" onClick={e=>e.stopPropagation()}>
        {/* header */}
        <div className="skill-modal-hd">
          <div className="skill-modal-title">
            <h2>{zh ? '⚙ 技能市场 · SKILL MARKETPLACE' : '⚙ SKILL MARKETPLACE'}</h2>
            <p>{zh
              ? '集成第三方技能 · 扩展智能体能力边界 · OpenAPI / SDK 双模式接入'
              : 'Integrate third-party skills · Extend agent capabilities · OpenAPI / SDK access'}</p>
          </div>
          <div className="skill-modal-stats">
            <div className="skill-modal-stat"><span className="sv">{_SKILLS.length}</span><span className="sl">{zh?'总技能':'Total'}</span></div>
            <div className="skill-modal-stat"><span className="sv" style={{color:'var(--cyan)'}}>{loaded}</span><span className="sl">{zh?'已加载':'Loaded'}</span></div>
            <div className="skill-modal-stat"><span className="sv" style={{color:'var(--emerald)'}}>{installed}</span><span className="sl">{zh?'已安装':'Installed'}</span></div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* toolbar */}
        <div className="skill-modal-toolbar">
          <div className="skill-search">
            <span style={{color:'var(--text-mute)',fontSize:12}}>🔍</span>
            <input placeholder={zh?'搜索技能名称、功能描述…':'Search skills, descriptions…'} value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div className="skill-cats">
            {_SKILL_CATS.map(c=>(
              <div key={c.key} className={`skill-cat${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>{zh ? c.zh : c.en}</div>
            ))}
          </div>
        </div>

        {/* skill grid */}
        <div className="skill-modal-body">
          {filtered.map(s=>(
            <div key={s.id} className={`skill-card ${s.status}`}>
              <div className="skill-card-top">
                <div className="skill-card-icon">{s.icon}</div>
                <div className="skill-card-info">
                  <div className="skill-card-name">{zh ? s.name : s.en}</div>
                  <div className="skill-card-en">{zh ? `${s.en} · v${s.ver}` : `v${s.ver}`}</div>
                </div>
              </div>
              <div className="skill-card-desc">{zh ? s.desc : s.enDesc}</div>
              <div className="skill-card-footer">
                <span className="skill-card-provider">{zh ? s.provider : s.enProvider}</span>
                <span className={`skill-status ${s.status}`}>{statusLabel[s.status]}</span>
              </div>
              {(s.status==='available') && (
                <button className="skill-install-btn" style={{marginTop:6}}>{zh ? '+ 安装' : '+ Install'}</button>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="skill-modal-footer">
          <span>{zh
            ? `已加载 ${loaded} 个技能 · 全部技能 ${_SKILLS.length} 个 · 支持 OpenAPI / MCP / SDK 三种接入方式`
            : `${loaded} loaded · ${_SKILLS.length} skills total · OpenAPI / MCP / SDK supported`}</span>
          <span style={{color:'var(--violet)'}}>iRun Skill Runtime v2.4.0</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Plant title selector — centered banner shown in img2 mode
function PlantTitle({plant, plants, onChange}){
  const l = useLang(); const zh = l !== 'en';
  const [open, setOpen] = useState(false);
  if (!plant) return null;
  return (
    <div className="plant-title" onMouseLeave={()=>setOpen(false)}>
      <div className="pt-corner pt-corner-tl"/>
      <div className="pt-corner pt-corner-tr"/>
      <div className="pt-corner pt-corner-bl"/>
      <div className="pt-corner pt-corner-br"/>
      <button className="pt-main" onClick={()=>setOpen(o=>!o)}>
        <span className="pt-dot"/>
        <span className="pt-name">{zh ? plant.name : (plant.enName || plant.name)}</span>
        <span className="pt-region">{zh ? plant.region : (plant.enRegion || plant.region)}</span>
        <span className={`pt-caret${open?' open':''}`}>▾</span>
      </button>
      {open && (
        <div className="pt-menu">
          <div className="pt-menu-h">{zh?'切换电站':'Switch Plant'}</div>
          {plants.map(p => (
            <div key={p.id}
                 className={`pt-item${p.id===plant.id?' active':''}`}
                 onClick={()=>{ onChange(p.id); setOpen(false); }}>
              <span className={`pt-i-dot pt-i-dot-${p.risk||'low'}`}/>
              <span className="pt-i-name">{zh ? p.name : (p.enName || p.name)}</span>
              <span className="pt-i-meta">{p.capacity.toFixed(1)} MW</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// DroneFlight — triggered only by clicking the UAV button (AgentsRail).
//  · JOHOR-COMMERCIAL (id 1881233694553112576): flies a serpentine inspection
//    route over the rooftop PV arrays, one round trip (there & back), then fades
//    out — rendered with the robotField static-drone icon style.
//  · Overview / all other plants: keeps the original behaviour — ellipse loop ×2
//    then flies off, with the original glowing icon + shadow.
const JOHOR_PLANT_ID = '1881233694553112576';
function DroneFlight({onDone, plant}){
  const isJohor = plant?.id === JOHOR_PLANT_ID;
  const [pos, setPos] = useState(isJohor
    ? {x: 326, y: 756, opacity: 0, rot: 0}
    : {x: 960, y: 240, opacity: 0, rot: 0});
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(()=>{
    let tick;
    if(isJohor){
      // ── Serpentine round-trip over JOHOR-COMMERCIAL rooftop (1920×1080 space) ──
      // Traces the red line: lower-left start → waves across front roof →
      // sharp peak over the building gap → rise to far-right end near OPS.
      const fwd = [
        [326, 756], [460, 730], [560, 668], [660, 720], [770, 660],
        [880, 712], [960, 540], [1075, 668], [1248, 565], [1421, 486],
      ];
      const path = fwd.concat(fwd.slice(0, -1).reverse());  // forward then back
      const segLen = [];
      let total = 0;
      for(let i=1;i<path.length;i++){
        const d = Math.hypot(path[i][0]-path[i-1][0], path[i][1]-path[i-1][1]);
        segLen.push(d); total += d;
      }
      const travelDur = 11;   // seconds for the full round trip
      const fadeIn = 0.5, fadeOut = 0.9;
      const sample = (dist) => {
        let d = dist, i = 0;
        while(i < segLen.length && d > segLen[i]){ d -= segLen[i]; i++; }
        if(i >= segLen.length) i = segLen.length-1;
        const t = segLen[i] ? d/segLen[i] : 0;
        return {
          x: path[i][0] + (path[i+1][0]-path[i][0])*t,
          y: path[i][1] + (path[i+1][1]-path[i][1])*t,
        };
      };
      tick = (tm) => {
        if(!startRef.current) startRef.current = tm;
        const elapsed = (tm - startRef.current) / 1000;
        if(elapsed >= travelDur){ onDone?.(); return; }
        const {x, y} = sample((elapsed / travelDur) * total);
        let opacity = 1;
        if(elapsed < fadeIn) opacity = elapsed / fadeIn;
        else if(elapsed > travelDur - fadeOut) opacity = Math.max(0, (travelDur - elapsed) / fadeOut);
        setPos({x, y, opacity, rot: 0});
        rafRef.current = requestAnimationFrame(tick);
      };
    } else {
      // ── Original ellipse: loop ×2 then fly off up-right ──
      const cx = 960, cy = 540, rx = 720, ry = 300;
      const loopDur = 5.5, totalLoops = 2, fadeIn = 0.4, exitDur = 1.8;
      const totalDur = totalLoops * loopDur + exitDur;
      tick = (t) => {
        if(!startRef.current) startRef.current = t;
        const elapsed = (t - startRef.current) / 1000;
        if(elapsed < totalLoops * loopDur){
          const theta = -Math.PI/2 + (elapsed / loopDur) * Math.PI * 2;
          const x = cx + rx * Math.cos(theta);
          const y = cy + ry * Math.sin(theta);
          const tx = -rx * Math.sin(theta);
          const ty =  ry * Math.cos(theta);
          const rot = Math.atan2(ty, tx) * 180 / Math.PI;
          setPos({x, y, opacity: Math.min(1, elapsed / fadeIn), rot});
          rafRef.current = requestAnimationFrame(tick);
        } else if(elapsed < totalDur){
          const u = (elapsed - totalLoops * loopDur) / exitDur;
          const startX = cx + rx * Math.cos(-Math.PI/2);
          const startY = cy + ry * Math.sin(-Math.PI/2);
          const x = startX + (2400 - startX) * u;
          const y = startY + (-300 - startY) * u;
          setPos({x, y, opacity: Math.max(0, 1 - u * 0.7), rot: -25});
          rafRef.current = requestAnimationFrame(tick);
        } else {
          onDone?.();
        }
      };
    }
    rafRef.current = requestAnimationFrame(tick);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[]);

  // Icon is always the robotField static-drone style (upright + UAV badge);
  // only the flight route differs (serpentine for JOHOR, ellipse for others).
  return (
    <div className="drone-flight uav-static"
         style={{
           left: pos.x+'px',
           top: pos.y+'px',
           opacity: pos.opacity,
           transform: 'translate(-50%,-50%)'
         }}>
      <img src="wrj001.png" alt="UAV"/>
      <div className="paf-badge paf-badge-drone">UAV</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// PlantRobot — animated robot that walks a path through the plant img2 view
// Uses a single image but simulates sprite-frame walking via CSS keyframes
const PLANT_ROBOT_PATH = [
  {x: 75, y: 105},  // bottom entry (off-screen)
  {x: 74, y: 92},
  {x: 73, y: 78},
  {x: 70, y: 64},
  {x: 62, y: 54},
  {x: 50, y: 46},
  {x: 38, y: 40},   // arrival at target (upper-left circle)
];

function PlantRobot(){
  const [s, setS] = useState({x: 98, y: 76, facingLeft: true, opacity: 0, walk: false});
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(()=>{
    const walkDur = 14;     // s — walk along path
    const lingerDur = 2.5;  // s — pause at target
    const fadeDur = 1;      // s — fade out
    const gapDur = 1.5;     // s — invisible reset gap
    const cycleDur = walkDur + lingerDur + fadeDur + gapDur;

    const tick = (t) => {
      if(!startRef.current) startRef.current = t;
      const elapsed = ((t - startRef.current) / 1000) % cycleDur;

      let phase;
      if(elapsed < walkDur){
        // walking
        const u = elapsed / walkDur;
        const segPos = u * (PLANT_ROBOT_PATH.length - 1);
        const idx = Math.min(Math.floor(segPos), PLANT_ROBOT_PATH.length - 2);
        const localU = segPos - idx;
        const p0 = PLANT_ROBOT_PATH[idx];
        const p1 = PLANT_ROBOT_PATH[idx+1];
        const x = p0.x + (p1.x - p0.x) * localU;
        const y = p0.y + (p1.y - p0.y) * localU;
        const facingLeft = (p1.x - p0.x) < 0;
        // fade in over first 0.6s
        const opacity = Math.min(1, elapsed / 0.6);
        phase = {x, y, facingLeft, opacity, walk: true};
      } else if(elapsed < walkDur + lingerDur){
        // linger at target
        const last = PLANT_ROBOT_PATH[PLANT_ROBOT_PATH.length-1];
        phase = {x: last.x, y: last.y, facingLeft: false, opacity: 1, walk: false};
      } else if(elapsed < walkDur + lingerDur + fadeDur){
        // fade out
        const last = PLANT_ROBOT_PATH[PLANT_ROBOT_PATH.length-1];
        const u = (elapsed - walkDur - lingerDur) / fadeDur;
        phase = {x: last.x, y: last.y - u * 3, facingLeft: false, opacity: 1 - u, walk: false};
      } else {
        // gap (invisible) before next cycle
        const first = PLANT_ROBOT_PATH[0];
        phase = {x: first.x, y: first.y, facingLeft: true, opacity: 0, walk: false};
      }

      setS(phase);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[]);

  return (
    <div className={`plant-robot${s.facingLeft?' flip':''}${s.walk?' walking':''}`}
         style={{
           left: s.x + '%',
           top: s.y + '%',
           opacity: s.opacity,
         }}>
      <div className="pr-shadow"/>
      <div className="pr-sprite">
        <img src="IRunRobot.png" alt="robot"/>
      </div>
      <div className="pr-glow"/>
    </div>
  );
}

// ── DispatchedRobot ───────────────────────────────────────────────────
// In command mode: a single iRun robot walks PLANT_ROBOT_PATH to the target,
// shows a bubble with the dispatched command, then fades and self-unmounts.
function DispatchedRobot({id, agentId, text, onDone}){
  const [st, setSt] = useState({x: PLANT_ROBOT_PATH[0].x, y: PLANT_ROBOT_PATH[0].y, facingLeft: true, opacity: 0, walk: false});
  const [showBubble, setShowBubble] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const doneRef = useRef(false);
  const ag = _ABI[agentId];

  useEffect(()=>{
    const walkDur = 9;      // s — walk along path
    const lingerDur = 5;    // s — bubble + execute
    const fadeDur = 1;      // s — fade out
    const totalDur = walkDur + lingerDur + fadeDur;

    const tick = (t) => {
      if(!startRef.current) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;

      if (elapsed < walkDur){
        const u = elapsed / walkDur;
        const segPos = u * (PLANT_ROBOT_PATH.length - 1);
        const idx = Math.min(Math.floor(segPos), PLANT_ROBOT_PATH.length - 2);
        const localU = segPos - idx;
        const p0 = PLANT_ROBOT_PATH[idx];
        const p1 = PLANT_ROBOT_PATH[idx+1];
        const x = p0.x + (p1.x - p0.x) * localU;
        const y = p0.y + (p1.y - p0.y) * localU;
        const facingLeft = (p1.x - p0.x) < 0;
        const opacity = Math.min(1, elapsed / 0.6);
        setSt({x, y, facingLeft, opacity, walk: true});
      } else if (elapsed < walkDur + lingerDur){
        const last = PLANT_ROBOT_PATH[PLANT_ROBOT_PATH.length-1];
        setSt({x: last.x, y: last.y, facingLeft: false, opacity: 1, walk: false});
        setShowBubble(prev => prev ? prev : true);
      } else if (elapsed < totalDur){
        const last = PLANT_ROBOT_PATH[PLANT_ROBOT_PATH.length-1];
        const u = (elapsed - walkDur - lingerDur) / fadeDur;
        setSt({x: last.x, y: last.y - u*3, facingLeft: false, opacity: 1-u, walk: false});
      } else {
        if (!doneRef.current){ doneRef.current = true; onDone?.(id); }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[]);

  return (
    <div className={`plant-robot dispatched${st.facingLeft?' flip':''}${st.walk?' walking':''}`}
         style={{left:st.x+'%', top:st.y+'%', opacity:st.opacity}}>
      <div className="pr-shadow"/>
      <div className="pr-sprite"><img src="IRunRobot.png" alt="robot"/></div>
      <div className="pr-glow"/>
      {showBubble && ag && (
        <div className={`pr-bubble${st.facingLeft?'':' flip'}`}>
          <div className="pr-bubble-head">
            <span className="pr-bubble-code">{ag.code}</span>
            <span className="pr-bubble-tag">执行</span>
          </div>
          <div className="pr-bubble-text">{text}</div>
        </div>
      )}
    </div>
  );
}

function DispatchedRobots({robots, onRobotDone}){
  if (!robots?.length) return null;
  return (
    <div className="dispatched-robots-layer" aria-hidden="true">
      {robots.map(r => (
        <DispatchedRobot key={r.id} id={r.id} agentId={r.agentId} text={r.text} onDone={onRobotDone}/>
      ))}
    </div>
  );
}

// ── PlantAgentField ───────────────────────────────────────────────────
// Renders a fleet of static RobotAvatars at plant.robotField positions.
// Active agents (busyMap hit) glow + lift. Used in img2 when a plant
// provides robotField data; otherwise the single walking PlantRobot is used.
const getDemoPlantTeamUnavailableIds = (id) => window.IRUN?.getDemoPlantTeamUnavailableIds?.(id) || [];
function PlantAgentField({plant, busyMap, cur}){
  const l = useLang(); const zh = l !== 'en';
  if (!plant?.robotField?.length) return null;
  const unavailableAgentIds = new Set(getDemoPlantTeamUnavailableIds(plant?.id));
  const visibleRobots = plant.robotField.filter(r => !r.anchorOnly && !unavailableAgentIds.has(r.agent));
  if (!visibleRobots.length) return null;
  // Bubble on a visible robot: prefer handoff target (e.g. drone→insp shows on insp)
  const visibleIds = new Set(visibleRobots.map(r => r.agent));
  const speaker = !cur ? null
    : (busyMap?.[cur.to] && visibleIds.has(cur.to)) ? cur.to
    : (busyMap?.[cur.from] && visibleIds.has(cur.from)) ? cur.from
    : null;
  // Build position map for line endpoints (incl. anchorOnly e.g. drone — lines only, no tile)
  const posMap = {};
  plant.robotField.forEach(r => {
    if (!unavailableAgentIds.has(r.agent)) posMap[r.agent] = {x: r.x, y: r.y};
  });
  const fromPos = cur && posMap[cur.from];
  const toPos = cur && posMap[cur.to];
  const lineColor = !cur ? '#22d3ee'
                  : cur.type === 'action' ? '#fbbf24'
                  : isSafetyStep(cur) ? '#f87171'
                  : '#22d3ee';
  return (
    <div className="plant-agent-field" aria-hidden="true">
      {/* connection lines: current scenario step (from → to) — 3px line */}
      <svg className="paf-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {fromPos && toPos && cur.from !== cur.to && (
          <g key={`ln-${cur.from}-${cur.to}-${cur.t}`}>
            <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                  stroke={lineColor} strokeWidth="3"
                  strokeDasharray="14 8" opacity="0.85"
                  vectorEffect="non-scaling-stroke"
                  style={{filter:`drop-shadow(0 0 6px ${lineColor})`}}>
              <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="0.8s" repeatCount="indefinite"/>
            </line>
          </g>
        )}
      </svg>
      {/* moving particle — true 6px round dot, animated via dynamic @keyframes */}
      {fromPos && toPos && cur && cur.from !== cur.to && (
        <>
          <style>{`@keyframes paf-particle-${cur.from}-${cur.to}{
            0%   { left:${fromPos.x}%; top:${fromPos.y}%; opacity:0.2; }
            10%  { opacity:1; }
            90%  { opacity:1; }
            100% { left:${toPos.x}%; top:${toPos.y}%; opacity:0.2; }
          }`}</style>
          <div className="paf-particle"
               key={`p-${cur.from}-${cur.to}-${cur.t}`}
               style={{
                 background: lineColor,
                 boxShadow: `0 0 10px ${lineColor}, 0 0 18px ${lineColor}`,
                 animation: `paf-particle-${cur.from}-${cur.to} 1.4s linear infinite`,
               }}/>
        </>
      )}
      {visibleRobots.map((r, i) => {
        const ag = _ABI[r.agent];
        if (!ag) return null;
        const active = !!(busyMap && busyMap[r.agent]);
        const showBubble = active && cur && (r.agent === speaker);
        const tagClass = cur ? ` tag-${cur.type==='action'?'mid':(isSafetyStep(cur)?'high':'low')}` : '';
        return (
          <div key={r.agent}
               className={`paf-robot${active?' active':''}`}
               style={{left:`${r.x}%`, top:`${r.y}%`, animationDelay:`${i*0.3}s`}}>
            {showBubble && (
              <div className={`paf-bubble${tagClass}`} key={`b-${stepText(cur, zh)}`}>
                <div className="paf-bubble-head">
                  <span className="paf-bubble-code">{ag.code}</span>
                  {cur.tag && <span className="paf-bubble-tag">{stepTag(cur, zh)}</span>}
                </div>
                <div className="paf-bubble-text">{stepText(cur, zh)}</div>
              </div>
            )}
            <RobotAvatar agent={ag} size={56} glow={active}/>
            <div className="paf-badge">{ag.code}</div>
          </div>
        );
      })}
    </div>
  );
}

window.IRUN_UI = { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, AgentTokenPanel, MiniMap, QuickFuncs, AgentModal, AgentsRail, RobotAvatar, ModeStrip, SkillModal, PlantTitle, DroneFlight, PlantRobot, PlantAgentField, DispatchedRobots, useClock, fmtTime, fmtDate, fmtDateTime, LangCtx };

// ──────────────────────────────────────────────────────────────────────
// Collapsed event-stream tab — vertical handle on the left
function EventStreamTab({onExpand, count=0}){
  const l = useLang(); const zh = l !== 'en';
  return (
    <div className="stream-tab" onClick={onExpand} title={zh?'展开实时事件流':'Expand Event Stream'}>
      <div className="stream-tab-inner">
        <span className="arrow">›</span>
        {zh ? (
          <>
            <span className="vlabel">实 时 事 件 流</span>
          </>
        ) : (
          <span className="vlabel vlabel-en">EVENT STREAM</span>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Collapsed dispatch tab — vertical handle that re-opens the dispatch panel
function DispatchTab({onExpand, unread=0}){
  const l = useLang(); const zh = l !== 'en';
  return (
    <div className="dispatch-tab" onClick={onExpand} title={zh?'展开对话调度':'Expand AI Dispatch'}>
      <div className="dispatch-tab-inner">
        <span className="arrow">‹</span>
        {zh ? (
          <>
            <span className="vlabel">对 话 调 度</span>
          </>
        ) : (
          <span className="vlabel vlabel-en">AI DISPATCH</span>
        )}
        {unread>0 && <span className="vdot"/>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Robot avatar — stylized SVG portrait, colored per category, code on chest
function RobotAvatar({agent, size=58, glow=false}){
  const cat = _CATS[agent.cat];
  const c = cat.color;
  // base "personality" shift per agent — different chest icons / antenna styles
  const variant = ({
    alert:'bell', warn:'wave', safe:'shield', diag:'lens', insp:'drone',
    order:'doc', sched:'cal', pv:'panel', query:'chat', ops:'star',
  })[agent.id] || 'dot';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{display:'block'}}>
      <defs>
        <radialGradient id={`rb-bg-${agent.id}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1c2a4a"/>
          <stop offset="60%" stopColor="#0b1426"/>
          <stop offset="100%" stopColor="#04070f"/>
        </radialGradient>
        <linearGradient id={`rb-head-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5fb"/>
          <stop offset="100%" stopColor="#aab8cf"/>
        </linearGradient>
      </defs>

      {/* circular medallion background */}
      <circle cx="50" cy="50" r="48" fill={`url(#rb-bg-${agent.id})`} stroke={c} strokeWidth={glow?2:0.8} opacity="0.95"/>
      <circle cx="50" cy="50" r="46" fill="none" stroke={c} strokeWidth="0.5" strokeDasharray="0.6 2" opacity="0.4"/>

      {/* antenna */}
      <line x1="50" y1="10" x2="50" y2="22" stroke="#94a3b8" strokeWidth="1.4"/>
      <circle cx="50" cy="9" r="2.6" fill={c} style={glow?{filter:`drop-shadow(0 0 4px ${c})`}:{}}/>

      {/* head */}
      <rect x="26" y="20" width="48" height="38" rx="16" fill={`url(#rb-head-${agent.id})`}/>
      {/* face visor */}
      <rect x="31" y="27" width="38" height="20" rx="9" fill="#06101f"/>
      <rect x="31" y="27" width="38" height="20" rx="9" fill={c} opacity="0.08"/>
      {/* eyes */}
      <circle cx="41" cy="37" r="2.6" fill={c}>
        {glow && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>}
      </circle>
      <circle cx="59" cy="37" r="2.6" fill={c}>
        {glow && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.2s"/>}
      </circle>
      {/* ear pods */}
      <rect x="22" y="33" width="5" height="12" rx="2" fill="#7b8aa3"/>
      <rect x="73" y="33" width="5" height="12" rx="2" fill="#7b8aa3"/>
      {/* mouth speaker */}
      <rect x="40" y="50" width="20" height="3" rx="1.5" fill="#3a465e"/>

      {/* neck */}
      <rect x="46" y="58" width="8" height="4" fill="#7b8aa3"/>

      {/* body */}
      <rect x="26" y="62" width="48" height="26" rx="6" fill={`url(#rb-head-${agent.id})`}/>
      {/* shoulders */}
      <circle cx="24" cy="70" r="4" fill="#7b8aa3"/>
      <circle cx="76" cy="70" r="4" fill="#7b8aa3"/>
      {/* chest screen */}
      <rect x="33" y="67" width="34" height="16" rx="2" fill="#06101f"/>
      <rect x="33" y="67" width="34" height="16" rx="2" fill={c} opacity="0.1"/>
      <ChestIcon variant={variant} color={c}/>
      {/* base */}
      <path d="M28 88 L72 88 L74 90 L26 90 Z" fill="#7b8aa3"/>
    </svg>
  );
}

function ChestIcon({variant, color}){
  const c = color;
  switch(variant){
    case 'bell':   return <g transform="translate(50,75)" stroke={c} strokeWidth="1.5" fill="none">
      <path d="M-5 -3 a5 5 0 0 1 10 0 v3 l2 2 h-14 l2 -2 z" fill={c}/>
      <circle cx="0" cy="4" r="1.2" fill={c}/>
    </g>;
    case 'wave':   return <g transform="translate(50,75)" stroke={c} strokeWidth="1.4" fill="none">
      <polyline points="-9,2 -6,-3 -3,3 0,-4 3,2 6,-2 9,1"/>
    </g>;
    case 'shield': return <g transform="translate(50,75)" fill="none" stroke={c} strokeWidth="1.4">
      <path d="M0 -5 L6 -3 V2 a6 6 0 0 1 -6 5 a6 6 0 0 1 -6 -5 V-3 Z" fill={c} opacity="0.4"/>
      <path d="M-2 0 l2 2 l4 -4" stroke="#fff"/>
    </g>;
    case 'lens':   return <g transform="translate(50,75)" fill="none" stroke={c} strokeWidth="1.4">
      <circle cx="-1" cy="-1" r="4"/>
      <line x1="3" y1="3" x2="6" y2="6"/>
    </g>;
    case 'drone':  return <g transform="translate(50,75)" fill={c}>
      <circle cx="-6" cy="-3" r="1.8" fill="none" stroke={c}/>
      <circle cx="6"  cy="-3" r="1.8" fill="none" stroke={c}/>
      <circle cx="-6" cy="3" r="1.8" fill="none" stroke={c}/>
      <circle cx="6"  cy="3" r="1.8" fill="none" stroke={c}/>
      <rect x="-1.5" y="-1.5" width="3" height="3" fill={c}/>
      <line x1="-6" y1="-3" x2="6" y2="3" stroke={c} strokeWidth="0.8"/>
      <line x1="6" y1="-3" x2="-6" y2="3" stroke={c} strokeWidth="0.8"/>
    </g>;
    case 'doc':    return <g transform="translate(50,75)" stroke={c} strokeWidth="1.4" fill="none">
      <rect x="-4" y="-5" width="8" height="10" rx="0.5"/>
      <line x1="-2" y1="-2" x2="2" y2="-2"/>
      <line x1="-2" y1="0" x2="2" y2="0"/>
      <line x1="-2" y1="2" x2="1" y2="2"/>
    </g>;
    case 'cal':    return <g transform="translate(50,75)" stroke={c} strokeWidth="1.3" fill="none">
      <rect x="-5" y="-4" width="10" height="9" rx="1"/>
      <line x1="-5" y1="-1" x2="5" y2="-1"/>
      <circle cx="-2" cy="2" r="0.7" fill={c}/>
      <circle cx="2" cy="2" r="0.7" fill={c}/>
    </g>;
    case 'panel':  return <g transform="translate(50,75)" stroke={c} strokeWidth="1.2" fill="none">
      <path d="M-6 -4 L7 -4 L5 4 L-8 4 Z" fill={c} opacity="0.2"/>
      <line x1="-7" y1="-1" x2="6" y2="-1"/>
      <line x1="-3" y1="-4" x2="-5" y2="4"/>
      <line x1="1" y1="-4" x2="0" y2="4"/>
    </g>;
    case 'chat':   return <g transform="translate(50,75)" stroke={c} strokeWidth="1.4" fill="none">
      <path d="M-6 -3 a3 3 0 0 1 3 -3 h6 a3 3 0 0 1 3 3 v3 a3 3 0 0 1 -3 3 h-4 l-3 3 v-3 a3 3 0 0 1 -2 -3 z" fill={c} opacity="0.25"/>
    </g>;
    case 'star':   return <g transform="translate(50,75)" fill={c}>
      <polygon points="0,-5 1.3,-1.5 5,-1.5 2,1 3,5 0,2.7 -3,5 -2,1 -5,-1.5 -1.3,-1.5"/>
    </g>;
    default:       return <circle cx="50" cy="75" r="2.5" fill={c}/>;
  }
}

// ──────────────────────────────────────────────────────────────────────
// AgentsRail — vertical rail on the far right showing all agents as robot tiles
const DARK_RAIL_AGENTS = new Set(['ops', 'warn', 'safe']);
const getDemoPlantProfile = (id) => window.IRUN?.getDemoPlantProfile?.(id) || null;
function AgentsRail({focusPlant, busyMap, selected, onSelect, onOpen, onSkillOpen, onDroneFly, droneActive, tooltipEnabled=true, theme='light'}){
  const l = useLang(); const zh = l !== 'en';
  const [hoverId, setHoverId] = useState(null);
  const [hoverTop, setHoverTop] = useState(0);
  const railRef = useRef(null);
  const demoProfile = getDemoPlantProfile(focusPlant?.id);
  const unavailableAgentIds = new Set(getDemoPlantTeamUnavailableIds(focusPlant?.id));
  const hasTeamOverride = unavailableAgentIds.size > 0;

  const handleEnter = (id, e) => {
    if (!tooltipEnabled) return;
    setHoverId(id);
    const rect = e.currentTarget.getBoundingClientRect();
    const railRect = railRef.current?.getBoundingClientRect();
    if (railRect) setHoverTop(rect.top - railRect.top);
  };

  const hovered = hoverId && _ABI[hoverId];
  const hoveredCat = hovered && _CATS[hovered.cat];

  return (
    <div className="agents-rail" ref={railRef} onMouseLeave={()=>setHoverId(null)}>
      <div className="agents-rail-hd">
        AI&nbsp;AGENTS
      </div>
      <div className="agents-rail-list">
        {_AGENTS.map(a=>{
          const cat = _CATS[a.cat];
          const isOff = focusPlant && (hasTeamOverride ? unavailableAgentIds.has(a.id) : !focusPlant.agents.includes(a.id));
          const isInspDemoOff = !!demoProfile?.grayInspInTeam && a.id === 'insp';
          const isDarkLocked = theme === 'dark' && !DARK_RAIL_AGENTS.has(a.id);
          const disabled = isOff || isDarkLocked || isInspDemoOff;
          const busy = busyMap?.[a.id];
          return (
            <div key={a.id}
                 className={`agent-tile ${selected===a.id && !disabled?'active':''} ${disabled?'off':''} ${isDarkLocked?'locked':''} ${busy && !disabled?'busy':''}`}
                 style={{'--cat-color':cat.color}}
                 onMouseEnter={(e)=>{ if(!disabled) handleEnter(a.id, e); }}
                 onClick={()=>{
                   if(disabled) return;
                   onSelect?.(a.id);
                   setHoverId(null);
                 }}
                 onDoubleClick={()=>{ if(!disabled) onOpen?.(a.id); }}>
              <div className="robot-wrap">
                <RobotAvatar agent={a} size={42} glow={!isDarkLocked && (busy || selected===a.id)}/>
                {busy && !isDarkLocked && <span className="status-dot work"/>}
                {!busy && !disabled && <span className="status-dot online"/>}
                {disabled && <span className="status-dot off"/>}
              </div>
              <div className="agent-tile-name">
                <div className="nm-en">{zh ? a.short : a.en}</div>
                {/* <div className="nm-cn">{zh ? a.en : (a.enRole || a.role)}</div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* drone fly button */}
      <div className={`drone-btn${droneActive?' active':''}`}
           onClick={()=>{ if(!droneActive) onDroneFly?.(); }}
           title={zh?'无人机起飞':'Launch UAV'}>
        <div className="drone-btn-icon">
          <img src="wrj001.png" alt="UAV"/>
        </div>
        <div className="drone-btn-lbl">UAV</div>
        <div className="drone-btn-sub">{zh?'无人机':'Drone'}</div>
      </div>

      {/* skill market entry */}
      <div className="skill-entry-btn" onClick={()=>onSkillOpen?.()}>
        <div className="skill-entry-icon">
          ⚙
          <span className="skill-entry-badge">12</span>
        </div>
        <div className="skill-entry-lbl">SKILLS</div>
        <div className="skill-entry-sub">{zh?'技能市场':'Skill Mkt'}</div>
      </div>

      {hovered && (
        <div className="agent-tooltip" style={{top: Math.max(8, Math.min(hoverTop, 1080 - 280))+'px', '--cat-color': hoveredCat.color}}>
          <div className="tt-hd">
            <div className="tt-avatar"><RobotAvatar agent={hovered} size={46} glow/></div>
            <div className="tt-name">
              {zh ? (
                <>
                  <div className="tt-en">{hovered.en}</div>
                  <div className="tt-cn">{hovered.name}</div>
                </>
              ) : (
                <>
                  <div className="tt-en">{agentName(hovered, zh)}</div>
                  <div className="tt-cn">@{agentShort(hovered, zh)}</div>
                </>
              )}
              <div className="tt-cat" style={{color: hoveredCat.color}}>{catLabel(hoveredCat, zh)} · {agentRole(hovered, zh)}</div>
            </div>
            <button className="tt-detail-btn"
                    onClick={(e)=>{ e.stopPropagation(); onOpen?.(hovered.id); setHoverId(null); }}>
              {zh?'查看详情 →':'Details →'}
            </button>
          </div>
          <div className="tt-body">{agentIntro(hovered, zh)}</div>
          <div className="tt-skills">
            {hovered.skills.map((s, i) => <span key={s} style={{borderColor: hoveredCat.color+'55', color: hoveredCat.color}}>{agentSkill(hovered, i, zh)}</span>)}
          </div>
          <div className="tt-stats">
            <div><span className="l">{zh?'今日调用':'Calls'}</span><span className="v">{hovered.metrics.todayCalls}</span></div>
            <div><span className="l">Token</span><span className="v">{hovered.metrics.tokens}</span></div>
            <div><span className="l">{zh?'成功率':'Success'}</span><span className="v">{hovered.metrics.success}%</span></div>
          </div>
          <div className="tt-foot">{zh?'单击选为指挥目标 · 双击查看工作面板':'Click to select · Double-click to open panel'}</div>
        </div>
      )}
    </div>
  );
}
