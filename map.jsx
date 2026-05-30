// iRun Workbench — full-screen plants map (background, behind UI)
// IMPORTANT: do not cache `window.IRUN.PLANTS` at module load time.
// App can replace plant names from API after page load.

function PlantsMap({focusId, onFocus, plants}){
  const list = plants || window.IRUN?.PLANTS || [];
  return (
    <div className="map-wrap">
      <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="plant-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5"/>
            <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="plant-glow-warn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45"/>
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="plant-glow-bad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.5"/>
            <stop offset="60%" stopColor="#f87171" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
          </radialGradient>
          <pattern id="hexgrid" width="6" height="5.2" patternUnits="userSpaceOnUse">
            <path d="M3 0 L6 1.5 L6 4 L3 5.2 L0 4 L0 1.5 Z" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.08"/>
          </pattern>
        </defs>

        {/* faint hex pattern */}
        <rect width="100" height="100" fill="url(#hexgrid)"/>

        {/* stylized landmass — abstract SE-Asia / southern China outline */}
        <path d="M22 28 Q34 22 46 30 T70 32 Q82 30 90 42 Q88 56 82 64 Q74 70 64 68 Q58 78 50 82 Q40 80 32 72 Q22 64 22 52 Q20 40 22 28 Z"
              fill="rgba(34,211,238,0.025)" stroke="rgba(34,211,238,0.18)" strokeWidth="0.12" strokeDasharray="0.4 0.6"/>
        <path d="M70 72 Q78 76 86 78 Q90 80 92 84" fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="0.12" strokeDasharray="0.3 0.5"/>
        <path d="M78 58 Q86 62 92 70" fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="0.1" strokeDasharray="0.3 0.5"/>

        {/* islands */}
        <ellipse cx="86" cy="56" rx="3.6" ry="2.3" fill="rgba(34,211,238,0.04)" stroke="rgba(34,211,238,0.18)" strokeWidth="0.12"/>
        <ellipse cx="84" cy="74" rx="5.5" ry="2.8" fill="rgba(34,211,238,0.04)" stroke="rgba(34,211,238,0.18)" strokeWidth="0.12"/>
        <ellipse cx="74" cy="80" rx="3" ry="1.8" fill="rgba(34,211,238,0.04)" stroke="rgba(34,211,238,0.18)" strokeWidth="0.12"/>

        {/* connections between same-tenant plants */}
        {list.map((p,i)=> list.slice(i+1).map((q,j)=>{
          if(p.tenant !== q.tenant) return null;
          return <line key={p.id+q.id}
            x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke="rgba(34,211,238,0.12)" strokeWidth="0.1" strokeDasharray="0.4 0.6"/>;
        }))}

        {/* plant markers */}
        {list.map(p=>{
          const focus = p.id===focusId;
          const glow = p.risk==='high'?'url(#plant-glow-bad)': p.risk==='mid'?'url(#plant-glow-warn)':'url(#plant-glow)';
          const colour = p.risk==='high'?'#f87171': p.risk==='mid'?'#fbbf24':'#22d3ee';
          const labelLeft = p.x > 60;
          const lblX = labelLeft ? p.x - 5.4 : p.x + 5.4;
          const tickX1 = labelLeft ? p.x - 0.9 : p.x + 0.9;
          const tickX2 = labelLeft ? p.x - 5 : p.x + 5;
          const anchor = labelLeft ? 'end' : 'start';
          return (
            <g key={p.id} className="plant-node" onClick={()=>onFocus(p.id)}>
              <circle cx={p.x} cy={p.y} r="3" fill={glow}/>
              <circle cx={p.x} cy={p.y} r="1.2" className="plant-ring" style={{color:colour}}/>
              <circle cx={p.x} cy={p.y} r="1.7" className="plant-ring r2 plant-pulse" style={{color:colour}}/>
              <circle cx={p.x} cy={p.y} r="2.3" className="plant-ring r3" style={{color:colour}}/>
              {focus && <circle cx={p.x} cy={p.y} r="2.8" fill="none" stroke="#22d3ee" strokeWidth="0.18" strokeDasharray="0.6 0.4"/>}
              <circle cx={p.x} cy={p.y} r="0.45" fill={colour}/>
              <line x1={tickX1} y1={p.y} x2={tickX2} y2={p.y} stroke={colour} strokeWidth="0.1" strokeDasharray="0.3 0.3"/>
              <text className="plant-label" x={lblX} y={p.y-0.4} textAnchor={anchor} style={{fontSize:1.3}}>{p.name}</text>
              <text className="plant-sub" x={lblX} y={p.y+1.1} textAnchor={anchor} style={{fontSize:0.95, fill:'rgba(220,235,255,0.85)'}}>{p.region} · {p.capacity}MW</text>
              <text className="plant-sub" x={lblX} y={p.y+2.2} textAnchor={anchor} style={{fontSize:0.9, fill: p.alerts>0?'#fbbf24':'rgba(200,220,255,0.75)'}}>
                {p.status} · 告警 {p.alerts}
              </text>
            </g>
          );
        })}

        {/* coords label */}
        <text x="2" y="98" style={{fontSize:1.2, fill:'rgba(140,160,200,0.4)', fontFamily:'JetBrains Mono'}}>
          MAP · SE-ASIA / SOUTH-CN · 1:25M
        </text>
        <text x="98" y="98" textAnchor="end" style={{fontSize:1.2, fill:'rgba(140,160,200,0.4)', fontFamily:'JetBrains Mono'}}>
          PLANTS · {list.length} SITES · LIVE
        </text>
      </svg>
    </div>
  );
}

