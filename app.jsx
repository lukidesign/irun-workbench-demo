// iRun Workbench — App root
const { useState: _aUseState, useEffect: _aUseEffect, useCallback: _aUseCallback } = React;
const useState = _aUseState, useEffect = _aUseEffect, useCallback = _aUseCallback;
const { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, AgentTokenPanel, MiniMap, QuickFuncs, AgentModal, AgentsRail, ModeStrip, SkillModal, PlantTitle, DroneFlight, PlantRobot, LangCtx } = window.IRUN_UI;
const { PlantsMap, Map2Overlay } = window.IRUN_MAP;
const { PlantDetail, PlantInlineDock, useScenarioStepping } = window.IRUN_DETAIL;
const { Scene3D } = window.IRUN_SCENE3D;
const { PLANTS: APP_PLANTS, TENANTS: APP_TENANTS, AGENTS: APP_AGENTS, AGENT_BY_ID: APP_ABI, aggregateOf: APP_AGG_OF } = window.IRUN;

function App(){
  const [focusId, setFocusId] = useState(null);
  const [openAgent, setOpenAgent] = useState(null);
  const [openSkillMarket, setOpenSkillMarket] = useState(false);
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
  const [viewMode, setViewMode] = useState('map2'); // map2 | img2
  const [map2SubMode, setMap2SubMode] = useState('show'); // show | roam
  // Switching tenant → drop focus & return to OVERVIEW
  const onTenantChange = useCallback((idx) => {
    setTenantIdx(idx);
    setFocusId(null);
    setViewMode(prev => prev === 'img2' ? 'map2' : prev);
  }, []);
  // Plants visible under the current tenant
  const tenantPlants = APP_PLANTS.filter(p => p.tenant === tenant.id);
  const tenantAgg = APP_AGG_OF ? APP_AGG_OF(tenantPlants) : { plants: tenantPlants.length, capacity:0, power:0, gen:0, alerts:0, risk:0 };
  const [lang, setLang] = useState(()=>{ try{ return localStorage.getItem('irun:lang')||'zh'; }catch(e){ return 'zh'; } });
  const toggleLang = () => setLang(l => {
    const n = l==='zh'?'en':'zh';
    try{ localStorage.setItem('irun:lang', n); }catch(e){}
    return n;
  });

  // Scenario state when a plant is open
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mode, setMode] = useState('auto');
  const [busyMap, setBusyMap] = useState({});
  const [scenarioEvents, setScenarioEvents] = useState([]);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [droneFlying, setDroneFlying] = useState(false);

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

  // Reset scenario state when leaving plant (also drop back to map2 if we were in img2)
  useEffect(()=>{
    if (!focusPlant) {
      setBusyMap({});
      setMode('auto');
      setScenarioIdx(0);
      setShowPlantModal(false);
      if (viewMode === 'img2') setViewMode('map2');
    }
  }, [focusPlant?.id]);

  // Centralised scenario stepping — drives both PlantInlineDock and PlantDetail popup
  const { stepIdx, cur, scenario } = useScenarioStepping({
    scenarioIdx,
    plantId: focusPlant?.id,
    mode,
    onStep,
    onScenarioChange: setScenarioIdx,
  });

  // ESC to close
  useEffect(()=>{
    const onKey = e => {
      if(e.key==='Escape'){
        if(openAgent) setOpenAgent(null);
        else if(showPlantModal) setShowPlantModal(false);
        else if(focusId) setFocusId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[openAgent, focusId, showPlantModal]);

  const totalTokens = APP_AGENTS.reduce((s,a)=>s + parseFloat(a.metrics.tokens)*1000, 0);
  const busyCount = Object.values(busyMap).filter(Boolean).length || 3;

  return (
    <LangCtx.Provider value={lang}>
    <div className={`workbench${(viewMode==='img2' && focusPlant) ? ' img2-focused' : ''}`}>
      {/* background scene */}
      <div className="scene">
        <div className="grid-bg"/>
        <div className="scan"/>
        <div className="vignette"/>
      </div>

      {/* full-bleed image background (image modes + map2 展示) */}
      {(viewMode === 'img2') && (() => {
        const idx = focusPlant ? APP_PLANTS.findIndex(p=>p.id===focusPlant.id) : -1;
        const bg = idx >= 0
          ? `plant${String(idx+1).padStart(3,'0')}.png`
          : 'img2.jpg';
        return <div className="scene-img-bg" style={{backgroundImage:`url('${bg}')`}}/>;
      })()}
      {(viewMode === 'map2' && map2SubMode === 'show') && (
        <div className="scene-img-bg" style={{backgroundImage:`url('rjgf001.png')`}}/>
      )}
      {(viewMode === 'map2' && map2SubMode === 'pic1') && (
        <div className="scene-img-bg" style={{backgroundImage:`url('rjgf005.png')`}}/>
      )}
      {(viewMode === 'map2' && map2SubMode === 'pic2') && (
        <div className="scene-img-bg" style={{backgroundImage:`url('rjgf004.png')`}}/>
      )}
      {(viewMode === 'map2' && map2SubMode === 'pic3') && (
        <div className="scene-img-bg" style={{backgroundImage:`url('rjgf001qian.png')`}}/>
      )}
      {/* map2 漫游 — video background */}
      {(viewMode === 'map2' && map2SubMode === 'roam') && (
        <video className="scene-video-bg" src="manyou001.mp4" autoPlay loop playsInline/>
      )}
      {(viewMode === 'map2' && map2SubMode === 'vid3') && (
        <video className="scene-video-bg" src="rjgf001qian.mp4" autoPlay loop playsInline/>
      )}

      {/* full-screen plants map / 3D scene */}
      {viewMode === 'map' && <PlantsMap focusId={focusId} onFocus={setFocusId}/>}
      {viewMode === 'map2' && <Map2Overlay focusId={focusId} onFocus={(id)=>{ setFocusId(id); setViewMode('img2'); }} subMode={map2SubMode} tenantId={tenant.id}/>}

      {/* map2 展示/漫游 toggle */}
      {viewMode === 'map2' && (
        <div className="map2-toggle">
          <button className={`map2-toggle-btn${map2SubMode==='pic1'?' active':''}`} onClick={()=>setMap2SubMode('pic1')}>{lang==='en'?'Img 1':'图1'}</button>
          <button className={`map2-toggle-btn${map2SubMode==='pic2'?' active':''}`} onClick={()=>setMap2SubMode('pic2')}>{lang==='en'?'Img 2':'图2'}</button>
          <button className={`map2-toggle-btn${map2SubMode==='pic3'?' active':''}`} onClick={()=>setMap2SubMode('pic3')}>{lang==='en'?'Img 3':'图3'}</button>
          <button className={`map2-toggle-btn${map2SubMode==='vid3'?' active':''}`} onClick={()=>setMap2SubMode('vid3')}>{lang==='en'?'Video 3':'视频3'}</button>
          <button className={`map2-toggle-btn${map2SubMode==='show'?' active':''}`} onClick={()=>setMap2SubMode('show')}>{lang==='en'?'View':'展示'}</button>
          <button className={`map2-toggle-btn${map2SubMode==='roam'?' active':''}`} onClick={()=>setMap2SubMode('roam')}>{lang==='en'?'Roam':'漫游'}</button>
        </div>
      )}
      {(viewMode === 'model' || viewMode === 'day' || viewMode === 'night') && <Scene3D mode={viewMode}/>}

      {/* top KPIs */}
      <TopBar focusPlant={focusPlant} plants={tenantPlants} agg={tenantAgg} onPlantChange={setFocusId} tenant={tenant} tenantIdx={tenantIdx} onTenant={onTenantChange} onBack={()=>setFocusId(null)} lang={lang} onLang={toggleLang}/>

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
        onSelect={(id)=>{ setSelectedAgent(id); if (id && dispatchCollapsed) toggleDispatch(false); }}
        onOpen={setOpenAgent}
        onSkillOpen={()=>setOpenSkillMarket(true)}
        onDroneFly={()=>setDroneFlying(true)}
        droneActive={droneFlying}
        tooltipEnabled={dispatchCollapsed}/>

      {/* drone fly overlay */}
      {droneFlying && <DroneFlight onDone={()=>setDroneFlying(false)}/>}

      {/* walking robot in img2 plant view */}
      {viewMode === 'img2' && focusPlant && <PlantRobot/>}


      {/* dock — img2+focusPlant shows inline plant dashboard, else agent token panel */}
      <div className="dock">
        {(viewMode === 'img2' && focusPlant)
          ? <PlantInlineDock
              plant={focusPlant}
              scenario={scenario}
              stepIdx={stepIdx}
              cur={cur}
              mode={mode}
              scenarioIdx={scenarioIdx}
              onModeChange={setMode}
              onScenarioChange={setScenarioIdx}
              onOpenModal={()=>setShowPlantModal(true)}/>
          : <AgentTokenPanel busyMap={busyMap} onOpen={setOpenAgent}/>}
      </div>

      {/* plant detail overlay — popup mode (click any inline card) or auto-open in non-img2 modes */}
      {focusPlant && (viewMode !== 'img2' || showPlantModal) && (
        <PlantDetail
          plant={focusPlant}
          scenario={scenario}
          stepIdx={stepIdx}
          cur={cur}
          mode={mode}
          scenarioIdx={scenarioIdx}
          onModeChange={setMode}
          onScenarioChange={setScenarioIdx}
          onClose={()=>{
            if(viewMode === 'img2') setShowPlantModal(false);
            else setFocusId(null);
          }}/>
      )}

      {/* agent modal */}
      {openAgent && <AgentModal agentId={openAgent} onClose={()=>setOpenAgent(null)} busyMap={busyMap}/>}

      {/* skill market modal */}
      {openSkillMarket && <SkillModal onClose={()=>setOpenSkillMarket(false)}/>}
    </div>
    </LangCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
