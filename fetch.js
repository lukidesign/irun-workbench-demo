// iRun Workbench — tiny request helper (no bundler)
// Exposes `window.IRUN_FETCH.request()` for the rest of the app to call.

// const _DEMO_TOKEN =
//     'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRVdWlkIjoiNGZmOGVmMzE2YjUyNDY2NGFlOWE1ZDAwMmY5YjUyY2UiLCJ1c2VyX2lkIjoxMzkwNDg2NDAzMDg5ODA3NTEsInRlbmFudElkIjoxNDYwODU1MTI5MTQxNjIxMTcsInVzZXJfa2V5IjoiYWNjY2JlY2YtOTM4YS00Y2JjLWJkYjMtYTRlYmI2OGVlMTk3IiwidXNlcm5hbWUiOiJ0b2tlbjAxIn0.oX53fZhvSprGVgJZZpSgwIF7DLuvwFTgXA_cWB8YE7Ubx4XgGVLB6vkRng0F5lea4sR01Z1SvZK--GAwvZwU4A';
const _DEMO_TOKEN =
    'eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRVdWlkIjoiNGZmOGVmMzE2YjUyNDY2NGFlOWE1ZDAwMmY5YjUyY2UiLCJ1c2VyX2lkIjoxMzkwNDg2NDAzMDg5ODA3NTEsInRlbmFudElkIjoxNDYwODU1MTI5MTQxNjIxMTcsInVzZXJfa2V5IjoiMTc5M2Y0ZjktZjdlOC00M2MxLWI3ODMtOGUxNmMxYjQwMmUwIiwidXNlcm5hbWUiOiJ0b2tlbjAxIn0.5oTmWFfWTu1tp_XlvKpwSwW83wYg2GrNsHU9VgkramakKKSWxNpiGvB0X-LFViXNF4GTKXF8IlGvrRIfGXbbJQ';
const baseUrl = 'https://pmms01.rundoai.com/api';
function _getToken() {
    try { return localStorage.getItem('irun:token') || _DEMO_TOKEN; } catch (e) { return _DEMO_TOKEN; }
}

function _toQuery(params) {
    if (!params) return '';
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        q.append(k, String(v));
    });
    const s = q.toString();
    return s ? `?${s}` : '';
}

function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function _mockApi({ url, method, headers, body, params }) {
    // Simulated demo endpoints (no backend needed)
    // - GET /api/demo/ping
    // - GET /api/demo/profile
    // - POST /api/demo/echo
    if (!url.startsWith('/api/demo/')) return null;
    await _sleep(220);

    const auth = headers?.Authorization || headers?.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (url === '/api/demo/ping' && method === 'GET') {
        return { ok: true, status: 200, data: { pong: true, ts: Date.now(), tokenPrefix: token ? token.slice(0, 12) : '' } };
    }
    if (url === '/api/demo/profile' && method === 'GET') {
        return { ok: true, status: 200, data: { user: 'admin', tenantId: 146085512912838269, tokenPrefix: token ? token.slice(0, 12) : '' } };
    }
    if (url === '/api/demo/echo' && method === 'POST') {
        return { ok: true, status: 200, data: { params: params || null, body: body || null, tokenPrefix: token ? token.slice(0, 12) : '' } };
    }

    return { ok: false, status: 404, data: { message: 'demo endpoint not found', url, method } };
}

/**
 * request(urlOrOptions)
 *
 * - **自动带 token**：`Authorization: Bearer <token>`
 * - **统一 JSON 处理**：默认解析 JSON；非 JSON 返回 text
 * - **自带 demo mock**：访问 `/api/demo/*` 会本地模拟返回
 */
