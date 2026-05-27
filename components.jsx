// iRun Workbench — UI components (no top-level App; mounted from app.jsx)

// ── Language Context ────────────────────────────────────────────────────
const LangCtx = React.createContext('zh');
const useLang = () => React.useContext(LangCtx);
// t(zh, en) — picks text based on current lang context
function T({z, e}){ const l = useLang(); return l==='zh' ? z : e; }

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

// ──────────────────────────────────────────────────────────────────────
// Top bar
function TopBar({focusPlant, plants, agg, onPlantChange, tenant, tenantIdx, onTenant, onBack, lang, onLang}){
  const clock = useClock();
  const zh = lang !== 'en';
  const [plantPickerOpen, setPlantPickerOpen] = useState(false);
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
  const A = agg || _AGG;
  const k = focusPlant ? {
    cap: focusPlant.capacity, pwr: focusPlant.power, gen: focusPlant.gen, al: focusPlant.alerts,
    plants: 1, risk: focusPlant.risk === 'high' ? 1 : 0,
  } : {
    cap: A.capacity, pwr: A.power, gen: A.gen, al: A.alerts,
    plants: A.plants, risk: A.risk,
  };
  const util = (k.pwr / k.cap * 100).toFixed(1);

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark"><img src="irun-icon.png" alt="iRun" className="brand-icon"/></div>
        <div className="brand-text">
          <b>iRUN<span style={{color:'var(--cyan)'}}>·</span>WORKBENCH</b>
          <div className="brand-tenant">
                        <select value={tenantIdx} onChange={e=>onTenant(Number(e.target.value))}>
              {_TENANTS.map((t,i)=>(
                <option key={t.id} value={i}>{t.name}</option>
              ))}
            </select>
            <span className="bt-arrow">▼</span>
          </div>
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
                    <span className="cpm-meta">{p.capacity.toFixed(1)} MW</span>
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
          <div className="kpi-bar"><i style={{width: focusPlant?'100%':'82%'}}/></div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'装机容量':'Capacity'}</div>
          <div className="v mono">{k.cap.toFixed(1)}<small>MW</small></div>
          <div className="delta">▲ 18.2 MW · YTD</div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'实时功率':'Live Power'}</div>
          <div className="v mono">{k.pwr.toFixed(1)}<small>MW · {util}%</small></div>
          <div className="kpi-bar"><i style={{width:util+'%'}}/></div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'今日发电':"Today's Gen"}</div>
          <div className="v mono">{k.gen.toFixed(1)}<small>MWh</small></div>
          <div className="delta">▲ 4.6% · {zh?'同比':'YoY'}</div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'活跃告警':'Alerts'}</div>
          <div className="v mono" style={{color: k.al>10?'var(--rose)':'#fff'}}>{k.al}<small>{zh?`条 · 待研判 ${Math.max(0,k.al-12)}`:`· Pending ${Math.max(0,k.al-12)}`}</small></div>
          <div className="delta warn">{zh?'告警去噪率 71%':'Noise Reduction 71%'}</div>
        </div>
        <div className="kpi">
          <div className="l">{zh?'KPI 风险':'KPI Risk'}</div>
          <div className="v mono" style={{color: k.risk?'var(--amber)':'var(--emerald)'}}>{k.risk}<small>{zh?'站需关注':' Needs Attn'}</small></div>
          <div className="delta">{zh?'运营智能体 · 持续监测':'Ops Agent · Monitoring'}</div>
        </div>
      </div>

      <div className="right">
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
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Live event stream (left)
function EventStream({focusPlant, scenarioEvents, onCollapse}){
  const l = useLang(); const zh = l !== 'en';
  const [events, setEvents] = useState(()=> seedEvents(14));
  const containerRef = useRef(null);

  function seedEvents(n){
    const now = Date.now();
    return Array.from({length:n}).map((_,i)=>{
      const tpl = _GET[Math.floor(Math.random()*_GET.length)];
      return { id:'seed-'+i+'-'+Math.random(), t: now - (n-i)*4500 - Math.random()*1200, ...tpl };
    });
  }

  // Periodic global tick — appends ambient events
  useEffect(()=>{
    const id = setInterval(()=>{
      const tpl = _GET[Math.floor(Math.random()*_GET.length)];
      setEvents(prev => [...prev.slice(-40), { id:'g-'+Date.now()+'-'+Math.random(), t: Date.now(), ...tpl }]);
    }, 3200);
    return ()=>clearInterval(id);
  },[]);

  // Whenever scenario fires a new event, splice it in
  useEffect(()=>{
    if (!scenarioEvents || !scenarioEvents.length) return;
    const latest = scenarioEvents[scenarioEvents.length-1];
    if (!latest) return;
    setEvents(prev => [...prev.slice(-50), latest]);
  },[scenarioEvents]);

  // Auto-scroll to bottom
  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  },[events]);

  const list = focusPlant
    ? events.filter(e => !e.plantId || e.plantId === focusPlant.id).slice(-40)
    : events.slice(-40);

  return (
    <div className="panel stream corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> <T z="实时事件流" e="Event Stream"/></span>
        <span style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-mute)',fontSize:10}}>
          <span>EVENT · STREAM</span>
          <button className="panel-collapse" onClick={onCollapse} title="收起">‹</button>
        </span>
      </div>
      <div className="stream-body">
        <div className="stream-list" ref={containerRef}>
          {list.map(e=>{
            const ag = _ABI[e.agent];
            const cat = ag && _CATS[ag.cat];
            const time = new Date(e.t);
            const p = n => String(n).padStart(2,'0');
            const evtText = (!zh && e.en) ? e.en : e.text;
            return (
              <div key={e.id} className={`evt sev-${e.sev||'low'}`}>
                <div className="row1">
                  <span className="mono">{p(time.getHours())}:{p(time.getMinutes())}:{p(time.getSeconds())}</span>
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

// Mock chat sessions — full multi-turn conversations
const _SESSIONS_SEED = [
  { id:'s_cur', t:'当前', dateLabel:'today', agent:'ops', title:'当前会话', isCurrent:true,
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'agent', agent:'ops', text:'今日 06:00 ~ 现在，3 站托管运行良好。已自主闭环 2 起组串告警，0 起需人工介入。' },
    ]},
  { id:'s_h1', t:'09:42', dateLabel:'today', agent:'alert', title:'横州渔光 · 组串告警闭环',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@告警 横州渔光 C03 组串又跳了，查一下' },
      { role:'agent', agent:'alert', text:'已聚类去噪：3 条原始告警归并为 1 起组串异常事件 EVT-A203，已派发诊断。' },
      { role:'agent', agent:'diag', text:'诊断初判：C03-12 组串 IV 偏移 0.42，疑似接线松动；建议派工现场复核。' },
      { role:'user', text:'@排程 安排明早派单' },
      { role:'agent', agent:'sched', text:'已排入明日 08:00 优先工单，分配给驻站员小李，预计 30 分钟闭环。' },
      { role:'user', text:'@工单 看看历史相似工单' },
      { role:'agent', agent:'order', text:'近 30 天该方阵共 4 起类似工单，3 起为接线松动，1 起为压块腐蚀。' },
    ]},
  { id:'s_h2', t:'08:15', dateLabel:'today', agent:'query', title:'今日 PR 排名速览',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@问数 本月各电站 PR 排名？' },
      { role:'agent', agent:'query', text:'本月 PR 排名 福曦#01 (85.2%) > ILP-Banten (83.9%) > 横州渔光 (82.6%) > 示范站 (81.4%)。' },
    ]},
  { id:'s_h3', t:'昨日 17:30', dateLabel:'earlier', agent:'sched', title:'Banten-A 巡检调度',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@排程 Banten-A 明天需要做一次组串巡检' },
      { role:'agent', agent:'sched', text:'已编排 UAV-03 明日 08:30 巡检 · 覆盖 22 个方阵 · 预计 142 分钟。' },
      { role:'user', text:'@巡检 巡检覆盖率？' },
      { role:'agent', agent:'insp', text:'本周累计巡检覆盖率 87%，剩余 13% 计划本周末完成。' },
      { role:'user', text:'@安全 巡检期间是否有作业冲突？' },
      { role:'agent', agent:'safe', text:'08:30-11:00 时段无登高作业冲突，可安全执行无人机巡检。' },
      { role:'user', text:'@工单 自动派单' },
      { role:'agent', agent:'order', text:'已生成工单 W-2625-007，派发驻站员李工，已通知。' },
    ]},
  { id:'s_h4', t:'昨日 14:08', dateLabel:'earlier', agent:'pv', title:'光伏组件 SOP 检索',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@光伏 组件绝缘检测的标准流程？' },
      { role:'agent', agent:'pv', text:'SOP-PV-211 组件绝缘检测，包含 6 步关键操作与 3 项安全注意，是否查看完整文档？' },
      { role:'user', text:'是的，发给我' },
      { role:'agent', agent:'pv', text:'已发送至工作台 → 文档中心 → SOP-PV-211。建议巡检前阅读。' },
    ]},
  { id:'s_h5', t:'昨日 10:42', dateLabel:'earlier', agent:'safe', title:'高风险作业 24h 检视',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@安全 未来 24h 高风险作业有哪些？' },
      { role:'agent', agent:'safe', text:'未来 24h：3 项登高作业、1 项带电检修；已对应推送防护建议。' },
      { role:'user', text:'@安全 带电检修是哪个站？' },
      { role:'agent', agent:'safe', text:'示范站 INV-04 直流侧检修，作业人 2 名，已要求落实双人监护。' },
      { role:'user', text:'@排程 调整时间到下午' },
      { role:'agent', agent:'sched', text:'已与现场协调，作业时间调整至 14:00-16:00，避开早间发电高峰。' },
    ]},
  { id:'s_h6', t:'05-24 16:20', dateLabel:'earlier', agent:'diag', title:'东源 #01 IV 偏移诊断',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@诊断 东源 #01 最近 IV 曲线异常' },
      { role:'agent', agent:'diag', text:'近 7 天检测到 5 处 IV 偏移，主要集中在 P3 方阵 INV-04 ~ INV-06。' },
      { role:'user', text:'@诊断 给出可能原因' },
      { role:'agent', agent:'diag', text:'可能原因：① 组件 PID 衰减 (置信 64%)；② 组件遮挡 (置信 22%)；③ 接线箱接触不良 (置信 14%)。' },
      { role:'user', text:'@巡检 安排现场排查' },
      { role:'agent', agent:'insp', text:'UAV 巡检已安排明日 09:00，结合 IV 数据生成定向检测路径。' },
      { role:'user', text:'@光伏 PID 治理方案' },
      { role:'agent', agent:'pv', text:'推荐夜间正向偏压治理，连续 7 晚每晚 8h；预计恢复 75% 衰减功率。' },
    ]},
  { id:'s_h7', t:'05-24 09:00', dateLabel:'earlier', agent:'ops', title:'iRun 日报生成 · 周一',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'agent', agent:'ops', text:'周一日报已生成：可用率 99.42%、PR 82.8%、人均工单 3.5 张，3 项 KPI 风险已转工单。' },
    ]},
  { id:'s_h8', t:'05-23 11:15', dateLabel:'earlier', agent:'order', title:'工单合并方案审议',
    msgs:[
      { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
      { role:'user', text:'@工单 今日待处理工单太分散，能不能合并？' },
      { role:'agent', agent:'order', text:'今日 14 张工单可合并为 8 张，节省 38 km、56 min。' },
      { role:'user', text:'@排程 出一份合并方案' },
      { role:'agent', agent:'sched', text:'合并方案已生成 · 1 人 1 车 1 趟 · 节省里程 38 km、节省时间 56 min。' },
      { role:'user', text:'@安全 合并后作业是否安全' },
      { role:'agent', agent:'safe', text:'合并后无作业冲突，已审核通过。' },
      { role:'user', text:'@工单 按方案下发' },
      { role:'agent', agent:'order', text:'14 张工单已重排为 8 张派单，已通知现场人员。' },
      { role:'user', text:'@运营 跟踪结果' },
      { role:'agent', agent:'ops', text:'已开启工单闭环跟踪，每 30 分钟同步进度至本对话。' },
      { role:'user', text:'@运营 完成情况' },
      { role:'agent', agent:'ops', text:'截至 17:00，8 张工单已闭环 7 张，1 张延期至明早。' },
    ]},
];

