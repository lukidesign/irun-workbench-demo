#!/usr/bin/env python3
"""Extract 2026光伏展诊断智能体推荐对话.md into PV_EXPO_DIAG_QA JS snippet."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "2026光伏展诊断智能体推荐对话.md"
OUT = ROOT / "scripts" / "_diag_qa_snippet.js"

MATCH_KEYS = [
    ["2034", "电网过压", "过压", "fault code 2034", "overvoltage", "Grid Overvoltage"],
    ["数采", "数据采集", "data acquisition", "Data Acquisition"],
    ["绝缘电阻", "绝缘", "insulation resistance", "insulation"],
    ["温度高", "温度", "high temperature", "High Temperature", "High Inverter Temperature"],
]


def json_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def extract_blocks(md: str) -> list[tuple[str, str]]:
    parts = re.split(r"^## ", md, flags=re.M)[1:]
    blocks: list[tuple[str, str]] = []
    for part in parts:
        lines = part.split("\n", 1)
        header = lines[0].strip()
        body = lines[1] if len(lines) > 1 else ""
        m = re.match(
            r"(?:[一二三四]|[IVX]+)\.\s*(?:推荐问题|Recommended\s+(?:Problem|Question))\s*[:：]\s*(.+)",
            header,
        )
        if not m:
            continue
        q = m.group(1).strip()
        reply_split = re.split(
            r"\*\*(?:回复|Reply)\s*[:：]\*\*\s*\n", body, maxsplit=1, flags=re.I
        )
        if len(reply_split) < 2:
            continue
        ans = reply_split[1].split("\n---\n")[0].strip()
        blocks.append((q, ans))
    return blocks


def main() -> None:
    md = MD.read_text(encoding="utf-8")
    blocks = extract_blocks(md)
    cn: list[tuple[str, str]] = []
    en: list[tuple[str, str]] = []
    for q, a in blocks:
        if re.search(r"[\u4e00-\u9fff]", q):
            cn.append((q, a))
        else:
            en.append((q, a))
    n = min(len(cn), len(en))
    items: list[dict] = []
    for i in range(n):
        items.append(
            {
                "qZh": cn[i][0],
                "qEn": en[i][0],
                "aZh": cn[i][1],
                "aEn": en[i][1],
                "matchKeys": MATCH_KEYS[i] if i < len(MATCH_KEYS) else [],
            }
        )

    lines = [
        "// PV Expo (2026) · Diagnosis Agent recommended dialogues (CN+EN)",
        "// Synced from 2026光伏展诊断智能体推荐对话.md",
        "const PV_EXPO_DIAG_QA = [",
    ]
    for it in items:
        keys = ", ".join(f"'{k}'" for k in it["matchKeys"])
        qzh = it["qZh"].replace("'", "\\'")
        qen = it["qEn"].replace("'", "\\'")
        lines.append("  {")
        lines.append("    agent: 'diag',")
        lines.append(f"    qZh: '{qzh}',")
        lines.append(f"    qEn: '{qen}',")
        lines.append(f"    matchKeys: [{keys}],")
        lines.append(f"    aZh: `{json_escape(it['aZh'])}`,")
        lines.append(f"    aEn: `{json_escape(it['aEn'])}`,")
        lines.append("  },")
    lines.append("];")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(items)} items to {OUT}")


if __name__ == "__main__":
    main()
