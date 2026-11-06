document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
            if(btn.dataset.target === 'airports' && !airportRendered) renderAirportList();
        });
    });

    // --- 2. Airports Module ---
    let airportRendered = false;
    const airportListEl = document.getElementById('airport-list');
    const airportDetailEl = document.getElementById('airport-detail-panel');
    const searchBox = document.getElementById('airport-search');

    function renderAirportList(filterText = '') {
        airportListEl.innerHTML = '';
        dbAirports.forEach((apt, index) => {
            if(apt.name.includes(filterText) || apt.icao.toLowerCase().includes(filterText) || apt.iata.toLowerCase().includes(filterText)) {
                const li = document.createElement('li');
                li.innerHTML = `<div class="item-title">${apt.icao} / ${apt.iata}</div><div class="item-sub">${apt.name}</div>`;
                li.addEventListener('click', () => {
                    document.querySelectorAll('#airport-list li').forEach(el => el.classList.remove('selected'));
                    li.classList.add('selected');
                    showAirportDetail(apt);
                });
                airportListEl.appendChild(li);
            }
        });
        airportRendered = true;
    }

    searchBox.addEventListener('input', (e) => renderAirportList(e.target.value.toLowerCase()));

    function showAirportDetail(apt) {
        let runwaysHtml = apt.runways.map(rw => `<tr><td>${rw.id}</td><td>${rw.len}</td></tr>`).join('');
        airportDetailEl.innerHTML = `
            <h3>${apt.nameEn} <span class="cn-title">${apt.name}</span></h3>
            <div class="spec-grid">
                <div class="spec-item"><span class="spec-label">ICAO Code:</span><span class="spec-val">${apt.icao}</span></div>
                <div class="spec-item"><span class="spec-label">IATA Code:</span><span class="spec-val">${apt.iata}</span></div>
                <div class="spec-item"><span class="spec-label">City/Province:</span><span class="spec-val">${apt.city}</span></div>
                <div class="spec-item"><span class="spec-label">Category:</span><span class="spec-val">${apt.type}</span></div>
                <div class="spec-item"><span class="spec-label">Elevation:</span><span class="spec-val">${apt.elevation}</span></div>
            </div>
            <h4 style="margin-top:20px; color:var(--text-muted)">Runway Information</h4>
            <table style="width:100%; text-align:left; margin-top:10px; border-collapse: collapse;">
                <tr style="border-bottom:1px solid var(--border-color)"><th style="padding:8px">Designator</th><th style="padding:8px">Length</th></tr>
                ${runwaysHtml}
            </table>
        `;
    }

    // --- 3. Aircraft Module ---
    const acTabs = document.querySelectorAll('.tab-btn');
    const acPanel = document.getElementById('aircraft-detail-panel');

    function renderAircraft(modelId) {
        const ac = dbAircraft[modelId];
        acPanel.innerHTML = `
            <h3>${ac.mfg} ${ac.model} <span class="cn-title">${ac.category}</span></h3>
            <div class="spec-grid">
                <div class="spec-item"><span class="spec-label">Overall Length</span><span class="spec-val">${ac.length}</span></div>
                <div class="spec-item"><span class="spec-label">Wingspan</span><span class="spec-val">${ac.wingspan}</span></div>
                <div class="spec-item"><span class="spec-label">Overall Height</span><span class="spec-val">${ac.height}</span></div>
                <div class="spec-item"><span class="spec-label">MTOW</span><span class="spec-val">${ac.mtow}</span></div>
                <div class="spec-item"><span class="spec-label">OEW</span><span class="spec-val">${ac.oew}</span></div>
                <div class="spec-item"><span class="spec-label">Typical Speed</span><span class="spec-val">${ac.speed}</span></div>
                <div class="spec-item"><span class="spec-label">Typical Range</span><span class="spec-val">${ac.range}</span></div>
                <div class="spec-item"><span class="spec-label">Engines</span><span class="spec-val">${ac.engine}</span></div>
                <div class="spec-item"><span class="spec-label">Passenger Cap.</span><span class="spec-val">${ac.pax}</span></div>
                <div class="spec-item"><span class="spec-label">Data Source</span><span class="spec-val" style="color:var(--warning-org)">${ac.source}</span></div>
            </div>
        `;
    }
    
    acTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            acTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAircraft(btn.dataset.model);
        });
    });
    renderAircraft('C919'); // Default load

    // --- 4. Physics Simulator (Interactive Module) ---
    // Elements
    const slSpeed = document.getElementById('sim-speed');
    const slAoA = document.getElementById('sim-aoa');
    const slAlt = document.getElementById('sim-alt');
    const slFlap = document.getElementById('sim-flap');
    const slThrust = document.getElementById('sim-thrust');
    
    // SVG Vectors
    const vecLift = document.getElementById('vec-lift');
    const vecDrag = document.getElementById('vec-drag');
    const vecThrust = document.getElementById('vec-thrust');
    const txtLift = document.getElementById('txt-lift');
    
    // SVG Elements for Mechanics
    const planeGrp = document.getElementById('sim-airplane');
    const flapSvg = document.getElementById('sim-flap-svg');

    function updatePhysics() {
        let v = parseFloat(slSpeed.value); // m/s
        let aoa = parseFloat(slAoA.value); // degree
        let alt = parseFloat(slAlt.value); // meters
        let flap = parseFloat(slFlap.value); // degree
        let thr = parseFloat(slThrust.value); // %

        // Update Labels
        document.getElementById('val-speed').textContent = v;
        document.getElementById('val-aoa').textContent = aoa;
        document.getElementById('val-alt').textContent = alt;
        document.getElementById('val-flap').textContent = flap;
        document.getElementById('val-thrust').textContent = thr;

        // Simplified Air Density (rho) based on altitude
        let rho = 1.225 * Math.pow((1 - 0.0000225577 * alt), 4.2561); 
        
        // Simplified Aerodynamic Coefficients
        let CL = (aoa * 0.1) + (flap * 0.02) + 0.2; // Lift coefficient
        if (aoa > 15) CL *= 0.8; // Simple stall simulation
        let CD = 0.02 + (Math.pow(CL, 2) * 0.05) + (flap * 0.001); // Drag coefficient

        // Forces (scaled down significantly for visualization)
        const scaleConst = 0.00001; 
        let liftVis = 0.5 * rho * v * v * CL * scaleConst; 
        let dragVis = 0.5 * rho * v * v * CD * scaleConst;
        let thrustVis = thr * 1.5; 

        // Clamp values for SVG viewbox limits
        liftVis = Math.max(0, Math.min(liftVis, 180)); 
        dragVis = Math.max(0, Math.min(dragVis, 150));
        
        // Update Vectors
        vecLift.setAttribute('y2', -liftVis);
        txtLift.setAttribute('y', -liftVis - 5);
        vecDrag.setAttribute('x2', -dragVis);
        vecThrust.setAttribute('x2', thrustVis);

        // Update Animations / Mechanics
        // 1. Attitude (Pitch = AoA)
        planeGrp.setAttribute('transform', `rotate(${-aoa}, 0, 0)`);
        // 2. Flap deployment mechanics
        flapSvg.setAttribute('transform', `rotate(${flap}, -10, 10)`);
    }

    // Attach listeners
    [slSpeed, slAoA, slAlt, slFlap, slThrust].forEach(el => {
        el.addEventListener('input', updatePhysics);
    });

    updatePhysics(); // Init calc
});