async function request(urlOrOptions, maybeOptions) {
    const opt = typeof urlOrOptions === 'string'
        ? { url: urlOrOptions, ...(maybeOptions || {}) }
        : (urlOrOptions || {});

    const rawUrl = opt.url || '';
    const url = baseUrl + rawUrl;
    const method = (opt.method || 'GET').toUpperCase();
    const token = opt.token || _getToken();
    const params = opt.params;

    const headers = {
        ...(opt.headers || {}),
        ...(token ? { Authorization: `${token}` } : {}),
    };

    const isJsonBody = opt.json !== false && opt.body !== undefined;
    const body = isJsonBody
        ? JSON.stringify(opt.body)
        : (opt.body instanceof FormData ? opt.body : opt.body);
    if (isJsonBody) headers['Content-Type'] = headers['Content-Type'] || 'application/json';

    const res = await fetch(url + _toQuery(params), { method, headers, body: method === 'GET' || method === 'HEAD' ? undefined : body });
    const ct = res.headers.get('content-type') || '';
    const payload = ct.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) {
        const msg = (payload && payload.message) ? payload.message : `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.payload = payload;
        throw err;
    }
    if (payload.code === 200) {
        return payload;
    } else {
        throw new Error(payload.msg);
    }
}

async function demo() {
    const ping = await request('/api/demo/ping');
    const profile = await request('/api/demo/profile');
    const echo = await request('/api/demo/echo', { method: 'POST', body: { hello: 'irun' } });
    return { ping, profile, echo };
}

/** 将 list-v2 / detail 接口字段统一为 TopBar 使用的 installCapacity、power、dayEnergy */
function normalizePlantApiFields(item, fallback = {}) {
    const installCapacity = Number(
        item?.installCapacity ?? item?.installCapacityValue ?? fallback.installCapacity ?? fallback.capacity ?? 0
    );
    const power = Number(
        item?.realTimePower ?? item?.realTimePowerValue ?? item?.currentPower
        ?? item?.power ?? fallback.power ?? 0
    );
    const dayEnergy = Number(
        item?.dayEnergy ?? item?.dayEnergyValue ?? item?.dayGen ?? fallback.dayEnergy ?? fallback.gen ?? 0
    );
    return { installCapacity, power, dayEnergy };
}

// 获取所有电站列表,
async function getPlantList() {
    const response = await request('/power-station/overview/list-v2', {
        method: 'POST',
        body: {
            pageNum: 1,
            pageSize: 999
        },
    });
    return response;
}

// 获取电站下的告警列表
async function getPlantAlertList() {
    const response = await request('/power-station/overview/alarm-overview-v2', {
        method: 'POST',
        body: {
        },
    });
    return response.data;
}

// 获取租户下电站级别的装机容量,所有电站下的数据，装机容量、实时功率、今日发电、（同比使用本地模拟数据）
async function getPlantPowerGenerationOverview() {
    // post
    const { data: response } = await request('/power-station/overview/power-generation-overview-v2', {
        method: 'POST',
        body: {
        },
    });
    const alertResponse = await getPlantAlertList();
    const plantListResponse = await getPlantList();
    let kpiPlants = 0;
    plantListResponse.rows.forEach(item => {
        // 当tags包含KPI_SEVERE或KPI_GENERAL totalPlants+1
        if (item.tags.includes('KPI_SEVERE') || item.tags.includes('KPI_GENERAL')) {
            kpiPlants++;
        }
    });
    const { installCapacityValue, realTimePowerValue, dayEnergyValue } = response;
    return {
        ...response,
        cap: installCapacityValue, // 装机容量
        pwr: realTimePowerValue, // 实时功率
        gen: dayEnergyValue, // 今日发电
        al: alertResponse.total, // 活跃告警
        risk: kpiPlants, // KPI 风险
        // 告警去噪率 模拟70-80%
        noiseReductionRate: Math.floor(Math.random() * 10) + 70,
        // 待研判数量mock 不能大于alertResponse.total,当没有告警时为0
        pendingAlerts: alertResponse.total > 0 ? Math.floor(Math.random() * (alertResponse.total - 1)) + 1 : 0,
    };
}

// 电站级别告警
async function getPlantAlarmList(siteId) {
    const response = await request('/alarm-event/list-v2', {
        method: 'POST',
        body: {
            "orderByColumn": "firstTime",
            "isAsc": "descend",
            "processingStatus": "Untreated",
            "pageNum": 1,
            "pageSize": 10,
            "siteId": siteId
        },
    });
    return response;
}

// 电站kpi
async function getPlantKpi(siteId) {
    const response = await request(`/station/detail/${siteId}`, {
        method: 'GET',
    });
    return response.data;
}

window.IRUN_FETCH = {
    request,
    demo,
    getPlantList,
    getPlantPowerGenerationOverview,
    getPlantAlertList,
    getToken: _getToken,
    baseUrl,
    getPlantAlarmList,
    getPlantKpi,
    normalizePlantApiFields,
};