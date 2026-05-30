// iRun Workbench — App root
const { useState: _aUseState, useEffect: _aUseEffect, useCallback: _aUseCallback } = React;
const useState = _aUseState, useEffect = _aUseEffect, useCallback = _aUseCallback;
const { TopBar, EventStream, EventStreamTab, DispatchPanel, DispatchTab, AgentDock, AgentTokenPanel, MiniMap, QuickFuncs, AgentModal, AgentsRail, ModeStrip, SkillModal, PlantTitle, DroneFlight, PlantRobot, PlantAgentField, DispatchedRobots, OverviewDispatchRobot, LangCtx } = window.IRUN_UI;
const { PlantsMap, Map2Overlay } = window.IRUN_MAP;
const { PlantDetail, PlantInlineDock, useScenarioStepping } = window.IRUN_DETAIL;
const { Scene3D } = window.IRUN_SCENE3D;
const { PLANTS: APP_PLANTS, TENANTS: APP_TENANTS, AGENTS: APP_AGENTS, AGENT_BY_ID: APP_ABI, aggregateOf: APP_AGG_OF } = window.IRUN;
const isDispatchHiddenPlant = window.IRUN?.isDispatchHiddenPlant || (() => false);
const getDemoPlantProfile = (id) => window.IRUN?.getDemoPlantProfile?.(id) || null;

