// iRun Workbench — 3D PV station scene (model / day / night modes)
// Uses Three.js UMD (window.THREE)

function Scene3D({mode}){
  const containerRef = React.useRef(null);
  const stateRef = React.useRef({});

  React.useEffect(()=>{
    const THREE = window.THREE;
    if(!THREE || !containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth, h = container.clientHeight;

    // --- scene/camera/renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030a1a, 0.012);

    const camera = new THREE.PerspectiveCamera(42, w/h, 0.1, 600);
    camera.position.set(46, 32, 54);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- lights (will be tuned per mode)
    const ambLight = new THREE.AmbientLight(0x3a5a8c, 0.4);
    scene.add(ambLight);
    const hemiLight = new THREE.HemisphereLight(0x6688cc, 0x0a1830, 0.5);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0x88bbff, 0.8);
    keyLight.position.set(28, 40, 18);
    scene.add(keyLight);

    // --- ground
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050d1c, roughness: 0.7, metalness: 0.35
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 100), groundMat);
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);

    // --- cyan grid
    const grid = new THREE.GridHelper(140, 70, 0x5ad1ff, 0x1a3550);
    grid.material.transparent = true;
    grid.material.opacity = 0.42;
    grid.position.y = 0.02;
    scene.add(grid);

    // --- PV array (rows of tilted panels)
    const pvGroup = new THREE.Group();
    const panelGeo = new THREE.BoxGeometry(8, 0.15, 3);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x0b2a5c, roughness: 0.25, metalness: 0.7,
      emissive: 0x0a1a3a, emissiveIntensity: 0.6
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a44, roughness: 0.5, metalness: 0.6,
      emissive: 0x2a4060, emissiveIntensity: 0.5
    });
    for(let r=0; r<5; r++){
      for(let c=0; c<6; c++){
        const grp = new THREE.Group();
        // panel
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.y = 1.2;
        panel.rotation.x = -0.32;
        grp.add(panel);
        // legs/frame (thin box under)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), frameMat);
        frame.position.set(0, 0.6, 0);
        grp.add(frame);
        // edge glow
        const edges = new THREE.EdgesGeometry(panelGeo);
        const edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
          color: 0x5ad1ff, transparent: true, opacity: 0.55
        }));
        edgeLine.position.y = 1.2;
        edgeLine.rotation.x = -0.32;
        grp.add(edgeLine);

        grp.position.set(-26 + c*10, 0, -10 + r*5);
        pvGroup.add(grp);
      }
    }
    scene.add(pvGroup);

    // --- buildings (control room + factory + inverter station)
    function makeBuilding(w, h, d, x, z, opts={}){
      const grp = new THREE.Group();
      const wallMat = new THREE.MeshStandardMaterial({
        color: opts.wall || 0x16315c, roughness: 0.5, metalness: 0.55,
        emissive: 0x081830, emissiveIntensity: 0.4
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      body.position.y = h/2;
      grp.add(body);

      // windows (warm amber strips)
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xffb866, emissive: 0xffc966, emissiveIntensity: 1.2
      });
      const floors = Math.max(2, Math.floor(h/1.2));
      for(let i=1; i<=floors; i++){
        const y = (i/floors+0.1) * h * 0.9;
        if(y > h - 0.2) break;
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(w*1.005, 0.18, d*1.005), winMat
        );
        strip.position.y = y;
        grp.add(strip);
      }

      // edge outline
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
      const edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: opts.edge || 0x5ad1ff, transparent: true, opacity: 0.85
      }));
      edgeLine.position.y = h/2;
      grp.add(edgeLine);

      // glowing base ring
      const ringGeo = new THREE.RingGeometry(Math.max(w,d)*0.7, Math.max(w,d)*0.85, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: opts.ring || 0x5ad1ff, transparent: true, opacity: 0.45,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI/2;
      ring.position.y = 0.05;
      grp.add(ring);

      grp.position.set(x, 0, z);
      return grp;
    }

    scene.add(makeBuilding(8, 6, 12, 22, -12, {edge:0x5ad1ff})); // factory (only)

    // --- flowing energy line (curve)
    const flowMat = new THREE.LineBasicMaterial({color: 0x4adba2, transparent: true, opacity: 0.85});
    const flowPts = [
      new THREE.Vector3(-28, 0.2, 12),
      new THREE.Vector3(-15, 0.2, 8),
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(15, 0.2, -6),
      new THREE.Vector3(22, 0.2, -12),
    ];
    const flowCurve = new THREE.CatmullRomCurve3(flowPts);
    const flowGeo = new THREE.BufferGeometry().setFromPoints(flowCurve.getPoints(60));
    const flowLine = new THREE.Line(flowGeo, flowMat);
    scene.add(flowLine);

    // moving pulse spheres along the curve
    const pulseGroup = new THREE.Group();
    const pulses = [];
    for(let i=0; i<4; i++){
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 12),
        new THREE.MeshBasicMaterial({color: 0x4adba2})
      );
      pulses.push({mesh:m, offset:i*0.25});
      pulseGroup.add(m);
    }
    scene.add(pulseGroup);

    // --- hovering drones (cyan glowing diamonds above PV)
    const dronesGroup = new THREE.Group();
    const drones = [];
    const dronePositions = [
      {x:-10, z:-6}, {x:10, z:2}, {x:0, z:8}
    ];
    dronePositions.forEach((p,i)=>{
      const grp = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.6, 0),
        new THREE.MeshStandardMaterial({
          color: 0x5ad1ff, emissive: 0x5ad1ff, emissiveIntensity: 1.6,
          roughness: 0.2, metalness: 0.8
        })
      );
      grp.add(body);
      // beam (vertical line to ground)
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 5, 6),
        new THREE.MeshBasicMaterial({color: 0x5ad1ff, transparent:true, opacity:0.35})
      );
      beam.position.y = -2.5;
      grp.add(beam);
      grp.position.set(p.x, 6, p.z);
      dronesGroup.add(grp);
      drones.push({grp, base:{x:p.x, z:p.z}, phase:i*1.7});
    });
    scene.add(dronesGroup);

    // --- glowing ground accent rings (energy zones)
    const zonesGroup = new THREE.Group();
    [{x:0, z:0, r:18, c:0x5ad1ff}, {x:22, z:-4, r:10, c:0x4adba2}].forEach(z=>{
      for(let i=0; i<2; i++){
        const ringGeo = new THREE.RingGeometry(z.r-0.1-i*0.3, z.r+0.05-i*0.3, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: z.c, transparent:true, opacity:0.28 - i*0.1, side:THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI/2;
        ring.position.set(z.x, 0.04, z.z);
        zonesGroup.add(ring);
      }
    });
    scene.add(zonesGroup);

    // --- particles flow (small dots floating up)
    const particleCount = 80;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount*3);
    const partSeed = [];
    for(let i=0; i<particleCount; i++){
      const x = (Math.random()-0.5)*40;
      const y = Math.random()*8;
      const z = (Math.random()-0.5)*30;
      partPos[i*3]=x; partPos[i*3+1]=y; partPos[i*3+2]=z;
      partSeed.push({x, z, sy: Math.random()*8});
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x5ad1ff, size: 0.18, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // --- apply mode (lighting + colors)
    function applyMode(m){
      const fog = scene.fog;
      if(m === 'day'){
        ambLight.color.setHex(0xb3d4ff); ambLight.intensity = 0.7;
        hemiLight.color.setHex(0xcfe6ff); hemiLight.groundColor.setHex(0x2a4a6c); hemiLight.intensity = 0.85;
        keyLight.color.setHex(0xffe5b3); keyLight.intensity = 1.2;
        fog.color.setHex(0x6a8cb8); fog.density = 0.008;
        renderer.setClearColor(0x6a8cb8, 0.0);
        grid.material.opacity = 0.3;
        zonesGroup.visible = true;
        dronesGroup.visible = true;
      } else if(m === 'night'){
        ambLight.color.setHex(0x3a5a8c); ambLight.intensity = 0.32;
        hemiLight.color.setHex(0x4a6a9c); hemiLight.groundColor.setHex(0x0a1830); hemiLight.intensity = 0.4;
        keyLight.color.setHex(0x88bbff); keyLight.intensity = 0.5;
        fog.color.setHex(0x030a1a); fog.density = 0.018;
        renderer.setClearColor(0x030a1a, 0.0);
        grid.material.opacity = 0.55;
        zonesGroup.visible = true;
        dronesGroup.visible = true;
      } else { // model
        ambLight.color.setHex(0xaabbcc); ambLight.intensity = 0.55;
        hemiLight.color.setHex(0xbbccdd); hemiLight.groundColor.setHex(0x445566); hemiLight.intensity = 0.7;
        keyLight.color.setHex(0xffffff); keyLight.intensity = 0.85;
        fog.color.setHex(0x1a2235); fog.density = 0.006;
        renderer.setClearColor(0x1a2235, 0.0);
        grid.material.opacity = 0.18;
        zonesGroup.visible = false;
        dronesGroup.visible = false;
      }
    }
    applyMode(mode);

    // --- animate
    let raf, t0 = performance.now();
    const cameraOrbit = {angle: 0.7, radius: 70, height: 32};
    function animate(){
      const t = (performance.now() - t0) / 1000;

      // slow camera orbit
      cameraOrbit.angle += 0.0008;
      camera.position.x = Math.cos(cameraOrbit.angle) * cameraOrbit.radius;
      camera.position.z = Math.sin(cameraOrbit.angle) * cameraOrbit.radius;
      camera.position.y = cameraOrbit.height + Math.sin(t*0.3)*1.5;
      camera.lookAt(0, 2, 0);

      // pulse spheres along curve
      pulses.forEach(p=>{
        const u = ((t*0.12) + p.offset) % 1;
        const pos = flowCurve.getPoint(u);
        p.mesh.position.copy(pos);
        p.mesh.position.y += 0.4 + Math.sin(t*4 + p.offset*6)*0.05;
        const s = 0.7 + Math.sin(t*3 + p.offset*5)*0.3;
        p.mesh.scale.set(s,s,s);
      });

      // drones bobbing
      drones.forEach(d=>{
        d.grp.position.x = d.base.x + Math.sin(t*0.6 + d.phase)*1.5;
        d.grp.position.z = d.base.z + Math.cos(t*0.5 + d.phase)*1.2;
        d.grp.position.y = 6 + Math.sin(t*1.4 + d.phase)*0.4;
        d.grp.rotation.y += 0.015;
      });

      // particles rise
      const pos = particles.geometry.attributes.position.array;
      for(let i=0; i<particleCount; i++){
        pos[i*3+1] += 0.04;
        if(pos[i*3+1] > 10){
          pos[i*3+1] = 0;
          pos[i*3]   = (Math.random()-0.5)*40;
          pos[i*3+2] = (Math.random()-0.5)*30;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // zone rings pulse
      zonesGroup.children.forEach((r,i)=>{
        r.material.opacity = (0.18 + Math.sin(t*1.5 + i*0.5)*0.1);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    // --- resize
    function onResize(){
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // expose apply for mode changes
    stateRef.current = {scene, camera, renderer, applyMode, container, onResize, raf:()=>raf};

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []); // initialize once

  // react to mode prop changes
  React.useEffect(()=>{
    if(stateRef.current && stateRef.current.applyMode){
      stateRef.current.applyMode(mode);
    }
  }, [mode]);

  const modeLabel = mode==='day'?'日间模式':mode==='night'?'夜间模式':'模型模式';

  return (
    <div className="scene-3d" ref={containerRef}>
      <div className="scene-3d-overlay"/>
      <div className="scene-label">
        光伏电站
        <small>清洁能源 · 数字孪生</small>
      </div>
      <div className="scene-mode-tag">VIEW · <b>{modeLabel}</b></div>
    </div>
  );
}

window.IRUN_SCENE3D = { Scene3D };
