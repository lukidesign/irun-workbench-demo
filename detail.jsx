// iRun Workbench — single-plant detail overlay with autonomous scenario playback
const { useState: _useState, useEffect: _useEffect, useRef: _useRef, useMemo: _useMemo } = React;
const useState = _useState, useEffect = _useEffect, useRef = _useRef, useMemo = _useMemo;
const { AGENT_BY_ID: _D_ABI, AGENT_CATEGORIES: _D_CAT, SCENARIOS: _SCENARIOS, AGENTS: _D_AGENTS } = window.IRUN;

// Positions for the 10 agents + plant + field + drone within the scene-stage (% coords)
const NODE_POS = {
  plant: { x: 50, y: 50, lbl: '电站', cat: 'tool' },
  ops:   { x: 50, y: 8,  lbl: '运营' },
  order: { x: 76, y: 16, lbl: '工单' },
  sched: { x: 92, y: 30, lbl: '排程' },
  safe:  { x: 96, y: 52, lbl: '安全' },
  pv:    { x: 92, y: 74, lbl: '光伏' },
  query: { x: 76, y: 88, lbl: '问数' },
  field: { x: 50, y: 94, lbl: '现场运维', special:true },
  insp:  { x: 24, y: 88, lbl: '巡检' },
  drone: { x: 8,  y: 74, lbl: '无人机 UAV-03', special:true },
  warn:  { x: 4,  y: 52, lbl: '预警' },
  diag:  { x: 8,  y: 30, lbl: '诊断' },
  alert: { x: 24, y: 16, lbl: '告警' },
};

function getCat(id){
  const a = _D_ABI[id];
  if(a) return _D_CAT[a.cat];
  if(id==='plant')   return { color:'#22d3ee' };
  if(id==='field')   return { color:'#e2e8f0' };
  if(id==='drone')   return { color:'#a78bfa' };
  return { color:'#64748b' };
}

function PlantDetail({plant, onClose, scenarioIdx, mode, onModeChange, onScenarioChange, onStep}){
  const scenario = _SCENARIOS[scenarioIdx];
  const [stepIdx, setStepIdx] = useState(0);
  const [played, setPlayed] = useState(new Set([0]));
  const [showVideo, setShowVideo] = useState(false);
  const timersRef = useRef([]);
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
    // autoplay after mount
    setTimeout(()=>{ if(videoRef.current){ videoRef.current.play().catch(()=>{}); } }, 100);
  }
  function closeVideo(){
    if(videoRef.current){ videoRef.current.pause(); videoRef.current.currentTime=0; }
    setShowVideo(false);
  }

  // Reset and replay whenever scenario or plant changes
  useEffect(()=>{
    if (mode !== 'auto') return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setStepIdx(0);
    setPlayed(new Set([0]));
    onStep?.(scenario.steps[0], 0, scenario);

    scenario.steps.forEach((s,i)=>{
      if(i===0) return;
      const id = setTimeout(()=>{
        setStepIdx(i);
        setPlayed(prev => { const n = new Set(prev); n.add(i); return n; });
        onStep?.(s, i, scenario);
      }, s.t);
      timersRef.current.push(id);
    });
    // loop after last step
    const last = scenario.steps[scenario.steps.length-1].t;
    const loopId = setTimeout(()=>{
      // Swap scenario
      onScenarioChange?.((scenarioIdx+1) % _SCENARIOS.length);
    }, last + 4000);
    timersRef.current.push(loopId);

    return ()=> timersRef.current.forEach(clearTimeout);
  }, [scenarioIdx, plant?.id, mode]);

  if(!plant) return null;
  const cur = scenario.steps[stepIdx];
  const totalDur = scenario.steps[scenario.steps.length-1].t + 1500;
  const progress = Math.min(100, (cur?.t || 0) / totalDur * 100);

  return (
    <div className="detail-overlay">
      <div className="detail corners" ref={detailRef} onClick={e=>e.stopPropagation()}>
        <span className="c1"/>
        <div className="detail-hd">
          <div className="title">
            <b>{plant.name}</b>
            <small>{plant.region} · {plant.capacity} MW · 实时功率 {plant.power} MW · 智能体 {plant.agents.length}/10</small>
          </div>
          <div className="stats">
            <div className="s"><span className="l">日发电</span><span className="v mono">{plant.gen}<small style={{color:'var(--text-mute)',fontSize:10,marginLeft:4}}>MWh</small></span></div>
            <div className="s"><span className="l">告警</span><span className="v mono" style={{color: plant.alerts>4?'var(--rose)':'#fff'}}>{plant.alerts}</span></div>
            <div className="s"><span className="l">PR</span><span className="v mono">{(82+plant.id.charCodeAt(1)%7).toFixed(1)}%</span></div>
            <div className="mode-tabs">
              <button className={mode==='auto'?'on':''} onClick={()=>onModeChange('auto')}>托管模式</button>
              <button className={mode==='command'?'on':''} onClick={()=>onModeChange('command')}>指挥模式</button>
            </div>
            <button className="detail-btn" onClick={openVideo}>▶ 播放</button>
            <button className="detail-btn fs" onClick={toggleFullscreen}>⛶ 全屏</button>
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
          <div className="lbl">
            {scenario.title}
          </div>
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
  const visibleSteps = scenario.steps.slice(0, stepIdx+1);
  const activeAgentIds = useMemo(()=>{
    // last few steps' active agents
    const set = new Set();
    visibleSteps.slice(-3).forEach(s=>{ set.add(s.from); set.add(s.to); });
    return set;
  },[stepIdx, scenario.id]);

  // hot cells on the array grid (representing problem areas)
  const hotCells = useMemo(()=>{
    return [16, 17, 28, 29, 64, 76, 88]; // arbitrary hot cells for scenario
  },[plant.id]);

  // animated edge: last step connection
  const fromPos = cur ? NODE_POS[cur.from] : null;
  const toPos = cur ? NODE_POS[cur.to] : null;

  return (
    <div className="scene-stage">
      {/* central plant graphic (PV array) */}
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
          PV-ARRAY · 12×8 · {plant.short}
        </div>
        <div style={{position:'absolute',right:8,bottom:8,fontSize:10,color:'var(--text-mute)',fontFamily:'var(--font-mono)',letterSpacing:'0.08em'}}>
          INV-{plant.id.toUpperCase()}-{['A','B','C','D'][plant.id.charCodeAt(1)%4]}
        </div>
      </div>

      {/* edge lines between agents */}
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
        {/* faded backbone lines */}
        {Object.keys(NODE_POS).filter(k=>k!=='plant').map(k=>{
          const p = NODE_POS[k];
          return <line key={'bb-'+k} x1={p.x} y1={p.y} x2={50} y2={50}
                       stroke="rgba(120,160,220,0.06)" strokeWidth="0.15" strokeDasharray="0.6 1" vectorEffect="non-scaling-stroke"/>;
        })}
        {/* active step edge */}
        {fromPos && toPos && cur.from !== cur.to && (
          <g>
            <line x1={fromPos.x} y1={fromPos.y} x2={toPos.x} y2={toPos.y}
                  stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="1.2 0.8" opacity="0.85" vectorEffect="non-scaling-stroke">
              <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="0.6s" repeatCount="indefinite"/>
            </line>
            {/* travelling pulse */}
            <circle r="0.7" fill="#22d3ee" filter="drop-shadow(0 0 6px #22d3ee)">
              <animateMotion dur="1.4s" repeatCount="indefinite"
                path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}/>
            </circle>
          </g>
        )}
      </svg>

      {/* agent nodes around the perimeter */}
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
            <div className="lbl">{pos.lbl}</div>
          </div>
        );
      })}

      {/* current step bubble */}
      {cur && toPos && (
        <div className="scene-bubble" key={stepIdx}
             style={{left: toPos.x+'%', top: (toPos.y - 5)+'%'}}>
          <span className="tag">{cur.tag} · {_D_ABI[cur.from]?.short || (cur.from==='plant'?'电站':cur.from==='field'?'现场':cur.from==='drone'?'无人机':cur.from)} → {_D_ABI[cur.to]?.short || (cur.to==='plant'?'电站':cur.to==='field'?'现场':cur.to==='drone'?'无人机':cur.to)}</span>
          {cur.text}
        </div>
      )}

      {/* scenario log */}
      <SceneLog scenario={scenario} steps={visibleSteps}/>

      {/* token strip */}
      <TokenStrip plant={plant} stepIdx={stepIdx}/>

      {/* legend */}
      <div className="legend">
        <span><i style={{background:'#34d399'}}/>正常</span>
        <span><i style={{background:'#fbbf24'}}/>预警</span>
        <span><i style={{background:'#f87171'}}/>故障</span>
        <span><i style={{background:'#22d3ee'}}/>处置中</span>
      </div>
    </div>
  );
}

