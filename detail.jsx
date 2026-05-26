// iRun Workbench — single-plant detail overlay with autonomous scenario playback
const { useState: _useState, useEffect: _useEffect, useRef: _useRef, useMemo: _useMemo } = React;
const useState = _useState, useEffect = _useEffect, useRef = _useRef, useMemo = _useMemo;
const { AGENT_BY_ID: _D_ABI, AGENT_CATEGORIES: _D_CAT, SCENARIOS: _SCENARIOS, AGENTS: _D_AGENTS } = window.IRUN;
const { LangCtx: _D_LANG } = window.IRUN_UI || {};
const _useD_Lang = () => React.useContext(_D_LANG || React.createContext('zh'));

// Positions for the 10 agents + plant + field + drone within the scene-stage (% coords)
const NODE_POS = {
  plant: { x: 50, y: 50, lbl: '电站', en: 'Plant', cat: 'tool' },
  ops:   { x: 50, y: 8,  lbl: '运营', en: 'Operate' },
  order: { x: 76, y: 16, lbl: '工单', en: 'Ticket' },
  sched: { x: 92, y: 30, lbl: '排程', en: 'Schedule' },
  safe:  { x: 96, y: 52, lbl: '安全', en: 'Safety' },
  pv:    { x: 92, y: 74, lbl: '光伏', en: 'PV Assist' },
  query: { x: 76, y: 88, lbl: '问数', en: 'Data Q&A' },
  field: { x: 50, y: 94, lbl: '现场运维', en: 'Field', special:true },
  insp:  { x: 24, y: 88, lbl: '巡检', en: 'Inspect' },
  drone: { x: 8,  y: 74, lbl: '无人机 UAV-03', en: 'UAV-03', special:true },
  warn:  { x: 4,  y: 52, lbl: '预警', en: 'Predict' },
  diag:  { x: 8,  y: 30, lbl: '诊断', en: 'Diagnose' },
  alert: { x: 24, y: 16, lbl: '告警', en: 'Alarm' },
};
const _NAME_MAP_EN = {plant:'Plant',field:'Field',drone:'UAV'};
const _NAME_MAP_CN = {plant:'电站',field:'现场',drone:'无人机'};

function getCat(id){
  const a = _D_ABI[id];
  if(a) return _D_CAT[a.cat];
  if(id==='plant')   return { color:'#22d3ee' };
  if(id==='field')   return { color:'#e2e8f0' };
  if(id==='drone')   return { color:'#a78bfa' };
  return { color:'#64748b' };
}

// ─────────────────────────────────────────────────────────────────────
// Hook: scenario stepping — provides current step + auto-advance + loop
function useScenarioStepping({scenarioIdx, plantId, mode, onStep, onScenarioChange}){
  const [stepIdx, setStepIdx] = useState(0);
  const timersRef = useRef([]);
  const scenario = _SCENARIOS[scenarioIdx];

  useEffect(()=>{
    if(!plantId) return;
    if(mode !== 'auto') return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setStepIdx(0);
    onStep?.(scenario.steps[0], 0, scenario);

    scenario.steps.forEach((s,i)=>{
      if(i===0) return;
      const id = setTimeout(()=>{
        setStepIdx(i);
        onStep?.(s, i, scenario);
      }, s.t);
      timersRef.current.push(id);
    });
    const last = scenario.steps[scenario.steps.length-1].t;
    const loopId = setTimeout(()=>{
      onScenarioChange?.((scenarioIdx+1) % _SCENARIOS.length);
    }, last + 4000);
    timersRef.current.push(loopId);

    return ()=> timersRef.current.forEach(clearTimeout);
  },[scenarioIdx, plantId, mode]);

  const cur = scenario.steps[stepIdx];
  return { stepIdx, cur, scenario };
}

