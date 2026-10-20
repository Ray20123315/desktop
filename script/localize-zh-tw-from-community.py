#!/usr/bin/env python3
"""Backport only aligned user-visible strings from a pinned community translation.

This does not copy source code, conditions, or component structure from the
older translation fork. Unmatched/new source lines are left unchanged.
"""
from __future__ import annotations

import difflib
from pathlib import Path
import re
import sys
from opencc import OpenCC

SOURCE = Path(sys.argv[1])
REFERENCE = Path(sys.argv[2])
cc = OpenCC('s2twp')
cn = re.compile(r'[\u3400-\u9fff]')
en = re.compile(r'[A-Za-z]')
literal = re.compile(r"""(?P<quote>['"\x60])(?P<text>(?:\\.|(?!\1).)*?)(?P=quote)""")

def skeleton(line: str) -> str:
    normalized = literal.sub(lambda m: m.group('quote') + 'STRING' + m.group('quote'), line)
    normalized = re.sub(r'>[^<>]*[A-Za-z\u3400-\u9fff][^<>]*<', '>JSX<', normalized)
    return normalized.strip()

def taiwan(text: str, english: str) -> str:
    translated = cc.convert(text)
    # Explicitly prefer Taiwanese Git/UI terms over literal Simplified Chinese conversions.
    for before, after in (
        ('存儲庫', '儲存庫'),
        ('倉庫', '儲存庫'),
        ('文檔', '文件'),
        ('檔案管理器', '檔案總管'),
        ('文件管理器', '檔案總管'),
        ('遠程', '遠端'),
        ('遠端倉庫', '遠端儲存庫'),
        ('文件夾', '資料夾'),
        ('文件', '檔案'),
        ('界面', '介面'),
        ('用戶', '使用者'),
        ('鼠標', '滑鼠'),
        ('窗口', '視窗'),
        ('選項卡', '分頁'),
        ('標籤頁', '分頁'),
        ('改動', '變更'),
        ('新建', '新增'),
        ('查看', '檢視'),
        ('克隆', '複製'),
        ('獲取更新', '擷取更新'),
        ('獲取', '取得'),
        ('拉取請求', 'Pull Request'),
        ('拉取', '提取'),
    ):
        translated = translated.replace(before, after)
    if 'rebase' in english.lower() or 'rebasing' in english.lower():
        translated = translated.replace('重構', '變基')
    # Preserve normal English names and technical references.
    return translated

def replace_one_line(original: str, translated: str) -> tuple[str, int]:
    if original == translated or not cn.search(translated):
        return original, 0
    originals = list(literal.finditer(original))
    references = list(literal.finditer(translated))
    changed = 0
    output = original
    if originals and len(originals) == len(references):
        chunks = []
        at = 0
        for a, b in zip(originals, references):
            chunks.append(original[at:a.start()])
            at = a.end()
            av, bv = a.group('text'), b.group('text')
            same_quote = a.group('quote') == b.group('quote')
            same_placeholders = a.group('quote') != '\x60' or (
                re.findall(r'\$\{[^}]*\}', av) == re.findall(r'\$\{[^}]*\}', bv)
            )
            if (same_quote and same_placeholders and en.search(av)
                    and cn.search(bv) and not cn.search(av) and '\\' not in bv):
                val = taiwan(bv, av)
                chunks.append(a.group('quote') + val + a.group('quote'))
                changed += 1
            else:
                chunks.append(a.group())
        chunks.append(original[at:])
        output = ''.join(chunks)
    elif not originals and not references:
        oa, ob = original.strip(), translated.strip()
        allowed = r'^[\w\s.,!?:;()\-\u2013\u2014\u2019\u2026\u3400-\u9fff]+$'
        if (len(oa) > 1 and en.search(oa) and cn.search(ob)
                and re.match(allowed, oa) and re.match(allowed, ob)
                and not oa.startswith(('/', '*', '//')) and not cn.search(oa)):
            output = original.replace(oa, taiwan(ob, oa), 1)
            changed += 1
        elif original.count('>') == translated.count('>') and original.count('<') == translated.count('<') and original.count('>') > 0:
            xs = list(re.finditer(r'>([^<]+)<', original))
            ys = list(re.finditer(r'>([^<]+)<', translated))
            if len(xs) == len(ys):
                chunks = []
                at = 0
                for a, b in zip(xs, ys):
                    chunks.append(original[at:a.start(1)])
                    av, bv = a.group(1), b.group(1)
                    if en.search(av) and cn.search(bv) and not cn.search(av):
                        chunks.append(taiwan(bv, av))
                        changed += 1
                    else:
                        chunks.append(av)
                    at = a.end(1)
                chunks.append(original[at:])
                output = ''.join(chunks)
    return output, changed

translated_files = translated_snippets = 0
for path in SOURCE.rglob('*'):
    if not path.is_file() or path.suffix not in {'.ts', '.tsx'}:
        continue
    relative = path.relative_to(SOURCE)
    # Keep the already curated menu translation and About dialog intact.
    if relative.parts[0] != 'ui' or relative == Path('ui/about/about.tsx'):
        continue
    if relative.parts[1].startswith('test-'):
        continue
    reference = REFERENCE / relative
    if not reference.exists():
        continue
    original = path.read_text('utf-8').splitlines(keepends=True)
    comparison = reference.read_text('utf-8').splitlines(keepends=True)
    match = difflib.SequenceMatcher(
        None, [skeleton(s) for s in original],
        [skeleton(s) for s in comparison], autojunk=False
    )
    result = list(original)
    hits = 0
    for a, b, n in match.get_matching_blocks():
        for offset in range(n):
            output, count = replace_one_line(original[a+offset], comparison[b+offset])
            if count:
                result[a+offset] = output
                hits += count
    if hits:
        path.write_text(''.join(result), 'utf-8')
        translated_files += 1
        translated_snippets += hits

print(f'Localized {translated_snippets} text spans in {translated_files} UI files')
if translated_snippets < 800:
    raise SystemExit('Translation coverage below expected threshold; aborting')
