// iRun Workbench — App root
const { useState: _aUseState, useEffect: _aUseEffect, useCallback: _aUseCallback } = React;
const useState = _aUseState, useEffect = _aUseEffect, useCallback = _aUseCallback;
const { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, MiniMap, QuickFuncs, AgentModal, AgentsRail, ModeStrip } = window.IRUN_UI;
const { PlantsMap } = window.IRUN_MAP;
const { PlantDetail } = window.IRUN_DETAIL;
const { Scene3D } = window.IRUN_SCENE3D;
const { PLANTS: APP_PLANTS, TENANTS: APP_TENANTS, AGENTS: APP_AGENTS, AGENT_BY_ID: APP_ABI } = window.IRUN;

function App(){
  const [focusId, setFocusId] = useState(null);
  const [openAgent, setOpenAgent] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [dispatchCollapsed, setDispatchCollapsed] = useState(()=>{
    try { return localStorage.getItem('irun:dispatch-collapsed') === '1'; } catch(e){ return false; }
  });
  const toggleDispatch = (next) => {
    const v = typeof next === 'boolean' ? next : !dispatchCollapsed;
    setDispatchCollapsed(v);
    try { localStorage.setItem('irun:dispatch-collapsed', v?'1':'0'); } catch(e){}
  };
  const [streamCollapsed, setStreamCollapsed] = useState(()=>{
    try {
      const v = localStorage.getItem('irun:stream-collapsed');
      return v === null ? true : v === '1';   // default: collapsed
    } catch(e){ return true; }
  });
  const toggleStream = (next) => {
    const v = typeof next === 'boolean' ? next : !streamCollapsed;
    setStreamCollapsed(v);
    try { localStorage.setItem('irun:stream-collapsed', v?'1':'0'); } catch(e){}
  };
  const [tenantIdx, setTenantIdx] = useState(0);
  const tenant = APP_TENANTS[tenantIdx];
  const [viewMode, setViewMode] = useState('map'); // map | model | day | night

  // Scenario state when a plant is open
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mode, setMode] = useState('auto');
  const [busyMap, setBusyMap] = useState({});
  const [scenarioEvents, setScenarioEvents] = useState([]);

  // Fit-to-viewport scaling
  useEffect(()=>{
    const apply = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      const s = Math.min(sx, sy);
      const tx = (window.innerWidth - 1920*s) / 2;
      const ty = (window.innerHeight - 1080*s) / 2;
      const wb = document.querySelector('.workbench');
      if (wb){
        wb.style.setProperty('--wb-scale', s);
        wb.style.setProperty('--wb-tx', tx/s + 'px');
        wb.style.setProperty('--wb-ty', ty/s + 'px');
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return ()=>window.removeEventListener('resize', apply);
  },[]);

  const focusPlant = focusId ? APP_PLANTS.find(p=>p.id===focusId) : null;

  // When scenario step fires, mark from/to as busy and emit an event into the global stream
  const onStep = useCallback((step, idx, scenario) => {
    const m = {};
    if (APP_ABI[step.from]) m[step.from] = true;
    if (APP_ABI[step.to])   m[step.to]   = true;
    setBusyMap(m);
    // emit to global stream
    if (APP_ABI[step.from] || APP_ABI[step.to]) {
      const agent = APP_ABI[step.from] ? step.from : step.to;
      setScenarioEvents(prev => [...prev.slice(-20), {
        id: `sc-${scenario.id}-${idx}-${Date.now()}`,
        t: Date.now(),
        agent,
        text: `${focusPlant?.short || ''} · ${step.text}`,
        sev: step.type==='action' ? 'mid' : (step.tag==='安全'?'high':'low'),
        plantId: focusPlant?.id,
      }]);
    }
  }, [focusPlant?.id, focusPlant?.short]);

  // Reset scenario state when leaving plant
  useEffect(()=>{
    if (!focusPlant) {
      setBusyMap({});
      setMode('auto');
      setScenarioIdx(0);
    }
  }, [focusPlant?.id]);

  // ESC to close
  useEffect(()=>{
    const onKey = e => {
      if(e.key==='Escape'){
        if(openAgent) setOpenAgent(null);
        else if(focusId) setFocusId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[openAgent, focusId]);

  const totalTokens = APP_AGENTS.reduce((s,a)=>s + parseFloat(a.metrics.tokens)*1000, 0);
  const busyCount = Object.values(busyMap).filter(Boolean).length || 3;

  return (
    <div className="workbench">
      {/* background scene */}
      <div className="scene">
        <div className="grid-bg"/>
        <div className="scan"/>
        <div className="vignette"/>
      </div>

      {/* full-screen plants map OR 3D scene */}
      {viewMode === 'map'
        ? <PlantsMap focusId={focusId} onFocus={setFocusId}/>
        : <Scene3D mode={viewMode}/>}

      {/* view mode strip (always visible, left edge) */}
      <ModeStrip mode={viewMode} onChange={setViewMode}/>

      {/* top KPIs */}
      <TopBar focusPlant={focusPlant} tenant={tenant} tenantIdx={tenantIdx} onTenant={setTenantIdx} onBack={()=>setFocusId(null)}/>

      {/* left + right rails over map */}
      <div className="stage">
        <div className={`left-rail ${streamCollapsed?'collapsed':''}`}>
          {streamCollapsed
            ? <EventStreamTab onExpand={()=>toggleStream(false)} count={scenarioEvents.length}/>
            : <EventStream focusPlant={focusPlant} scenarioEvents={scenarioEvents} onCollapse={()=>toggleStream(true)}/>
          }
        </div>
        <div className="center-stretch"/>
        <div className={`right-rail ${dispatchCollapsed?'collapsed':''}`}>
          {dispatchCollapsed
            ? <DispatchTab onExpand={()=>toggleDispatch(false)}/>
            : <DispatchPanel focusPlant={focusPlant} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} onOpenAgent={setOpenAgent} onCollapse={()=>toggleDispatch(true)}/>
          }
        </div>
      </div>

      {/* far-right vertical agents rail */}
      <AgentsRail
        focusPlant={focusPlant}
        busyMap={busyMap}
        selected={selectedAgent}
        onSelect={setSelectedAgent}
        onOpen={setOpenAgent}/>

      {/* status strip */}
      <div className="status-strip">
        <span>SESSION · <b>{tenant.id.toUpperCase()}-LIVE-{Date.now().toString(36).slice(-5).toUpperCase()}</b></span>
        <span>NODE · <b>iRun-Cluster-03</b></span>
        <span>SYNC · <b>稳定</b></span>
        <span>LATENCY · <b>132ms</b></span>
      </div>

      {/* dock */}
      <div className="dock">
        <MiniMap focusPlant={focusPlant} onFocus={setFocusId}/>
        <AgentDock focusPlant={focusPlant} busyMap={busyMap} onOpen={setOpenAgent}/>
        <QuickFuncs focusPlant={focusPlant} totalTokens={totalTokens} busyCount={busyCount}/>
      </div>

      {/* plant detail overlay (auto-cycle scenarios) */}
      {focusPlant && (
        <PlantDetail
          plant={focusPlant}
          scenarioIdx={scenarioIdx}
          mode={mode}
          onModeChange={setMode}
          onScenarioChange={setScenarioIdx}
          onStep={onStep}
          onClose={()=>setFocusId(null)}/>
      )}

      {/* agent modal */}
      {openAgent && <AgentModal agentId={openAgent} onClose={()=>setOpenAgent(null)} busyMap={busyMap}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