// ─────────────────────────────────────────────────────────────────────
// PlantDetail — popup overlay (used on card click in img2 mode, or as default in other modes)
function PlantDetail({plant, onClose, scenario, stepIdx, cur, mode, scenarioIdx, onModeChange, onScenarioChange}){
  const zh = _useD_Lang() !== 'en';
  const [showVideo, setShowVideo] = useState(false);
  const detailRef = useRef(null);
  const videoRef = useRef(null);

  function toggleFullscreen(){
    const el = detailRef.current;
    if(!el) return;
    if(!document.fullscreenElement && !document.webkitFullscreenElement){
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  function openVideo(){
    setShowVideo(true);
    setTimeout(()=>{ if(videoRef.current){ videoRef.current.play().catch(()=>{}); } }, 100);
  }
  function closeVideo(){
    if(videoRef.current){ videoRef.current.pause(); videoRef.current.currentTime=0; }
    setShowVideo(false);
  }

  if(!plant) return null;
  const totalDur = scenario.steps[scenario.steps.length-1].t + 1500;
  const progress = Math.min(100, (cur?.t || 0) / totalDur * 100);

  return (
    <div className="detail-overlay">
      <div className="detail corners" ref={detailRef} onClick={e=>e.stopPropagation()}>
        <span className="c1"/>
        <div className="detail-hd">
          <div className="title">
            <b>{plant.name}</b>
            <small>{plant.region} · {plant.capacity} MW · {zh?'实时功率':'Live'} {plant.power} MW · {zh?'智能体':'Agents'} {plant.agents.length}/10</small>
          </div>
          <div className="stats">
            <div className="s"><span className="l">{zh?'日发电':"Today's Gen"}</span><span className="v mono">{plant.gen}<small style={{color:'var(--text-mute)',fontSize:10,marginLeft:4}}>MWh</small></span></div>
            <div className="s"><span className="l">{zh?'告警':'Alerts'}</span><span className="v mono" style={{color: plant.alerts>4?'var(--rose)':'#fff'}}>{plant.alerts}</span></div>
            <div className="s"><span className="l">PR</span><span className="v mono">{(82+plant.id.charCodeAt(1)%7).toFixed(1)}%</span></div>
            <div className="mode-tabs">
              <button className={mode==='auto'?'on':''} onClick={()=>onModeChange('auto')}>{zh?'托管模式':'Auto'}</button>
              <button className={mode==='command'?'on':''} onClick={()=>onModeChange('command')}>{zh?'指挥模式':'Command'}</button>
            </div>
            <button className="detail-btn" onClick={openVideo}>▶ {zh?'播放':'Play'}</button>
            <button className="detail-btn fs" onClick={toggleFullscreen}>⛶ {zh?'全屏':'Full'}</button>
            <div className="detail-close" onClick={onClose}>×</div>
          </div>
        </div>
        {showVideo && (
          <div className="video-overlay">
            <div className="v-close" onClick={closeVideo}>×</div>
            <video ref={videoRef} controls src="video.mp4" style={{maxWidth:'92%',maxHeight:'80%'}}/>
          </div>
        )}

        <SceneStage plant={plant} scenario={scenario} stepIdx={stepIdx} cur={cur} mode={mode}/>

        <div className="scenario-timeline">
          <div className="lbl">{scenario.title}</div>
          <div className="track"><i style={{width: progress+'%'}}/></div>
          <div className="step-name">
            {cur && (<>
              <span style={{color:'var(--cyan)'}}>step {stepIdx+1}/{scenario.steps.length}</span>
              &nbsp;·&nbsp;
              {cur.tag}
            </>)}
          </div>
          <div style={{display:'flex',gap:6,marginLeft:14}}>
            {_SCENARIOS.map((s,i)=>(
              <button key={s.id}
                className="q-chip"
                style={{borderColor: i===scenarioIdx?'var(--cyan)':'var(--line)', color: i===scenarioIdx?'var(--cyan)':'var(--text-dim)'}}
                onClick={()=>onScenarioChange(i)}>{s.id}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneStage({plant, scenario, stepIdx, cur, mode}){
  const zh = _useD_Lang() !== 'en';
  const visibleSteps = scenario.steps.slice(0, stepIdx+1);
  const activeAgentIds = useMemo(()=>{
    const set = new Set();
    visibleSteps.slice(-3).forEach(s=>{ set.add(s.from); set.add(s.to); });
    return set;
  },[stepIdx, scenario.id]);

  const hotCells = useMemo(()=>{
    return [16, 17, 28, 29, 64, 76, 88];
  },[plant.id]);

  const fromPos = cur ? NODE_POS[cur.from] : null;
  const toPos = cur ? NODE_POS[cur.to] : null;

  return (
    <div className="scene-stage">
      <div className="plant-graphic">
        <div className="array-grid">
          {Array.from({length:96}).map((_,i)=>{
            const isHot = scenario.id==='A' && hotCells.includes(i) && stepIdx >= 1 && stepIdx < 16;
            const isFixed = scenario.id==='A' && hotCells.includes(i) && stepIdx >= 16;
            const isInsp = scenario.id==='B' && [22,23,40,55,70,84].includes(i) && stepIdx >= 3;
            return <div key={i}
              className={`array-cell ${isHot?'hot':''} ${isFixed?'work':''} ${isInsp?'hot':''}`}
              style={{animationDelay: (i%9)*0.1+'s'}}/>;
          })}
        </div>
        <div style={{position:'absolute',left:8,top:8,fontSize:10,color:'var(--text-mute)',fontFamily:'var(--font-mono)',letterSpacing:'0.08em'}}>
          PV-ARRAY · 12×8 · {zh ? plant.short : (plant.name.split(/[·]/).pop() || plant.short)}
        </div>
        <div style={{position:'absolute',right:8,bottom:8,fontSize:10,color:'var(--text-mute)',fontFamily:'var(--font-mono)',letterSpacing:'0.08em'}}>
          INV-{plant.id.toUpperCase()}-{['A','B','C','D'][plant.id.charCodeAt(1)%4]}
        </div>
      </div>

      <svg style={{position:'absolute',inset:0,pointerEvents:'none',width:'100%',height:'100%'}}
           viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0"/>
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#22d3ee"/>
          </marker>
        </defs>
        {Object.keys(NODE_POS).filter(k=>k!=='plant').map(k=>{
          const p = NODE_POS[k];
          return <line key={'bb-'+k} x1={p.x} y1={p.y} x2={50} y2={50}
                       stroke="rgba(120,160,220,0.06)" strokeWidth="0.15" strokeDasharray="0.6 1" vectorEffect="non-scaling-stroke"/>;
        })}
        {fromPos && toPos && cur.from !== cur.to && (
          <g>
            <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                  stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="1.2 0.8" opacity="0.85" vectorEffect="non-scaling-stroke">
              <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="0.6s" repeatCount="indefinite"/>
            </line>
            <circle r="0.7" fill="#22d3ee" filter="drop-shadow(0 0 6px #22d3ee)">
              <animateMotion dur="1.4s" repeatCount="indefinite"
                path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}/>
            </circle>
          </g>
        )}
      </svg>

      {Object.entries(NODE_POS).filter(([id])=>id!=='plant').map(([id,pos])=>{
        const cat = getCat(id);
        const isActive = activeAgentIds.has(id);
        const ag = _D_ABI[id];
        const code = ag?.code || (id==='field' ? 'FLD' : id==='drone' ? 'UAV' : 'XX');
        const present = !ag || plant.agents.includes(id) || id==='field' || id==='drone';
        return (
          <div key={id}
               className={`agent-node ${isActive?'active':''}`}
               style={{left:pos.x+'%', top:pos.y+'%', '--cat-color':cat.color, opacity: present?1:0.3}}>
            <div className="av-circle" style={{color:cat.color, background: isActive?'rgba(34,211,238,0.12)':'rgba(6,10,22,0.85)'}}>
              {code}
            </div>
            <div className="lbl">{zh ? pos.lbl : (pos.en || pos.lbl)}</div>
          </div>
        );
      })}

      {cur && toPos && (
        <div className="scene-bubble" key={stepIdx}
             style={{left: toPos.x+'%', top: (toPos.y - 5)+'%'}}>
          <span className="tag">{cur.tag} · {zh
              ? (_D_ABI[cur.from]?.short || _NAME_MAP_CN[cur.from] || cur.from)
              : (_D_ABI[cur.from]?.en    || _NAME_MAP_EN[cur.from] || cur.from)} → {zh
              ? (_D_ABI[cur.to]?.short   || _NAME_MAP_CN[cur.to]   || cur.to)
              : (_D_ABI[cur.to]?.en      || _NAME_MAP_EN[cur.to]   || cur.to)}</span>
          {cur.text}
        </div>
      )}

      <DigitalTeam plant={plant} activeAgentIds={activeAgentIds}/>
      <SceneLog scenario={scenario} steps={visibleSteps} plant={plant}/>
      <TokenStrip plant={plant} stepIdx={stepIdx}/>

      <div className="legend">
        <span><i style={{background:'#34d399'}}/>{zh?'正常':'Normal'}</span>
        <span><i style={{background:'#fbbf24'}}/>{zh?'预警':'Warn'}</span>
        <span><i style={{background:'#f87171'}}/>{zh?'故障':'Fault'}</span>
        <span><i style={{background:'#22d3ee'}}/>{zh?'处置中':'Handling'}</span>
      </div>
    </div>
  );
}

function DigitalTeam({plant, activeAgentIds}){
  const zh = _useD_Lang() !== 'en';
  const ALL_IDS = ['ops','warn','alert','diag','safe','order','sched','pv','insp','query'];
  return (
    <div className="team-panel">
      <h4>
        <span>{zh?'数字团队':'Digital Team'}</span>
        <span className="cnt">{plant.agents.length} / {ALL_IDS.length} {zh?'配备':'staffed'}</span>
      </h4>
      <div className="team-list">
        {ALL_IDS.map(id=>{
          const ag = _D_ABI[id];
          if(!ag) return null;
          const cat = _D_CAT[ag.cat];
          const assigned = plant.agents.includes(id);
          const isActive = activeAgentIds.has(id);
          const hasAlert = ag.notif > 0;
          const statusLabel = !assigned ? (zh?'未配备':'N/A')
            : isActive ? (zh?'工作中':'Working')
            : hasAlert ? (zh?'待处理':'Pending')
            : (zh?'就绪':'Ready');
          const statusCls = !assigned ? '' : isActive ? 'work' : hasAlert ? 'alert' : '';
          return (
            <div key={id} className={`team-row${assigned?'':' absent'}`}
                 style={{'--cat-c': cat.color}}>
              <div className="tc">{ag.code}</div>
              <div className="ti">
                <div className="tn">{zh ? ag.name : ag.en}</div>
                <div className="tr">{zh ? ag.role : (ag.enRole || ag.role)}</div>
              </div>
              <div className={`ts ${statusCls}`}>{statusLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneLog({scenario, steps, plant}){
  const zh = _useD_Lang() !== 'en';
  const ref = useRef(null);
  // header(35) + 10 rows × 30px (more compact) = 335
  const teamRows = 10;
  const teamH = 35 + teamRows * 30;
  const topOffset = 14 + teamH + 10;
  useEffect(()=>{
    if(ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  },[steps.length]);
  return (
    <div className="scene-log" style={{top: topOffset+'px'}}>
      <h4>
        <span>{zh?'多 Agent 协同日志':'Multi-Agent Log'}</span>
        <span className="badge">{scenario.id} · {steps.length}/{scenario.steps.length}</span>
      </h4>
      <div className="body" ref={ref}>
        {steps.map((s,i)=>{
          const from = _D_ABI[s.from];
          const to = _D_ABI[s.to];
          const fromName = zh
            ? (from?.short || _NAME_MAP_CN[s.from] || s.from)
            : (from?.en    || _NAME_MAP_EN[s.from] || s.from);
          const toName = zh
            ? (to?.short || _NAME_MAP_CN[s.to] || s.to)
            : (to?.en    || _NAME_MAP_EN[s.to] || s.to);
          return (
            <div key={i} className="ln">
              <div className="hd">
                <span>T+{(s.t/1000).toFixed(1)}s</span>
                <b>{fromName}</b>
                <span>→</span>
                <b style={{color: s.type==='handoff'?'#a78bfa':'var(--cyan)'}}>{toName}</b>
                <span style={{marginLeft:'auto',color:'var(--text-mute)',fontSize:9}}>[{s.tag}]</span>
              </div>
              <div className="tx">{s.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenStrip({plant, stepIdx}){
  const zh = _useD_Lang() !== 'en';
  const base = 24800;
  const used = base + stepIdx * 1240 + Math.floor(Math.sin(stepIdx)*120);
  const spark = useMemo(()=>Array.from({length:32}).map((_,i)=>0.3+0.6*Math.abs(Math.sin(i*0.6+plant.id.length))*(0.6+0.4*Math.random())),[plant.id]);
  return (
    <div className="token-strip">
      <h4>Token · {zh?'实时消耗':'Live Usage'}</h4>
      <div className="big mono">{(used/1000).toFixed(2)}<small>K · {zh?'今日':'today'}</small></div>
      <div className="row"><span>{zh?'强度 / MW':'Density / MW'}</span><span>{(used/plant.capacity).toFixed(0)}</span></div>
      <div className="row"><span>{zh?'调用 / min':'Calls / min'}</span><span>{(8 + stepIdx*0.6).toFixed(1)}</span></div>
      <div className="row"><span>{zh?'成功率':'Success'}</span><span style={{color:'var(--emerald)'}}>98.6%</span></div>
      <svg viewBox="0 0 220 30" className="spark">
        <polyline fill="none" stroke="#22d3ee" strokeWidth="1.2"
          points={spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')}/>
        <polyline fill="rgba(34,211,238,0.12)" stroke="none"
          points={`0,30 ${spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')} 220,30`}/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PlantInlineDock — inline 6-card dashboard for img2 mode (replaces popup)
function PlantInlineDock({plant, scenario, stepIdx, cur, mode, scenarioIdx, onModeChange, onScenarioChange, onOpenModal}){
  const totalDur = scenario.steps[scenario.steps.length-1].t + 1500;
  const progress = Math.min(100, (cur?.t || 0) / totalDur * 100);
  const visibleSteps = scenario.steps.slice(0, stepIdx+1);
  const activeAgentIds = useMemo(()=>{
    const set = new Set();
    visibleSteps.slice(-3).forEach(s=>{ set.add(s.from); set.add(s.to); });
    return set;
  },[stepIdx, scenario.id]);

  const stopProp = e => e.stopPropagation();
  const open = (sec) => () => onOpenModal?.(sec);

  return (
    <div className="plant-inline-dock">
      <PIDCardKpi
        plant={plant} mode={mode} scenarioIdx={scenarioIdx} scenario={scenario}
        cur={cur} stepIdx={stepIdx} progress={progress}
        onModeChange={onModeChange} onScenarioChange={onScenarioChange}
        onOpen={open('kpi')}/>

      <PIDCardTeam
        plant={plant} activeAgentIds={activeAgentIds}
        onOpen={open('team')}/>

      <PIDCardLog
        scenario={scenario} steps={visibleSteps}
        onOpen={open('log')}/>

      <PIDCardScene
        plant={plant} scenario={scenario} stepIdx={stepIdx} cur={cur}
        activeAgentIds={activeAgentIds}
        onOpen={open('scene')}/>

      <PIDCardToken
        plant={plant} stepIdx={stepIdx}
        onOpen={open('token')}/>
    </div>
  );
}

// ── Card 1: Plant KPI summary + mode tabs + scenario timeline
function PIDCardKpi({plant, mode, scenarioIdx, scenario, cur, stepIdx, progress, onModeChange, onScenarioChange, onOpen}){
  const zh = _useD_Lang() !== 'en';
  const stopProp = e => e.stopPropagation();
  return (
    <div className="pid-card pid-c-kpi" onClick={onOpen}>
      <div className="pid-k-top">
        <b className="pid-k-name">{plant.name}</b>
        <button className="pid-k-btn">▶ {zh?'播放':'Play'}</button>
        <button className="pid-k-btn">⛶ {zh?'全屏':'Full'}</button>
      </div>
      <div className="pid-k-sub">{plant.region} · {plant.capacity} MW · {zh?'实时功率':'Live'} {plant.power} MW</div>
      <div className="pid-k-stats">
        <div className="s"><span className="l">{zh?'日发电':"Today's Gen"}</span><span className="v">{plant.gen}<small>MWh</small></span></div>
        <div className="s"><span className="l">{zh?'告警':'Alerts'}</span><span className="v" style={{color: plant.alerts>4?'var(--rose)':'#fff'}}>{plant.alerts}</span></div>
        <div className="s"><span className="l">PR</span><span className="v">{(82+plant.id.charCodeAt(1)%7).toFixed(1)}%</span></div>
      </div>
      <div className="pid-k-mode">
        <button className={mode==='auto'?'on':''} onClick={(e)=>{stopProp(e); onModeChange('auto');}}>{zh?'托管模式':'Auto'}</button>
        <button className={mode==='command'?'on':''} onClick={(e)=>{stopProp(e); onModeChange('command');}}>{zh?'指挥模式':'Command'}</button>
      </div>
      <div className="pid-k-tl">
        <div className="pid-tl-chips">
          {_SCENARIOS.map((s,i)=>(
            <button key={s.id}
              className={`pid-q-chip${i===scenarioIdx?' on':''}`}
              onClick={(e)=>{stopProp(e); onScenarioChange(i);}}>{s.id}</button>
          ))}
          <span className="pid-tl-lbl">{zh?'场景':'Scenario'} {scenario.id} · {scenario.title}</span>
        </div>
        <div className="pid-tl-track"><i style={{width: progress+'%'}}/></div>
        <div className="pid-tl-step">step {stepIdx+1}/{scenario.steps.length} · {cur?.tag||''}</div>
      </div>
    </div>
  );
}

// ── Card 2: Digital Team (auto-scrolling list)
function PIDCardTeam({plant, activeAgentIds, onOpen}){
  const zh = _useD_Lang() !== 'en';
  const ALL_IDS = ['ops','warn','alert','diag','safe','order','sched','pv','insp','query'];
  const listRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>{
      setScrollOffset(o => {
        const el = listRef.current;
        if(!el) return 0;
        const max = el.scrollHeight - el.clientHeight;
        if(max <= 0) return 0;
        const next = o + 1;
        return next > max + 30 ? 0 : next;
      });
    }, 60);
    return ()=> clearInterval(id);
  },[]);
  useEffect(()=>{ if(listRef.current) listRef.current.scrollTop = scrollOffset; },[scrollOffset]);

  return (
    <div className="pid-card pid-c-team" onClick={onOpen}>
      <div className="pid-h">
        <span>{zh?'数字团队':'Digital Team'}</span>
        <span className="pid-h-cnt">{plant.agents.length} / {ALL_IDS.length} {zh?'配备':'staffed'}</span>
      </div>
      <div className="pid-team-list" ref={listRef}>
        {ALL_IDS.map(id=>{
          const ag = _D_ABI[id];
          if(!ag) return null;
          const cat = _D_CAT[ag.cat];
          const assigned = plant.agents.includes(id);
          const isActive = activeAgentIds.has(id);
          const hasAlert = ag.notif > 0;
          const statusLabel = !assigned ? (zh?'未配备':'N/A')
            : isActive ? (zh?'工作中':'Working')
            : hasAlert ? (zh?'待处理':'Pending')
            : (zh?'就绪':'Ready');
          const statusCls = !assigned ? '' : isActive ? 'work' : hasAlert ? 'alert' : '';
          return (
            <div key={id} className={`pid-team-row${assigned?'':' absent'}`} style={{'--cat-c':cat.color}}>
              <div className="pid-tc">{ag.code}</div>
              <div className="pid-ti">
                <div className="pid-tn">{zh ? ag.name : ag.en}</div>
              </div>
              <div className={`pid-ts ${statusCls}`}>{statusLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card 3: Multi-agent collaboration log (auto-scroll)
function PIDCardLog({scenario, steps, onOpen}){
  const zh = _useD_Lang() !== 'en';
  const ref = useRef(null);
  useEffect(()=>{
    if(ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  },[steps.length]);
  return (
    <div className="pid-card pid-c-log" onClick={onOpen}>
      <div className="pid-h">
        <span>{zh?'多 Agent 协同日志':'Multi-Agent Log'}</span>
        <span className="pid-h-badge">{scenario.id} · {steps.length}/{scenario.steps.length}</span>
      </div>
      <div className="pid-log-body" ref={ref}>
        {steps.map((s,i)=>{
          const from = _D_ABI[s.from];
          const to = _D_ABI[s.to];
          const fromName = zh
            ? (from?.short || _NAME_MAP_CN[s.from] || s.from)
            : (from?.en    || _NAME_MAP_EN[s.from] || s.from);
          const toName = zh
            ? (to?.short || _NAME_MAP_CN[s.to] || s.to)
            : (to?.en    || _NAME_MAP_EN[s.to] || s.to);
          return (
            <div key={i} className="pid-log-ln">
              <div className="pid-log-hd">
                <span>T+{(s.t/1000).toFixed(1)}s</span>
                <b>{fromName}</b>
                <span>→</span>
                <b style={{color: s.type==='handoff'?'#a78bfa':'var(--cyan)'}}>{toName}</b>
                <span className="tg">[{s.tag}]</span>
              </div>
              <div className="pid-log-tx">{s.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card 5: Full scene (PV grid + agent ring + connections + bubble)
function PIDCardScene({plant, scenario, stepIdx, cur, activeAgentIds, onOpen}){
  const zh = _useD_Lang() !== 'en';
  const hotCells = useMemo(()=>[16, 17, 28, 29, 64, 76, 88], [plant.id]);
  const fromPos = cur ? NODE_POS[cur.from] : null;
  const toPos = cur ? NODE_POS[cur.to] : null;

  return (
    <div className="pid-card pid-c-scene" onClick={onOpen}>
      <div className="pid-h">
        <span>{zh?'协同图谱':'Collab Graph'}</span>
        <span className="pid-h-meta">{Object.keys(NODE_POS).length-1} nodes</span>
      </div>
      <div className="pid-scene-wrap">
        {/* mini PV grid in center */}
        <div className="pid-scene-pv">
          {Array.from({length:96}).map((_,i)=>{
            const isHot = scenario.id==='A' && hotCells.includes(i) && stepIdx >= 1 && stepIdx < 16;
            const isFixed = scenario.id==='A' && hotCells.includes(i) && stepIdx >= 16;
            const isInsp = scenario.id==='B' && [22,23,40,55,70,84].includes(i) && stepIdx >= 3;
            return <div key={i} className={`pid-scene-cell ${isHot?'hot':''} ${isFixed?'work':''} ${isInsp?'hot':''}`}/>;
          })}
        </div>
        {/* connection lines */}
        <svg className="pid-scene-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Object.keys(NODE_POS).filter(k=>k!=='plant').map(k=>{
            const p = NODE_POS[k];
            return <line key={'bb-'+k} x1={p.x} y1={p.y} x2={50} y2={50}
                         stroke="rgba(120,160,220,0.08)" strokeWidth="0.2" strokeDasharray="0.6 1" vectorEffect="non-scaling-stroke"/>;
          })}
          {fromPos && toPos && cur.from !== cur.to && (
            <g>
              <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                    stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="1.2 0.8" opacity="0.85" vectorEffect="non-scaling-stroke">
                <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="0.6s" repeatCount="indefinite"/>
              </line>
              <circle r="1" fill="#22d3ee" filter="drop-shadow(0 0 4px #22d3ee)">
                <animateMotion dur="1.4s" repeatCount="indefinite"
                  path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}/>
              </circle>
            </g>
          )}
        </svg>
        {/* agent dots around perimeter */}
        {Object.entries(NODE_POS).filter(([id])=>id!=='plant').map(([id,pos])=>{
          const cat = getCat(id);
          const isActive = activeAgentIds.has(id);
          const ag = _D_ABI[id];
          const code = ag?.code || (id==='field' ? 'FLD' : id==='drone' ? 'UAV' : 'XX');
          const present = !ag || plant.agents.includes(id) || id==='field' || id==='drone';
          return (
            <div key={id}
                 className={`pid-scene-node ${isActive?'active':''}`}
                 style={{left:pos.x+'%', top:pos.y+'%', '--cat-color':cat.color, opacity: present?1:0.35}}>
              <div className="pid-sn-circle" style={{color:cat.color, background: isActive?'rgba(34,211,238,0.16)':'rgba(6,10,22,0.85)'}}>
                {code}
              </div>
            </div>
          );
        })}
        {/* current step mini bubble */}
        {cur && toPos && (
          <div className="pid-scene-bubble"
               style={{left: toPos.x+'%', top: (toPos.y - 6)+'%'}}>
            {cur.tag}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card 6: TOKEN consumption
function PIDCardToken({plant, stepIdx, onOpen}){
  const zh = _useD_Lang() !== 'en';
  const base = 24800;
  const used = base + stepIdx * 1240 + Math.floor(Math.sin(stepIdx)*120);
  const spark = useMemo(()=>Array.from({length:32}).map((_,i)=>0.3+0.6*Math.abs(Math.sin(i*0.6+plant.id.length))*(0.6+0.4*Math.random())),[plant.id]);
  return (
    <div className="pid-card pid-c-token" onClick={onOpen}>
      <div className="pid-h">
        <span>TOKEN · {zh?'实时消耗':'Live Usage'}</span>
      </div>
      <div className="pid-tok-big">{(used/1000).toFixed(2)}<small>K · {zh?'今日':'today'}</small></div>
      <div className="pid-tok-rows">
        <div className="r"><span>{zh?'强度 / MW':'Density / MW'}</span><span>{(used/plant.capacity).toFixed(0)}</span></div>
        <div className="r"><span>{zh?'调用 / min':'Calls / min'}</span><span>{(8 + stepIdx*0.6).toFixed(1)}</span></div>
        <div className="r"><span>{zh?'成功率':'Success'}</span><span style={{color:'var(--emerald)'}}>98.6%</span></div>
      </div>
      <svg viewBox="0 0 220 30" className="pid-tok-spark" preserveAspectRatio="none">
        <polyline fill="none" stroke="#22d3ee" strokeWidth="1.2"
          points={spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')}/>
        <polyline fill="rgba(34,211,238,0.12)" stroke="none"
          points={`0,30 ${spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')} 220,30`}/>
      </svg>
    </div>
  );
}

window.IRUN_DETAIL = { PlantDetail, PlantInlineDock, useScenarioStepping };