function DispatchPanel({focusPlant, selectedAgent, onSelectAgent, onOpenAgent, onCollapse}){
  const [sessions, setSessions] = useState(_SESSIONS_SEED);
  const [currentId, setCurrentId] = useState('s_cur');
  const [input, setInput] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const renameInputRef = useRef(null);
  const l = useLang(); const zh = l !== 'en';

  function startRename(s, e){
    e?.stopPropagation();
    setEditingId(s.id);
    setEditValue(s.title);
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
      setSessions(prev => prev.map(s => s.id===editingId ? {...s, title:v} : s));
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
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      // ensure there's always at least one session
      if (next.length === 0){
        const fresh = { id:'s_cur', t:'当前', dateLabel:'today', agent:'ops',
          title: zh?'当前会话':'Current Session', isCurrent:true,
          msgs:[{ role:'sys', text: zh?'已连接 iRun 数字团队':'Connected to iRun team' }] };
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
    return s.title.toLowerCase().includes(q) ||
           s.msgs.some(m => (m.text||'').toLowerCase().includes(q));
  });

  function selectSession(id){
    setCurrentId(id);
    setHistoryOpen(false);
    setInput('');
    onSelectAgent?.(null);
  }

  function newSession(){
    const id = 's_' + Date.now();
    const now = new Date();
    const p = n => String(n).padStart(2,'0');
    const tLabel = `${p(now.getHours())}:${p(now.getMinutes())}`;
    const fresh = {
      id, t: tLabel, dateLabel:'today', agent:'ops',
      title: zh?'新会话':'New Session', isCurrent:true,
      msgs:[
        { role:'sys', text: zh?'已开始新会话 · iRun 数字团队待命':'New session started · iRun team standby' },
      ],
    };
    setSessions(prev => [fresh, ...prev]);
    setCurrentId(id);
    setHistoryOpen(false);
    setInput('');
    onSelectAgent?.(null);
    setTimeout(()=>{ inputRef.current?.focus(); }, 50);
  }

  // When an agent is selected, auto-prefill `@<agent> ` into the input and focus it
  useEffect(()=>{
    if (!selectedAgent) return;
    const ag = _ABI[selectedAgent];
    if (!ag) return;
    const prefix = `@${ag.short} `;
    setInput(prev => {
      // strip any previous @prefix and replace with the new one
      const stripped = prev.replace(/^@\S+\s*/, '');
      return prefix + stripped;
    });
    setTimeout(()=>{
      if (inputRef.current){
        inputRef.current.focus();
        const v = inputRef.current.value;
        inputRef.current.setSelectionRange(v.length, v.length);
      }
    }, 30);
  },[selectedAgent]);

  const send = (text, agentId) => {
    if(!text.trim()) return;
    const targetId = agentId || selectedAgent || 'ops';
    const userMsg = { role:'user', text };
    const agentMsg = { role:'agent', agent: targetId, text: respondTo(text, targetId, focusPlant) };
    setSessions(prev => prev.map(s => {
      if (s.id !== currentId) return s;
      const newMsgs = [...s.msgs, userMsg, agentMsg];
      // Auto-update title from first user message
      const isFirstUser = !s.msgs.some(m => m.role === 'user');
      const cleanText = text.replace(/^@\S+\s*/, '').trim();
      const newTitle = isFirstUser && cleanText
        ? cleanText.slice(0, 18) + (cleanText.length>18?'…':'')
        : s.title;
      return { ...s, msgs: newMsgs, title: newTitle, agent: targetId };
    }));
    setInput('');
    onSelectAgent?.(null);
  };

  const targetAgent = selectedAgent && _ABI[selectedAgent];

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
          <span>DISPATCH · CONSOLE</span>
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
                           title={s.title}>
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
                            <div className="hf-title">{s.title}</div>
                          )}
                          <div className="hf-meta">{s.t}</div>
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
          if (m.role==='sys') return <div key={i} className="tag-line" style={{textAlign:'center',padding:'4px 0'}}>· {m.text} ·</div>;
          const ag = m.role==='agent' ? _ABI[m.agent] : null;
          const cat = ag && _CATS[ag.cat];
          return (
            <div key={i} className={`msg ${m.role}`}>
              <div className="a" style={{borderColor:m.role==='user'?'var(--cyan)':cat?.color, color:m.role==='user'?'var(--cyan)':cat?.color}}>
                {m.role==='user' ? 'YOU' : ag?.code}
              </div>
              <div className="b">
                <div className="name">{m.role==='user' ? '指挥官' : ag?.name}</div>
                <div>{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="quick">
        {_QP.map((q,i)=>{
          const ag = _ABI[q.a];
          const cat = _CATS[ag.cat];
          const qLabel = zh ? q.t : (q.en || q.t);
          return (
            <div key={i} className="q-chip" onClick={()=>send(qLabel, q.a)}>
              <span className="tag" style={{color:cat.color}}>@{zh ? ag.short : ag.en}</span>
              <span>{qLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="composer">
        <input
          ref={inputRef}
          style={targetAgent ? {'--ph-color': _CATS[targetAgent.cat].color} : undefined}
          placeholder={targetAgent
            ? (zh ? `@${targetAgent.short} 输入指令…` : `@${targetAgent.en} type command…`)
            : (zh ? '@智能体 输入指令… 例如：@排程 合并今日工单' : '@agent type command… e.g. @Schedule merge today\'s tickets')}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send(input); }}
        />
        <button onClick={()=>send(input)}><T z="发送" e="Send"/></button>
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
  const cats = ['management','expert','process','tool'];
  return (
    <div className="panel skill-matrix corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> 智能体矩阵 · Agent Skill Matrix</span>
        <span style={{display:'flex',gap:14,color:'var(--text-mute)',fontSize:10,letterSpacing:'0.12em'}}>
          {cats.map(c => {
            const cat = _CATS[c];
            const n = _AGENTS.filter(a=>a.cat===c).length;
            return <span key={c}><i style={{display:'inline-block',width:8,height:8,background:cat.color,marginRight:4,verticalAlign:0}}/>{cat.label} · {n}</span>;
          })}
        </span>
      </div>
      <div className="matrix-grid">
        {_AGENTS.map(a => {
          const cat = _CATS[a.cat];
          const isOff = focusPlant && !focusPlant.agents.includes(a.id);
          const busy = busyMap?.[a.id];
          const status = isOff ? '未启用' : busy ? '工作中' : (Math.random()<0.25?'学习中':'空闲');
          const statusCls = busy ? 'work' : (status==='学习中' ? 'learn' : 'idle');
          return (
            <div key={a.id}
                 className={`agent-card ${busy?'busy':''}`}
                 style={{'--cat-color':cat.color, opacity:isOff?0.35:1}}
                 onClick={()=>onOpen(a.id)}>
              <div className="cat-strip"/>
              <div className="top">
                <div style={{flexShrink:0}}><RobotAvatar agent={a} size={28} glow={busy}/></div>
                <div>
                  <div className="nm">{zh ? a.name : a.en}</div>
                  <div className="rl">{zh ? a.role : (a.enRole || a.role)}</div>
                </div>
              </div>
              <div className="meta">
                <span className={`badge ${statusCls}`}>{isOff?'未启用':status}</span>
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
// Agent modal — drill into a single agent's working pane
function AgentModal({agentId, onClose, busyMap}){
  if(!agentId) return null;
  const l = useLang(); const zh = l !== 'en';
  const a = _ABI[agentId];
  const cat = _CATS[a.cat];
  const isBusy = busyMap?.[agentId];

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

  // sparkline values
  const spark = useMemo(()=>Array.from({length:24},()=>Math.random()*0.7+0.2),[agentId]);
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
                <h2>{zh ? a.name : a.en}</h2>
                <div className="role" style={{color:cat.color}}>{cat.label} · {zh ? a.role : (a.enRole || a.role)}</div>
                <p>{zh ? a.intro : (a.enIntro || a.intro)}</p>
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>{zh?'核心技能':'Core Skills'}</h3>
              <div className="skill-chips">
                {a.skills.map((s,si)=><span key={s} style={{color:cat.color,borderColor:cat.color+'55'}}>{zh ? s : (a.enSkills?.[si] || s)}</span>)}
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>{zh?'今日工作统计':"Today's Stats"}</h3>
              <div className="stat-grid">
                <div className="c"><div className="l">{zh?'调用次数':'Calls'}</div><div className="v mono">{a.metrics.todayCalls}</div></div>
                <div className="c"><div className="l">Token</div><div className="v mono">{a.metrics.tokens}</div></div>
                <div className="c"><div className="l">{zh?'成功率':'Success'}</div><div className="v mono">{a.metrics.success}%</div></div>
              </div>
              <div className="token-bars">
                <div className="row"><span className="n">{zh?'推理':'Reason'}</span><div className="b"><i style={{width:'72%'}}/></div><span className="v mono">17.4K</span></div>
                <div className="row"><span className="n">{zh?'工具':'Tools'}</span><div className="b"><i style={{width:'34%'}}/></div><span className="v mono">8.1K</span></div>
                <div className="row"><span className="n">{zh?'检索':'Retrieval'}</span><div className="b"><i style={{width:'52%'}}/></div><span className="v mono">12.3K</span></div>
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
                  points={spark.map((v,i)=>`${i*(240/(spark.length-1))},${80-v*70}`).join(' ')}
                />
                <polygon
                  fill="url(#g1)"
                  points={`0,80 ${spark.map((v,i)=>`${i*(240/(spark.length-1))},${80-v*70}`).join(' ')} 240,80`}
                />
                {[0,20,40,60,80].map(y=><line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgba(120,160,220,0.05)"/>)}
              </svg>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>操作</h3>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="q-chip" style={{borderColor:cat.color+'66',color:cat.color}}>与该智能体对话 →</button>
                <button className="q-chip">查看历史工单</button>
                <button className="q-chip">暂停 / 待机</button>
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
  const N = 24; // points per sparkline

  // Per-agent 24h shape functions → distinct working rhythm per agent.
  // Each returns a relative intensity in [0, 1] for hour h ∈ [0, 23].
  const SHAPES = {
    // 告警:7×24 高基线监控,夜间也有活动,小幅波动
    alert: h => 0.58 + 0.22 * Math.sin((h - 2) / 24 * Math.PI * 2) + 0.08 * Math.cos(h / 3),
    // 工单:7-21 单大峰,午后最高
    order: h => (h >= 7 && h <= 21) ? 0.32 + 0.6 * Math.sin((h - 7) / 14 * Math.PI) : 0.1,
    // 排程:早高峰(8h) + 傍晚峰(17h) 双峰
    sched: h => 0.1 + 0.55 * Math.exp(-((h - 8) ** 2) / 8) + 0.78 * Math.exp(-((h - 17) ** 2) / 10),
    // 预警:白天宽峰
    warn:  h => (h >= 6 && h <= 20) ? 0.26 + 0.62 * Math.sin((h - 6) / 14 * Math.PI) : 0.1,
    // 巡检:正午锐峰(无人机白天作业)
    insp:  h => Math.max(0.05, 0.92 * Math.exp(-((h - 12) ** 2) / 16)),
    // 诊断:白天主峰 + 上午次峰
    diag:  h => 0.16 + 0.55 * Math.max(0, Math.sin((h - 6) / 12 * Math.PI)) + 0.22 * Math.max(0, Math.sin((h - 9) / 4 * Math.PI - 0.4)),
    // 安全:全天偏稳,白天小幅抬升
    safe:  h => (h >= 7 && h <= 19) ? 0.4 + 0.25 * Math.sin((h - 7) / 12 * Math.PI) : 0.24,
    // 光伏助手:平稳波浪,昼夜差不大
    pv:    h => 0.46 + 0.18 * Math.sin((h - 4) / 24 * Math.PI * 2) + 0.12 * Math.sin(h / 2.5),
    // 问数:9-18 工作时段聚集
    query: h => (h >= 9 && h <= 18) ? 0.28 + 0.62 * Math.sin((h - 9) / 9 * Math.PI) : 0.07,
    // 运营:平稳缓变,白天微高
    ops:   h => 0.38 + 0.22 * Math.cos((h - 11) / 12 * Math.PI),
  };
  function shapeFor(id, h) {
    const f = SHAPES[id] || SHAPES.ops;
    return Math.max(0.04, Math.min(1, f(h)));
  }

  // Each agent's token K-value drives its absolute curve height.
  const TOK_VALS = _AGENTS.map(a => parseFloat(a.metrics.tokens) || 0);
  const GLOBAL_MAX_TOK = Math.max(...TOK_VALS, 1);

  // Deterministic seeded RNG → so each agent starts with a stable curve
  function seededRng(seed){
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function genSpark(agent, seed) {
    const rng = seededRng(seed);
    const pts = [];
    for (let h = 0; h < N; h++) {
      const base = shapeFor(agent.id, h);
      pts.push(Math.max(0.03, Math.min(1, base + (rng() - 0.5) * 0.08)));
    }
    return pts;
  }

  // Each agent owns its own live spark array, evolving over time
  const [sparks, setSparks] = useState(() => _AGENTS.map((a, i) => genSpark(a, i * 31337 + 7)));

  useEffect(() => {
    const id = setInterval(() => {
      setSparks(prev => prev.map((arr, i) => {
        const a = _AGENTS[i];
        // simulated clock hour advances slowly; each agent samples its own shape
        const hSim = ((Date.now() / 1000) / 3 + i * 0.7) % 24;
        const shape = shapeFor(a.id, hSim);
        const noise = (Math.random() - 0.5) * 0.1;
        const last = arr[arr.length - 1];
        const next = Math.max(0.03, Math.min(1, shape * 0.7 + last * 0.2 + noise + 0.05));
        return [...arr.slice(1), next];
      }));
    }, 700);
    return () => clearInterval(id);
  }, []);

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
            const cat = _CATS[a.cat];
            const busy = busyMap?.[a.id];
            const spark = sparks[i];
            const mx = Math.max(...spark);
            const peakH = spark.indexOf(mx);
            const color = busy ? '#22d3ee' : cat.color;
            // Curve height ∝ this agent's token volume vs the global max.
            // Floor at 0.18 so the tiniest agent is still visible.
            const tokVal = parseFloat(a.metrics.tokens) || 0;
            const agentScale = Math.max(0.18, tokVal / GLOBAL_MAX_TOK);
            const polyPts = spark.map((v, idx) =>
              `${(idx / (N-1)) * W},${H - 2 - v * agentScale * (H - 5)}`
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
                    <span className="tc-name">{zh ? a.short : a.en}</span>
                    <span className={`tc-st ${busy ? 'work' : 'idle'}`}>{busy ? (zh?'● 运行':'● Active') : (zh?'○ 空闲':'○ Idle')}</span>
                  </div>
                  <span className="tc-tok">{a.metrics.tokens}</span>
                </div>
                <svg className="tc-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                  <polygon points={areaPts} fill={color} fillOpacity="0.13"/>
                  <polyline points={polyPts} fill="none" stroke={color} strokeWidth="0.75" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <div className="tc-foot">
                  <span>{a.metrics.todayCalls} calls</span>
                  <span>{zh?'峰':'Peak'} {peakH}:00 · {a.metrics.success}%</span>
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
const _SKILL_CATS = ['全部','数据分析','运维工具','安全合规','通知推送','自定义'];
const _SKILLS = [
  { id:'weather', icon:'🌤', name:'气象预测', en:'Weather Forecast', cat:'运维工具', ver:'2.1.0', desc:'融合气象局 API，实现 7 天光照预测与逐小时发电量估算', status:'loaded', provider:'润建科技' },
  { id:'visual',  icon:'📸', name:'图像识别', en:'Visual AI',        cat:'运维工具', ver:'1.4.2', desc:'无人机巡检图像缺陷识别，支持热斑、遮挡、破损自动分类', status:'loaded', provider:'百度智能云' },
  { id:'dingtalk',icon:'🔔', name:'钉钉推送', en:'DingTalk',         cat:'通知推送', ver:'3.0.1', desc:'告警事件自动推送至钉钉群，支持 @成员 与审批工作流联动', status:'loaded', provider:'钉钉' },
  { id:'nl2sql',  icon:'🔍', name:'数据问答', en:'NL2SQL Pro',       cat:'数据分析', ver:'1.0.0', desc:'自然语言直接查询运维数据库，生成可视化报表与趋势图', status:'installed', provider:'Anthropic' },
  { id:'safety',  icon:'🛡', name:'安全合规', en:'Safety Guard',     cat:'安全合规', ver:'2.0.0', desc:'作业票自动审核、危险源识别、应急预案一键触发与存档', status:'installed', provider:'上海昌邑' },
  { id:'carbon',  icon:'🌱', name:'碳排放计算', en:'Carbon Calc',    cat:'数据分析', ver:'1.2.0', desc:'实时计算光伏减碳量、CCER 生成预测与绿电证书备案辅助', status:'available', provider:'碳阻迹' },
  { id:'wecom',   icon:'💬', name:'企微机器人', en:'WeCom Bot',       cat:'通知推送', ver:'1.5.0', desc:'企业微信群机器人，支持智能体消息卡片与快捷回复指令', status:'available', provider:'腾讯云' },
  { id:'grid',    icon:'⚡', name:'电网接入', en:'Grid Connect',     cat:'运维工具', ver:'Beta', desc:'与电网调度系统对接，实时上报发电数据并同步并网状态', status:'beta', provider:'国家电网' },
  { id:'report',  icon:'📊', name:'报表引擎', en:'Report Engine',    cat:'数据分析', ver:'2.3.1', desc:'日/周/月报自动生成，支持 PDF/Excel 导出与邮件定时发送', status:'available', provider:'帆软软件' },
  { id:'edge',    icon:'🖥', name:'边缘计算', en:'Edge AI',          cat:'运维工具', ver:'Beta', desc:'本地推理能力，断网场景下仍可运行核心告警与诊断逻辑', status:'beta', provider:'华为云' },
  { id:'pvfore',  icon:'📈', name:'发电预测', en:'PV Forecast',      cat:'数据分析', ver:'1.9.0', desc:'基于历史数据与气象的短期发电量预测，精度 ≤ 3% 误差', status:'available', provider:'远景能源' },
  { id:'openapi', icon:'⚙', name:'自定义 API', en:'Custom API',     cat:'自定义', ver:'Any', desc:'通过 OpenAPI 3.0 规范接入任意第三方服务，无需代码', status:'available', provider:'iRun Platform' },
];

function SkillModal({ onClose }){
  const [cat, setCat] = useState('全部');
  const [q, setQ] = useState('');
  const filtered = _SKILLS.filter(s =>
    (cat === '全部' || s.cat === cat) &&
    (s.name.includes(q) || s.en.toLowerCase().includes(q.toLowerCase()) || s.desc.includes(q))
  );
  const loaded = _SKILLS.filter(s => s.status === 'loaded').length;

  const statusLabel = { loaded:'已加载', installed:'已安装', available:'可安装', beta:'Beta' };

  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="skill-modal" onClick={e=>e.stopPropagation()}>
        {/* header */}
        <div className="skill-modal-hd">
          <div className="skill-modal-title">
            <h2>⚙ SKILL MARKETPLACE · 技能市场</h2>
            <p>集成第三方技能 · 扩展智能体能力边界 · OpenAPI / SDK 双模式接入</p>
          </div>
          <div className="skill-modal-stats">
            <div className="skill-modal-stat"><span className="sv">{_SKILLS.length}</span><span className="sl">总技能</span></div>
            <div className="skill-modal-stat"><span className="sv" style={{color:'var(--cyan)'}}>{loaded}</span><span className="sl">已加载</span></div>
            <div className="skill-modal-stat"><span className="sv" style={{color:'var(--emerald)'}}>2</span><span className="sl">已安装</span></div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* toolbar */}
        <div className="skill-modal-toolbar">
          <div className="skill-search">
            <span style={{color:'var(--text-mute)',fontSize:12}}>🔍</span>
            <input placeholder="搜索技能名称、功能描述…" value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div className="skill-cats">
            {_SKILL_CATS.map(c=>(
              <div key={c} className={`skill-cat${cat===c?' active':''}`} onClick={()=>setCat(c)}>{c}</div>
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
                  <div className="skill-card-name">{s.name}</div>
                  <div className="skill-card-en">{s.en} · v{s.ver}</div>
                </div>
              </div>
              <div className="skill-card-desc">{s.desc}</div>
              <div className="skill-card-footer">
                <span className="skill-card-provider">{s.provider}</span>
                <span className={`skill-status ${s.status}`}>{statusLabel[s.status]}</span>
              </div>
              {(s.status==='available') && (
                <button className="skill-install-btn" style={{marginTop:6}}>+ 安装</button>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="skill-modal-footer">
          <span>已加载 {loaded} 个技能 · 全部技能 {_SKILLS.length} 个 · 支持 OpenAPI / MCP / SDK 三种接入方式</span>
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
// DroneFlight — animated drone that loops twice on an ellipse, then flies off
function DroneFlight({onDone}){
  const [pos, setPos] = useState({x: 960, y: 240, opacity: 0, rot: 0});
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(()=>{
    const cx = 960, cy = 540, rx = 720, ry = 300;
    const loopDur = 5.5;      // seconds per loop
    const totalLoops = 2;
    const fadeIn = 0.4;
    const exitDur = 1.8;
    const totalDur = totalLoops * loopDur + exitDur;

    const tick = (t) => {
      if(!startRef.current) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;

      if(elapsed < totalLoops * loopDur){
        // start at top (-PI/2) and rotate clockwise
        const theta = -Math.PI/2 + (elapsed / loopDur) * Math.PI * 2;
        const x = cx + rx * Math.cos(theta);
        const y = cy + ry * Math.sin(theta);
        // tangent direction (image faces right by default)
        const tx = -rx * Math.sin(theta);
        const ty =  ry * Math.cos(theta);
        const rot = Math.atan2(ty, tx) * 180 / Math.PI;
        const opacity = Math.min(1, elapsed / fadeIn);
        setPos({x, y, opacity, rot});
        rafRef.current = requestAnimationFrame(tick);
      } else if(elapsed < totalDur){
        // exit upward + right
        const u = (elapsed - totalLoops * loopDur) / exitDur;
        const startX = cx + rx * Math.cos(-Math.PI/2);
        const startY = cy + ry * Math.sin(-Math.PI/2);
        const x = startX + (2400 - startX) * u;
        const y = startY + (-300 - startY) * u;
        const rot = -25;
        const opacity = Math.max(0, 1 - u * 0.7);
        setPos({x, y, opacity, rot});
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[]);

  return (
    <div className="drone-flight"
         style={{
           left: pos.x+'px',
           top: pos.y+'px',
           opacity: pos.opacity,
           transform: `translate(-50%,-50%) rotate(${pos.rot}deg)`
         }}>
      <img src="wrj001.png" alt="UAV"/>
      <div className="drone-shadow"/>
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

window.IRUN_UI = { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, AgentTokenPanel, MiniMap, QuickFuncs, AgentModal, AgentsRail, RobotAvatar, ModeStrip, SkillModal, PlantTitle, DroneFlight, PlantRobot, useClock, fmtTime, fmtDate, LangCtx };

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
            <span className="vsub">EVENT&nbsp;·&nbsp;STREAM</span>
          </>
        ) : (
          <span className="vlabel vlabel-en">EVENT STREAM</span>
        )}
        {count>0 && <span className="vcount">{count}</span>}
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
            <span className="vsub">DISPATCH</span>
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
function AgentsRail({focusPlant, busyMap, selected, onSelect, onOpen, onSkillOpen, onDroneFly, droneActive, tooltipEnabled=true}){
  const l = useLang(); const zh = l !== 'en';
  const [hoverId, setHoverId] = useState(null);
  const [hoverTop, setHoverTop] = useState(0);
  const railRef = useRef(null);

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
          const isOff = focusPlant && !focusPlant.agents.includes(a.id);
          const busy = busyMap?.[a.id];
          return (
            <div key={a.id}
                 className={`agent-tile ${selected===a.id?'active':''} ${isOff?'off':''} ${busy?'busy':''}`}
                 style={{'--cat-color':cat.color}}
                 onMouseEnter={(e)=>handleEnter(a.id, e)}
                 onClick={()=>onSelect?.(a.id)}
                 onDoubleClick={()=>onOpen?.(a.id)}>
              <div className="robot-wrap">
                <RobotAvatar agent={a} size={42} glow={busy || selected===a.id}/>
                {a.notif > 0 && <span className="badge-count">{a.notif}</span>}
                {busy && <span className="status-dot work"/>}
                {!busy && !isOff && <span className="status-dot online"/>}
                {isOff && <span className="status-dot off"/>}
              </div>
              <div className="agent-tile-name">
                <div className="nm-en">{zh ? a.short : a.en}</div>
                <div className="nm-cn">{zh ? a.en : (a.enRole || a.role)}</div>
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
              <div className="tt-en">{hovered.en}</div>
              <div className="tt-cn">{hovered.name}</div>
              <div className="tt-cat" style={{color: hoveredCat.color}}>{hoveredCat.label} · {hovered.role}</div>
            </div>
            <button className="tt-detail-btn"
                    onClick={(e)=>{ e.stopPropagation(); onOpen?.(hovered.id); setHoverId(null); }}>
              {zh?'查看详情 →':'Details →'}
            </button>
          </div>
          <div className="tt-body">{hovered.intro}</div>
          <div className="tt-skills">
            {hovered.skills.map(s => <span key={s} style={{borderColor: hoveredCat.color+'55', color: hoveredCat.color}}>{s}</span>)}
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
