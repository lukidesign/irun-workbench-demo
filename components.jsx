// iRun Workbench — UI components (no top-level App; mounted from app.jsx)
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
function TopBar({focusPlant, tenant, tenantIdx, onTenant, onBack}){
  const clock = useClock();
  const k = focusPlant ? {
    cap: focusPlant.capacity, pwr: focusPlant.power, gen: focusPlant.gen, al: focusPlant.alerts,
    plants: 1, risk: focusPlant.risk === 'high' ? 1 : 0,
  } : {
    cap: _AGG.capacity, pwr: _AGG.power, gen: _AGG.gen, al: _AGG.alerts,
    plants: _AGG.plants, risk: _AGG.risk,
  };
  const util = (k.pwr / k.cap * 100).toFixed(1);

  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark"><span>iR</span></div>
        <div className="brand-text">
          <b>iRUN<span style={{color:'var(--cyan)'}}>·</span>WORKBENCH</b>
          <small>数字运维指挥中心 · <em>v1.2.6</em></small>
        </div>
      </div>

      <div className="crumbs">
        <span className={`crumb ${!focusPlant?'active':''}`} onClick={onBack} style={{cursor:focusPlant?'pointer':'default'}}>总览</span>
        {focusPlant && <>
          <span className="crumb-sep">/</span>
          <span className="crumb active">{focusPlant.name}</span>
        </>}
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="l">在管电站</div>
          <div className="v mono">{k.plants}<small>座 · {focusPlant?'当前聚焦':'全租户'}</small></div>
          <div className="kpi-bar"><i style={{width: focusPlant?'100%':'82%'}}/></div>
        </div>
        <div className="kpi">
          <div className="l">装机容量</div>
          <div className="v mono">{k.cap.toFixed(1)}<small>MW</small></div>
          <div className="delta">▲ 18.2 MW · YTD</div>
        </div>
        <div className="kpi">
          <div className="l">实时功率</div>
          <div className="v mono">{k.pwr.toFixed(1)}<small>MW · {util}%</small></div>
          <div className="kpi-bar"><i style={{width:util+'%'}}/></div>
        </div>
        <div className="kpi">
          <div className="l">今日发电</div>
          <div className="v mono">{k.gen.toFixed(1)}<small>MWh</small></div>
          <div className="delta">▲ 4.6% · 同比</div>
        </div>
        <div className="kpi">
          <div className="l">活跃告警</div>
          <div className="v mono" style={{color: k.al>10?'var(--rose)':'#fff'}}>{k.al}<small>条 · 待研判 {Math.max(0,k.al-12)}</small></div>
          <div className="delta warn">告警去噪率 71%</div>
        </div>
        <div className="kpi">
          <div className="l">KPI 风险</div>
          <div className="v mono" style={{color: k.risk?'var(--amber)':'var(--emerald)'}}>{k.risk}<small>站需关注</small></div>
          <div className="delta">运营智能体 · 持续监测</div>
        </div>
      </div>

      <div className="right">
        <div className="tenant-pill">
          <span className="lbl">租户</span>
          <select value={tenantIdx} onChange={e=>onTenant(Number(e.target.value))}>
            {_TENANTS.map((t,i)=>(
              <option key={t.id} value={i}>{t.name}</option>
            ))}
          </select>
          <span className="arrow">▼</span>
        </div>
        <div className="live-wrap">
          <div className="live-time">
            <span className="dt">{fmtDate(clock)}</span>
            <span className="tm">{fmtTime(clock)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Live event stream (left)
function EventStream({focusPlant, scenarioEvents, onCollapse}){
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
        <span><span className="dot"/> 实时事件流</span>
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
            return (
              <div key={e.id} className={`evt sev-${e.sev||'low'}`}>
                <div className="row1">
                  <span className="mono">{p(time.getHours())}:{p(time.getMinutes())}:{p(time.getSeconds())}</span>
                  <span className="ag" style={{color:cat?.color,borderColor:cat?cat.color+'55':undefined}}>{ag?.code}</span>
                  <span className="who">{ag?.short}</span>
                </div>
                <div className="txt">{e.text}</div>
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
function DispatchPanel({focusPlant, selectedAgent, onSelectAgent, onOpenAgent, onCollapse}){
  const [messages, setMessages] = useState([
    { role:'sys', text:'已连接 iRun 数字团队 · 10 智能体在线' },
    { role:'agent', agent:'ops', text:'今日 06:00 ~ 现在，3 站托管运行良好。已自主闭环 2 起组串告警，0 起需人工介入。' },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(()=>{
    if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  },[messages]);

  const send = (text, agentId) => {
    if(!text.trim()) return;
    const targetId = agentId || selectedAgent || 'ops';
    setMessages(prev => [...prev,
      { role:'user', text },
      { role:'agent', agent: targetId, text: respondTo(text, targetId, focusPlant) }
    ]);
    setInput('');
    onSelectAgent?.(null);
  };

  const targetAgent = selectedAgent && _ABI[selectedAgent];

  return (
    <div className="panel dispatch corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot" style={{background:'var(--violet)',boxShadow:'0 0 8px var(--violet)'}}/> 对话调度</span>
        <span style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-mute)',fontSize:10}}>
          <span>DISPATCH · CONSOLE</span>
          <button className="panel-collapse" onClick={onCollapse} title="收起">›</button>
        </span>
      </div>

      {targetAgent && (
        <div className="target-strip">
          <span className="lbl">当前指挥</span>
          <span className="who" style={{color: _CATS[targetAgent.cat].color}}>
            @{targetAgent.short} · {targetAgent.en}
          </span>
          <span className="dismiss" onClick={()=>onSelectAgent?.(null)}>清除</span>
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
          return (
            <div key={i} className="q-chip" onClick={()=>send(q.t, q.a)}>
              <span className="tag" style={{color:cat.color}}>@{ag.short}</span>
              <span>{q.t}</span>
            </div>
          );
        })}
      </div>

      <div className="composer">
        <input
          placeholder={targetAgent ? `@${targetAgent.short} 输入指令…` : '@智能体 输入指令… 例如：@排程 合并今日工单'}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send(input); }}
        />
        <button onClick={()=>send(input)}>下发</button>
      </div>
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
                <div className="code">{a.code}</div>
                <div>
                  <div className="nm">{a.name}</div>
                  <div className="rl">{a.role}</div>
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
        <span><span className="dot"/> 区域分布</span>
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
  const items = [
    { id:'tok', ic:'TK', label:'Token 消耗', sub:'今日累计 · 全团队', val: (totalTokens/1000).toFixed(1), unit:'K' },
    { id:'wo',  ic:'WO', label:'工单看板',   sub:'今日 · 新建/完成', val:'14/11', unit:'' },
    { id:'kpi', ic:'PR', label:'PR 指标',    sub:'电站等效满发小时数', val:'4.62', unit:'h' },
    { id:'rpt', ic:'RP', label:'iRun 日报',  sub:'运营智能体 · 自动生成', val:'06:00', unit:'' },
    { id:'bus', ic:'AG', label:'活跃智能体', sub:'实时工作中', val: busyCount, unit:`/${_AGENTS.length}` },
  ];
  return (
    <div className="panel quick-funcs corners"><span className="c1"/>
      <div className="panel-hd">
        <span><span className="dot"/> 快捷功能</span>
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
  const a = _ABI[agentId];
  const cat = _CATS[a.cat];
  const isBusy = busyMap?.[agentId];

  // synthetic workflow log
  const log = useMemo(()=>{
    const seed = [
      ['09:42:18', '订阅事件总线 · 监听 alert.* 通道'],
      ['09:42:33', '收到 evt#A203 → 进入分析阶段'],
      ['09:42:34', '召回 RAG · 3 条相似案例 (相似度 0.91)'],
      ['09:42:36', '调用工具 plant.metrics.read · 384ms'],
      ['09:42:37', `生成结论 · 推理 token 消耗 ${Math.floor(Math.random()*900+200)}`],
      ['09:42:38', '产出工单字段并提交 → ord-agent'],
      ['09:42:40', '空闲 · 等待下一事件 …'],
    ];
    return seed;
  },[agentId]);

  // sparkline values
  const spark = useMemo(()=>Array.from({length:24},()=>Math.random()*0.7+0.2),[agentId]);
  return (
    <div className="modal-bd" onClick={onClose}>
      <div className="modal corners" onClick={e=>e.stopPropagation()} style={{'--cat-color':cat.color}}>
        <span className="c1"/>
        <div className="modal-hd">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="live" style={{color:cat.color}}>● {isBusy?'工作中':'待命'}</span>
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
                <h2>{a.name}</h2>
                <div className="role" style={{color:cat.color}}>{cat.label} · {a.role}</div>
                <p>{a.intro}</p>
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>核心技能</h3>
              <div className="skill-chips">
                {a.skills.map(s=><span key={s} style={{color:cat.color,borderColor:cat.color+'55'}}>{s}</span>)}
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>今日工作统计</h3>
              <div className="stat-grid">
                <div className="c"><div className="l">调用次数</div><div className="v mono">{a.metrics.todayCalls}</div></div>
                <div className="c"><div className="l">Token</div><div className="v mono">{a.metrics.tokens}</div></div>
                <div className="c"><div className="l">成功率</div><div className="v mono">{a.metrics.success}%</div></div>
              </div>
              <div className="token-bars">
                <div className="row"><span className="n">推理</span><div className="b"><i style={{width:'72%'}}/></div><span className="v mono">17.4K</span></div>
                <div className="row"><span className="n">工具</span><div className="b"><i style={{width:'34%'}}/></div><span className="v mono">8.1K</span></div>
                <div className="row"><span className="n">检索</span><div className="b"><i style={{width:'52%'}}/></div><span className="v mono">12.3K</span></div>
              </div>
            </div>
          </div>
          <div>
            <div className="section">
              <h3>值班台 · 实时工作流</h3>
              <div className="workflow">
                {log.map((l,i)=>(
                  <div key={i} className="ln"><span className="ts">{l[0]}</span><span>{l[1]}</span></div>
                ))}
              </div>
            </div>
            <div className="section" style={{marginTop:18}}>
              <h3>今日趋势 · 调用频次</h3>
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

window.IRUN_UI = { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, MiniMap, QuickFuncs, AgentModal, AgentsRail, RobotAvatar, useClock, fmtTime, fmtDate };

// ──────────────────────────────────────────────────────────────────────
// Collapsed event-stream tab — vertical handle on the left
function EventStreamTab({onExpand, count=0}){
  return (
    <div className="stream-tab" onClick={onExpand} title="展开实时事件流">
      <div className="stream-tab-inner">
        <span className="arrow">›</span>
        <span className="vlabel">实 时 事 件 流</span>
        <span className="vsub">EVENT&nbsp;·&nbsp;STREAM</span>
        {count>0 && <span className="vcount">{count}</span>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Collapsed dispatch tab — vertical handle that re-opens the dispatch panel
function DispatchTab({onExpand, unread=0}){
  return (
    <div className="dispatch-tab" onClick={onExpand} title="展开对话调度">
      <div className="dispatch-tab-inner">
        <span className="arrow">‹</span>
        <span className="vlabel">对 话 调 度</span>
        <span className="vsub">DISPATCH</span>
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
function AgentsRail({focusPlant, busyMap, selected, onSelect, onOpen}){
  const [hoverId, setHoverId] = useState(null);
  const [hoverTop, setHoverTop] = useState(0);
  const railRef = useRef(null);

  const handleEnter = (id, e) => {
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
        <em>人工智能代理 · 10</em>
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
                <div className="nm-en">{a.en}</div>
                <div className="nm-cn">{a.short}</div>
              </div>
            </div>
          );
        })}
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
          </div>
          <div className="tt-body">{hovered.intro}</div>
          <div className="tt-skills">
            {hovered.skills.map(s => <span key={s} style={{borderColor: hoveredCat.color+'55', color: hoveredCat.color}}>{s}</span>)}
          </div>
          <div className="tt-stats">
            <div><span className="l">今日调用</span><span className="v">{hovered.metrics.todayCalls}</span></div>
            <div><span className="l">Token</span><span className="v">{hovered.metrics.tokens}</span></div>
            <div><span className="l">成功率</span><span className="v">{hovered.metrics.success}%</span></div>
          </div>
          <div className="tt-foot">单击选为指挥目标 · 双击查看工作面板</div>
        </div>
      )}
    </div>
  );
}