function SceneLog({scenario, steps}){
  const ref = useRef(null);
  useEffect(()=>{
    if(ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  },[steps.length]);
  return (
    <div className="scene-log">
      <h4>
        <span>多 Agent 协同日志</span>
        <span className="badge">{scenario.id} · {steps.length}/{scenario.steps.length}</span>
      </h4>
      <div className="body" ref={ref}>
        {steps.map((s,i)=>{
          const from = _D_ABI[s.from];
          const to = _D_ABI[s.to];
          const fromName = from?.short || ({plant:'电站',field:'现场',drone:'无人机'}[s.from] || s.from);
          const toName = to?.short || ({plant:'电站',field:'现场',drone:'无人机'}[s.to] || s.to);
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
  // computed token totals & sparkline
  const base = 24800;
  const used = base + stepIdx * 1240 + Math.floor(Math.sin(stepIdx)*120);
  const spark = useMemo(()=>Array.from({length:32}).map((_,i)=>0.3+0.6*Math.abs(Math.sin(i*0.6+plant.id.length))*(0.6+0.4*Math.random())),[plant.id]);
  return (
    <div className="token-strip">
      <h4>Token · 实时消耗</h4>
      <div className="big mono">{(used/1000).toFixed(2)}<small>K · 今日</small></div>
      <div className="row"><span>强度 / MW</span><span>{(used/plant.capacity).toFixed(0)}</span></div>
      <div className="row"><span>调用 / min</span><span>{(8 + stepIdx*0.6).toFixed(1)}</span></div>
      <div className="row"><span>成功率</span><span style={{color:'var(--emerald)'}}>98.6%</span></div>
      <svg viewBox="0 0 220 30" className="spark">
        <polyline fill="none" stroke="#22d3ee" strokeWidth="1.2"
          points={spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')}/>
        <polyline fill="rgba(34,211,238,0.12)" stroke="none"
          points={`0,30 ${spark.map((v,i)=>`${i*(220/(spark.length-1))},${30-v*22}`).join(' ')} 220,30`}/>
      </svg>
    </div>
  );
}

window.IRUN_DETAIL = { PlantDetail };