function App(){
  const [plants, setPlants] = useState(() => window.IRUN?.PLANTS || APP_PLANTS || []);
  const [focusId, setFocusId] = useState(null);
  const [dispatchPlantCtx, setDispatchPlantCtx] = useState(null); // { id, name }
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
  // dark theme: show | roam      ·  light theme: pic1 | pic2
  const [map2SubMode, setMap2SubMode] = useState(() => {
    try { return (localStorage.getItem('irun:theme') || 'light') === 'light' ? 'pic1' : 'show'; } catch(e) { return 'pic1'; }
  });
  // ── Overview dispatch robots (map2) ──────────────────────────────────
  // 每条 = { key, plantId, agentId, recall }。同时最多 1 个 active(recall=false)；
  // 旧的被换站/召回时置 recall=true → 组件播放原路返回动画后 onDone 移除自己。
  const [overviewBots, setOverviewBots] = useState([]);
  const recallAllBots = useCallback(() => {
    setOverviewBots(prev => prev.map(b => b.recall ? b : { ...b, recall: true }));
  }, []);
  // 派出 / 换站：识别到 @机器人 + 当前租户内电站名后由 DispatchPanel 调用
  const onDispatchToPlant = useCallback(({ plantId, agentId }) => {
    const plant = (window.IRUN?.PLANTS || []).find(p => p.id === plantId);
    if (!plant) return;
    if (plant.tenant !== tenant.id) return;        // 非当前租户 → 不出现机器人
    if (!plant.mapX || !plant.mapY) return;        // 无 pin 坐标 → 无终点
    setOverviewBots(prev => {
      const active = prev.find(b => !b.recall);
      if (active && active.plantId === plantId) return prev;  // 同站，不动
      const recalled = prev.map(b => b.recall ? b : { ...b, recall: true });  // 旧的原路返回
      const key = `ob-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
      return [...recalled, { key, plantId, agentId, recall: false }];
    });
  }, [tenant]);
  const onOverviewBotDone = useCallback((key) => {
    setOverviewBots(prev => prev.filter(b => b.key !== key));
  }, []);

  // Switching tenant → drop focus & return to OVERVIEW, recall any bot
  const onTenantChange = useCallback((idx) => {
    setTenantIdx(idx);
    setFocusId(null);
    setViewMode(prev => prev === 'img2' ? 'map2' : prev);
    recallAllBots();
  }, [recallAllBots]);
  // Plants visible under the current tenant
  const tenantPlants = plants.filter(p => p.tenant === tenant.id);
  const tenantAgg = APP_AGG_OF ? APP_AGG_OF(tenantPlants) : { plants: tenantPlants.length, capacity:0, power:0, gen:0, alerts:0, risk:0 };
  const [lang, setLang] = useState(()=>{ try{ return localStorage.getItem('irun:lang')||'zh'; }catch(e){ return 'zh'; } });
  const [theme, setTheme] = useState(()=>{ try{ return localStorage.getItem('irun:theme')||'light'; }catch(e){ return 'light'; } });
  const toggleTheme = () => setTheme(t => {
    const n = t==='light' ? 'dark' : 'light';
    try{ localStorage.setItem('irun:theme', n); }catch(e){}
    // sync map2 subMode to the valid set for the new theme
    setMap2SubMode(prev => {
      if (n === 'light') return (prev === 'pic1' || prev === 'pic2') ? prev : 'pic1';
      return (prev === 'show' || prev === 'roam') ? prev : 'show';
    });
    return n;
  });
  useEffect(() => {
    if (theme === 'dark' && selectedAgent && !['ops', 'warn', 'safe'].includes(selectedAgent)) {
      setSelectedAgent(null);
    }
  }, [theme, selectedAgent]);
  const toggleLang = () => setLang(l => {
    const n = l==='zh'?'en':'zh';
    try{ localStorage.setItem('irun:lang', n); }catch(e){}
    return n;
  });

  // Scenario state when a plant is open
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mode, setMode] = useState('auto');
  const [busyMap, setBusyMap] = useState({});
  const [droneFlying, setDroneFlying] = useState(false);
  // Command-mode dispatched robots: each = single walker spawned by Dispatch send
  const [dispatchedRobots, setDispatchedRobots] = useState([]);
  const onDispatchCommand = useCallback((agentId, text) => {
    const id = `dr-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setDispatchedRobots(prev => [...prev, { id, agentId, text }]);
  }, []);
  const onRobotDone = useCallback((id) => {
    setDispatchedRobots(prev => prev.filter(r => r.id !== id));
  }, []);
  // Clear robots + busyMap on mode switch / plant leave
  useEffect(()=>{
    if (mode === 'command') { setBusyMap({}); }
    if (mode !== 'command') setDispatchedRobots([]);
  },[mode]);

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

  const focusPlant = focusId ? plants.find(p=>p.id===focusId) : null;

  // Page load: fetch station list and override plant name/enName by id
  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      try{
        const {rows:list = []} = await window.IRUN_FETCH?.getPlantList?.();
        const nameById = new Map(
          list.map(x => [
            String(x.id),
            {
              ...x
            }
          ])
        );
        const norm = window.IRUN_FETCH?.normalizePlantApiFields;
        const next = (window.IRUN?.PLANTS || plants).map(p => {
          const item = nameById.get(String(p.id));
          if (!item) return p;
          const kpi = norm ? norm(item, p) : {
            installCapacity: Number(item.installCapacity ?? p.capacity ?? 0),
            power: Number(item.realTimePower ?? item.realTimePowerValue ?? p.power ?? 0),
            dayEnergy: Number(item.dayEnergy ?? item.dayEnergyValue ?? p.gen ?? 0),
          };
          return {
            ...p,
            ...item,
            name: item.name,
            enName: item.name,
            capacity: kpi.installCapacity || p.capacity,
            ...kpi,
          };
        });
        if (cancelled) return;
        setPlants(next);
        if (window.IRUN){
          window.IRUN.PLANTS = next;
          if (window.IRUN.aggregateOf) window.IRUN.AGGREGATE = window.IRUN.aggregateOf(next);
        }
      } catch(e){
        // keep demo data if request fails
        console.warn('getPlantList failed', e);
      }
    })();
    return ()=>{ cancelled = true; };
  }, []);

  // When scenario step fires, mark from/to as busy and emit an event into the global stream
  const onStep = useCallback((step, idx, scenario) => {
    if (!step) return;
    const m = {};
    if (step.from) m[step.from] = true;
    if (step.to)   m[step.to]   = true;
    setBusyMap(m);
  }, []);

  // Reset scenario state when leaving plant (also drop back to map2 if we were in img2)
  // When entering a new plant, honor its defaultScenarioIdx（演示站固定场景 A）
  useEffect(()=>{
    if (!focusPlant) {
      setBusyMap({});
      setMode('auto');
      setScenarioIdx(0);
      if (viewMode === 'img2') setViewMode('map2');
    } else {
      const demo = getDemoPlantProfile(focusPlant.id);
      if (demo) {
        setMode('auto');
        setScenarioIdx(demo.scenarioIdx);
      } else {
        setMode('command');
        const def = typeof focusPlant.defaultScenarioIdx === 'number' ? focusPlant.defaultScenarioIdx : 0;
        setScenarioIdx(def);
      }
    }
  }, [focusPlant?.id]);

  // 焦点电站切换：隐藏调度列表内电站默认关闭调度，其余电站默认打开
  useEffect(() => {
    if (!focusId) return;
    if (isDispatchHiddenPlant(focusId)) {
      setDispatchCollapsed(true);
      try { localStorage.setItem('irun:dispatch-collapsed', '1'); } catch (e) {}
      setStreamCollapsed(false);
      try { localStorage.setItem('irun:stream-collapsed', '0'); } catch (e) {}
    } else {
      setDispatchCollapsed(false);
      try { localStorage.setItem('irun:dispatch-collapsed', '0'); } catch (e) {}
      setStreamCollapsed(true);
      try { localStorage.setItem('irun:stream-collapsed', '1'); } catch (e) {}
    }
  }, [focusId]);

  const hideDispatchRail = isDispatchHiddenPlant(focusPlant?.id);
  const hideStreamRail = !!focusId && !isDispatchHiddenPlant(focusId);

  const handleModeChange = useCallback((next) => {
    const demo = getDemoPlantProfile(focusPlant?.id);
    if (demo && next === 'command') return;
    if (focusPlant?.id && !demo && next === 'auto') return;
    setMode(next);
  }, [focusPlant?.id]);

  const handleScenarioChange = useCallback((idx) => {
    if (getDemoPlantProfile(focusPlant?.id)) return;
    if (focusPlant?.id && !getDemoPlantProfile(focusPlant?.id)) return;
    setScenarioIdx(idx);
  }, [focusPlant?.id]);

  // Centralised scenario stepping — drives both PlantInlineDock and PlantDetail popup
  const { stepIdx, cur, scenario } = useScenarioStepping({
    scenarioIdx,
    plantId: focusPlant?.id,
    mode,
    onStep,
    onScenarioChange: handleScenarioChange,
  });

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
    <LangCtx.Provider value={lang}>
    <div className={`workbench theme-${theme}${(viewMode==='img2' && focusPlant) ? ' img2-focused' : ''}`}>
      {/* background scene */}
      <div className="scene">
        <div className="grid-bg"/>
        <div className="scan"/>
        <div className="vignette"/>
      </div>

      {/* full-bleed image background (image modes + map2 展示) */}
      {(viewMode === 'img2') && (() => {
        const idx = focusPlant ? plants.findIndex(p=>p.id===focusPlant.id) : -1;
        const suffix = theme === 'light' ? 'qian' : '';
        const bg = idx >= 0
          ? `plant${String(idx+1).padStart(3,'0')}${suffix}.png`
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
      {viewMode === 'map' && <PlantsMap plants={plants} focusId={focusId} onFocus={setFocusId}/>}
      {viewMode === 'map2' && (
        <Map2Overlay
          plants={plants}
          focusId={focusId}
          onFocus={(id, plant)=>{
            // 保存一份点击时的电站上下文，供调度输入框使用（怎么用由你决定）
            const p = plant || plants.find(x => x.id === id);
            const resetDispatchInput = dispatchCollapsed && !!selectedAgent;
            const bindPlantToQuestions = dispatchCollapsed && !isDispatchHiddenPlant(id);
            if (resetDispatchInput) setSelectedAgent(null);
            const clickKey = `${id}:${Date.now()}`;
            setDispatchPlantCtx(p
              ? { id: p.id, name: p.name, resetInput: resetDispatchInput, bindPlantToQuestions, clickKey }
              : { id, name: '', resetInput: resetDispatchInput, bindPlantToQuestions, clickKey });
            const hideDispatch = isDispatchHiddenPlant(id);
            if (!dispatchCollapsed) {
              setStreamCollapsed(true);
              try { localStorage.setItem('irun:stream-collapsed', '1'); } catch (e) {}
              return;
            }
            if (hideDispatch) toggleDispatch(true);
            else if (dispatchCollapsed) toggleDispatch(false);
            if (hideDispatch) toggleStream(false);
            else {
              setStreamCollapsed(true);
              try { localStorage.setItem('irun:stream-collapsed', '1'); } catch (e) {}
            }
            // dispatch 展开时：只做上面这一步，不改变 focusPlant（TopBar / 详情等保持不变）
            // 隐藏调度电站：仍进入 img2 焦点视图
            // dispatch 折叠时：保持原行为（更新焦点并进入 img2）
            setFocusId(id);
            setViewMode('img2');

            // 先把点击时的 plant 同步写入 plants，保证 focusPlant 立即拿到这份上下文
            if (p){
              setPlants(prev => {
                const next = prev.map(pp => String(pp.id) === String(id) ? ({ ...pp, ...p }) : pp);
                if (window.IRUN) window.IRUN.PLANTS = next;
                return next;
              });
            }

            // dispatch 折叠时：把点击的 plant 相关告警拉取回来，更新到 plants，
            // 这样 TopBar 的 focusPlant->k 会使用最新 alerts/alarmStatus 等字段
            (async ()=>{
              try{
                const alarmRes = await window.IRUN_FETCH?.getPlantAlarmList?.(p.id);
                const kpiRes = await window.IRUN_FETCH?.getPlantKpi?.(p.id);
                const norm = window.IRUN_FETCH?.normalizePlantApiFields;
                const kpiFields = norm && kpiRes ? norm(kpiRes, p) : null;
                setPlants(prev => {
                  const next = prev.map(pp => {
                    if (String(pp.id) !== String(id)) return pp;
                    return {
                      ...pp,
                      ...(kpiFields || {}),
                      alarmTotal: alarmRes.total,
                      alarmList: alarmRes?.rows,
                      pendingAlerts: alarmRes.total > 0 ? Math.floor(Math.random() * (alarmRes.total - 1)) + 1 : 0,
                      risk: kpiRes?.tags?.includes('KPI_SEVERE') || kpiRes?.tags?.includes('KPI_GENERAL') ? 1 : 0,
                      noiseReductionRate:Math.floor(Math.random() * 10) + 70
                    };
                  });
                  if (window.IRUN) window.IRUN.PLANTS = next;
                  return next;
                });
              }catch(e){
                console.warn('getPlantAlarmList failed', e);
              }
            })();
          }}
          subMode={map2SubMode}
          tenantId={tenant.id}
        />
      )}

      {/* overview dispatch robots — walk bottom-right → plant pin, park, then retrace */}
      {viewMode === 'map2' && overviewBots.map(b => {
        const plant = tenantPlants.find(p => p.id === b.plantId);
        if (!plant) return null;
        return <OverviewDispatchRobot key={b.key} botKey={b.key} plant={plant} recall={b.recall} onDone={onOverviewBotDone}/>;
      })}

      {/* map2 toggle — theme-aware:
            light → 图1 / 图2 (qian backgrounds)
            dark  → 展示 / 漫游 (rjgf001 + manyou001) */}
      {viewMode === 'map2' && (
        <div className="map2-toggle">
          {theme === 'light' ? null : (
            <>
              <button className={`map2-toggle-btn${map2SubMode==='show'?' active':''}`} onClick={()=>setMap2SubMode('show')}>{lang==='en'?'View':'展示'}</button>
              <button className={`map2-toggle-btn${map2SubMode==='roam'?' active':''}`} onClick={()=>setMap2SubMode('roam')}>{lang==='en'?'Roam':'漫游'}</button>
            </>
          )}
        </div>
      )}
      {(viewMode === 'model' || viewMode === 'day' || viewMode === 'night') && <Scene3D mode={viewMode}/>}

      {/* top KPIs */}
      <TopBar focusPlant={focusPlant} plants={tenantPlants} agg={tenantAgg} onPlantChange={setFocusId} tenant={tenant} tenantIdx={tenantIdx} onTenant={onTenantChange} onBack={()=>setFocusId(null)} lang={lang} onLang={toggleLang} theme={theme} onTheme={toggleTheme}/>

      {/* left + right rails over map */}
      <div className="stage">
        {!hideStreamRail && (
          <div className={`left-rail ${streamCollapsed?'collapsed':''}`}>
            {streamCollapsed
              ? <EventStreamTab onExpand={()=>toggleStream(false)}/>
              : <EventStream onCollapse={()=>toggleStream(true)}/>
            }
          </div>
        )}
        <div className="center-stretch"/>
        {!hideDispatchRail && (
          <div className={`right-rail ${dispatchCollapsed?'collapsed':''}`}>
            {dispatchCollapsed
              ? <DispatchTab onExpand={()=>toggleDispatch(false)}/>
              : <DispatchPanel focusPlant={focusPlant} dispatchPlantCtx={dispatchPlantCtx} selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} onClearDispatchPlantCtx={()=>setDispatchPlantCtx(null)} onOpenAgent={setOpenAgent} onCollapse={()=>toggleDispatch(true)} mode={mode} onDispatchCommand={onDispatchCommand} onDispatchToPlant={onDispatchToPlant} onRecallDispatch={recallAllBots}/>
            }
          </div>
        )}
      </div>

      {/* far-right vertical agents rail */}
      <AgentsRail
        focusPlant={focusPlant}
        busyMap={busyMap}
        selected={selectedAgent}
        theme={theme}
        onSelect={(id)=>{ setSelectedAgent(id); if (id && dispatchCollapsed && !hideDispatchRail) toggleDispatch(false); }}
        onOpen={setOpenAgent}
        onSkillOpen={()=>setOpenSkillMarket(true)}
        onDroneFly={()=>setDroneFlying(true)}
        droneActive={droneFlying}
        tooltipEnabled={dispatchCollapsed}/>

      {/* drone fly overlay */}
      {droneFlying && <DroneFlight onDone={()=>setDroneFlying(false)} plant={focusPlant}/>}

      {/* img2 plant view:
            - command mode → clear field, render any dispatched walking robots
            - auto mode + robotField → multi-agent robot field
            - else → single walking robot */}
      {viewMode === 'img2' && focusPlant && (
        mode === 'command'
          ? <DispatchedRobots robots={dispatchedRobots} onRobotDone={onRobotDone}/>
          : focusPlant.robotField
            ? <PlantAgentField plant={focusPlant} busyMap={busyMap} cur={cur}/>
            : <PlantRobot/>
      )}


      {/* dock — img2+focusPlant shows inline plant dashboard, else agent token panel */}
      <div className="dock">
        {(viewMode === 'img2' && focusPlant)
          ? <PlantInlineDock
              plant={focusPlant}
              scenario={scenario}
              stepIdx={stepIdx}
              cur={cur}
              busyMap={busyMap}
              mode={mode}
              scenarioIdx={scenarioIdx}
              onModeChange={handleModeChange}
              onScenarioChange={handleScenarioChange}/>
          : <AgentTokenPanel busyMap={busyMap} onOpen={setOpenAgent}/>}
      </div>

      {/* plant detail overlay — 非 img2/map2 视图；底部卡片点击不再弹出 */}
      {focusPlant && (viewMode !== 'img2') && (viewMode !== 'map2') && (
        <PlantDetail
          plant={focusPlant}
          scenario={scenario}
          stepIdx={stepIdx}
          cur={cur}
          mode={mode}
          scenarioIdx={scenarioIdx}
          onModeChange={handleModeChange}
          onScenarioChange={handleScenarioChange}
          onClose={()=>setFocusId(null)}/>
      )}

      {/* agent modal */}
      {openAgent && (
        <AgentModal
          agentId={openAgent}
          onClose={()=>setOpenAgent(null)}
          busyMap={busyMap}
          onChat={(id)=>{
            setSelectedAgent(id);
            if (id && dispatchCollapsed && !isDispatchHiddenPlant(focusPlant?.id)) toggleDispatch(false);
          }}
        />
      )}

      {/* skill market modal */}
      {openSkillMarket && <SkillModal onClose={()=>setOpenSkillMarket(false)}/>}
    </div>
    </LangCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
