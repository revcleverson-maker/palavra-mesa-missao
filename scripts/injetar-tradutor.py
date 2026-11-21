#!/usr/bin/env python3
"""Insere o tradutor multilíngue em todas as páginas HTML completas do projeto.
O procedimento é idempotente e não altera o conteúdo das leituras.
"""
from pathlib import Path
import re

raiz = Path(__file__).resolve().parents[1]
total = inseridos = 0
sem_head = []
for arquivo in sorted(raiz.rglob("*.html")):
    rel = arquivo.relative_to(raiz)
    if any(parte.startswith(".") for parte in rel.parts):
        continue
    total += 1
    try:
        texto = arquivo.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        print("Encoding não suportado, ignorado:", rel)
        continue
    if "assets/tradutor.js" in texto:
        continue
    match = re.search(r"</head\s*>", texto, flags=re.IGNORECASE)
    if not match:
        sem_head.append(str(rel))
        continue
    prefixo = "../" * (len(rel.parts) - 1)
    script = '<script src="' + prefixo + 'assets/tradutor.js" defer></script>\n'
    atualizado = texto[:match.start()] + script + texto[match.start():]
    arquivo.write_text(atualizado, encoding="utf-8")
    inseridos += 1
    print("Incluído:", rel)
print(f"Arquivos HTML: {total}; atualizados: {inseridos}; fragmentos sem head: {sem_head}")
