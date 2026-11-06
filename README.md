# Vext

Vext é o ecossistema de extensões do Vectora: o contrato que uma extensão
cumpre, os SDKs para escrevê-la e as extensões oficiais construídas sobre ele.
O host que carrega e isola as extensões vive no repositório do app; aqui ficam
as partes que a comunidade usa para criar extensões.

> Estado: alfa. O contrato e as APIs públicas ainda mudam entre versões menores
> até a 1.0.

## O que existe aqui

| Parte              | Pasta         | Publicação                                 | Linguagem   |
| ------------------ | ------------- | ------------------------------------------ | ----------- |
| SDK TypeScript     | `packages/`   | npm, no escopo `@vext/*`, com proveniência | TypeScript  |
| SDK Python         | `python/`     | PyPI, `vectora-extension-sdk`              | Python      |
| Extensões oficiais | `extensions/` | artefatos `.vext` assinados                | TypeScript  |
| Contrato           | `schemas/`    | versionado com os SDKs                     | JSON Schema |
| Documentação       | `docs/`       | publicada no site de documentação          | Markdown    |
| Tooling de release | `utils/`      | não é publicado                            | Python      |

Os dois SDKs implementam o mesmo contrato (manifesto da extensão e protocolo
JSON-RPC entre extensão e host) e têm a mesma versão: uma tag `vX.Y.Z` publica
o SDK TypeScript no npm e o SDK Python no PyPI.

## Como uma extensão funciona

- Uma extensão é um pacote `.vext` com um manifesto (`vectora-extension.json`),
  um backend opcional (Node ou Python) e uma contribuição opcional para a
  interface.
- O backend fala JSON-RPC com o host por um canal controlado. Ele só recebe as
  capabilities que declara no manifesto e que o host concede: tudo é negado por
  padrão.
- O pacote é verificado antes de rodar: hashes dos membros, assinatura do
  publisher e revogação.

A especificação completa do manifesto e do protocolo fica em `schemas/` e na
documentação.

## Desenvolvimento

Pré-requisitos: Node 24, pnpm 11 e [uv](https://docs.astral.sh/uv/) (para o
SDK Python e o tooling de `utils/`).

```bash
pnpm install --frozen-lockfile   # dependências dos pacotes TypeScript
uv sync                          # tooling e SDK Python
pnpm run typecheck               # tsc --noEmit
pnpm run test                    # testes dos pacotes
pnpm run build                   # build dos pacotes publicáveis
uv run pytest                    # testes do SDK Python e do tooling
```

Antes de abrir um PR, rode o pre-commit:

```bash
uv run pre-commit run --all-files
```

## Fluxo de contribuição

Escolha ou abra uma issue, crie uma branch (`feat/`, `fix/`, `chore/`...) e
envie o PR com título em Conventional Commits. As regras de branches,
milestones e releases estão em [CONTRIBUTING.md](CONTRIBUTING.md) e as de
engenharia em [AGENTS.md](AGENTS.md). Vulnerabilidades seguem o
[SECURITY.md](SECURITY.md), nunca uma issue pública.

## Releases e publicação

O Release Please abre o PR `chore(master): release X.Y.Z`. Ao mesclá-lo, o
pipeline publica o SDK TypeScript no npm com proveniência e, quando habilitado,
o SDK Python no PyPI; só depois de a publicação passar ele cria a tag e a
GitHub Release. Nunca se publica por fora do pipeline. Os detalhes estão em
[`.github/DEPLOYMENT.md`](.github/DEPLOYMENT.md).

## Licença

O SDK e as extensões oficiais são distribuídos sob a Apache License 2.0, para
que qualquer extensão, aberta ou não, possa usá-los.
