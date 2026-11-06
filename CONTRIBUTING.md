# Contribuindo com o Vext

Este arquivo reúne o setup local e as regras de branches, milestones e
releases. Os detalhes operacionais da publicação ficam em
[`.github/DEPLOYMENT.md`](.github/DEPLOYMENT.md).

## Setup

Pré-requisitos: Node 24, pnpm 11 e [uv](https://docs.astral.sh/uv/) (para o
SDK Python e o tooling de `utils/`).

```bash
pnpm install --frozen-lockfile
uv sync
uv run pre-commit install
```

Checagens antes de abrir o PR:

```bash
pnpm run typecheck
pnpm run test
uv run pytest
uv run pre-commit run --all-files
```

## Fluxo

Abra uma issue, crie uma branch (`feat/`, `fix/`, `chore/`...) e envie o PR.
O título do PR segue Conventional Commits (`feat: ...`, `fix: ...`,
`docs: ...`); ele vira o commit de squash e alimenta o versionamento e o
changelog. Mudanças de contrato (manifesto ou protocolo) precisam da issue com a
especificação antes do PR e de testes de conformidade nos dois SDKs.

## Linhas de release

As linhas ativas estão em `.github/release-lines.json`: `master` é a linha de
manutenção (milestone `0.0.x`) e `release/0.1` é a linha de desenvolvimento
(milestone `0.2`). Escolha a milestone antes da aprovação: o workflow
`PR Release Milestone` verifica a combinação entre base, milestone e tipo de
mudança e bloqueia as incompatíveis.

Uma correção aplicada em `master` é propagada para a linha de desenvolvimento
pelo workflow `Sync stable fixes to active minor`.

## Releases

O workflow `Release Please` abre o PR `chore(master): release X.Y.Z` com o
changelog e os arquivos de versão listados em `version_files`. Ao mesclá-lo, o
workflow `Vext` publica o SDK TypeScript no npm com proveniência e, quando
habilitado, o SDK Python no PyPI. Só depois da publicação bem-sucedida ele cria
a tag e a GitHub Release. A tag reinicia o ciclo e rotaciona as linhas de
release. Os dois SDKs saem sempre na mesma versão.

## Tooling compartilhado

`utils/release.py` e `utils/checks.py` (com os testes) seguem o tooling
dos demais repositórios do ecossistema Vectora. Mantenha-os alinhados com ele
ao alterá-los.

## Licença e contribuições

O SDK e as extensões oficiais são distribuídos sob a Apache License 2.0. Ao
contribuir, você concorda que sua contribuição seja distribuída sob essa
licença.