// Map2Overlay — floating plant pins for map2 (city background) mode
// Each plant carries its own mapX / mapY (% of canvas) in data.js,
// so we just filter by current tenant and render in place.
function Map2Overlay({ focusId, onFocus, subMode, tenantId, plants }) {
  const zh = React.useContext(window.IRUN_UI?.LangCtx || React.createContext('zh')) !== 'en';
  const list = plants || window.IRUN?.PLANTS || [];
  const visible = list.filter(p => (!tenantId || p.tenant === tenantId) && p.mapX && p.mapY);
  return (
    <div className="map2-overlay">
      {(subMode === 'show' || subMode === 'pic1' || subMode === 'pic2') && (
        <>
          <div className="patrol-robot patrol-robot-1" aria-hidden="true">
            <div className="patrol-robot-sprite"/>
            <div className="patrol-robot-shadow"/>
          </div>
          <div className="patrol-robot patrol-robot-2" aria-hidden="true">
            <div className="patrol-robot-sprite"/>
            <div className="patrol-robot-shadow"/>
          </div>
          <div className="patrol-robot patrol-robot-3" aria-hidden="true">
            <div className="patrol-robot-sprite"/>
            <div className="patrol-robot-shadow"/>
          </div>
        </>
      )}
      {visible.map((plant, i) => {
        let colour = '#22d3ee';
        let statusLabel = (zh?'✓ 正常':'✓ Normal')
        if(plant?.alarmStatus==='alarm'){
          colour = '#fbbf24'
          statusLabel = (zh?'△ 关注':'△ Watch')
        }
        if(plant?.tags?.includes('KPI_SEVERE')){
          colour = '#f87171'
          statusLabel = (zh?'⚠ 高风险':'⚠ High')
        }
        const fullName = zh ? plant.name : (plant.enName || plant.name);
        const pinName = (fullName.split('·').pop() || plant.short).trim();
        return (
          <div
            key={plant.id}
            className={`map2-pin${focusId===plant.id ? ' active' : ''}`}
            style={{
              left: plant.mapX, top: plant.mapY,
              '--pin-color': colour,
              animationDelay: `${i * 0.45}s`
            }}
            onClick={() => onFocus(plant.id, plant)}
          >
            <div className="map2-pin-label">
              <span className="map2-pin-name">{pinName}</span>
              <span className="map2-pin-meta">{plant.power}kW · {statusLabel}</span>
            </div>
            <div className="map2-pin-line"/>
            <div className="map2-pin-dot">
              <div className="map2-pin-ring"/>
              <div className="map2-pin-ring2"/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.IRUN_MAP = { PlantsMap, Map2Overlay };
