#!/usr/bin/env python3
"""Extract 安全智能体问答.md into PV_EXPO_SAFE_QA JS snippet."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "安全智能体问答.md"
OUT = ROOT / "scripts" / "_safe_qa_snippet.js"


def js_str(s: str) -> str:
    return json_escape(s)


def json_escape(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("${", "\\${")
    )


def parse_part(part: str) -> tuple[str, str]:
    lines = part.strip().split("\n")
    q = lines[0].strip()
    ans = "\n".join(lines[1:]).strip()
    return q, ans


def main() -> None:
    md = MD.read_text(encoding="utf-8")
    parts = re.split(r"^# 问：", md, flags=re.M)[1:]
    items: list[dict] = []
    match_keys_list = [
        ["Johor-Commercial", "Johor", "10月28", "October 28", "2025-10-28", "安全风险"],
        ["Johor-Commercial", "Johor", "6月6", "June 6", "2025-06-06", "安全风险"],
    ]
    for i in range(0, len(parts), 2):
        if i + 1 >= len(parts):
            break
        q1, a1 = parse_part(parts[i])
        q2, a2 = parse_part(parts[i + 1])
        if re.search(r"[\u4e00-\u9fff]", q1):
            qzh, azh, qen, aen = q1, a1, q2, a2
        else:
            qzh, azh, qen, aen = q2, a2, q1, a1
        idx = i // 2
        items.append(
            {
                "qZh": qzh,
                "qEn": qen,
                "aZh": azh,
                "aEn": aen,
                "matchKeys": match_keys_list[idx] if idx < len(match_keys_list) else ["Johor-Commercial"],
            }
        )

    lines = [
        "// PV Expo (2026) · Safety Agent recommended dialogues (CN+EN)",
        "// Synced from 安全智能体问答.md",
        "const PV_EXPO_SAFE_QA = [",
    ]
    for it in items:
        keys = ", ".join(f"'{k}'" for k in it["matchKeys"])
        lines.append("  {")
        lines.append("    agent: 'safe',")
        lines.append(f"    qZh: '{it['qZh'].replace(chr(39), chr(92)+chr(39))}',")
        lines.append(f"    qEn: '{it['qEn'].replace(chr(39), chr(92)+chr(39))}',")
        lines.append(f"    matchKeys: [{keys}],")
        lines.append(f"    aZh: `{json_escape(it['aZh'])}`,")
        lines.append(f"    aEn: `{json_escape(it['aEn'])}`,")
        lines.append("  },")
    lines.append("];")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(items)} items to {OUT}")


if __name__ == "__main__":
    main()
