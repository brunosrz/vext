# Vext

Vext é o ecossistema de extensões do Vectora: o contrato que uma extensão
cumpre, os SDKs para escrevê-la e as extensões oficiais construídas sobre ele.
O host que carrega e isola as extensões vive no repositório do app; aqui ficam
as partes que a comunidade usa para criar extensões.

> Estado: alfa. Os pacotes `@vectoraai/vext-sdk` e `vectora-extension-sdk` começam em
> `0.0.1` apenas para registrar os nomes. Eles não oferecem uma API funcional;
> não os use para construir extensões. O host e seus contratos seguem em
> evolução e serão estabilizados antes de um SDK funcional.

## O que existe aqui

| Parte              | Pasta           | Publicação                                   | Linguagem   |
| ------------------ | --------------- | -------------------------------------------- | ----------- |
| SDK TypeScript     | `packages/sdk/` | npm, `@vectoraai/vext-sdk`, com proveniência | TypeScript  |
| SDK Python         | `python/`       | PyPI, `vectora-extension-sdk`                | Python      |
| Extensões oficiais | `extensions/`   | artefatos `.vext` assinados                  | TypeScript  |
| Contrato           | `schemas/`      | versionado com os SDKs                       | JSON Schema |
| Documentação       | `docs/`         | publicada no site de documentação            | Markdown    |
| Tooling de release | `utils/`        | não é publicado                              | Python      |

Quando funcionais, os SDKs implementarão o mesmo contrato (manifesto da
extensão e protocolo JSON-RPC entre extensão e host) e terão versões alinhadas.
O bootstrap `0.0.1` não implementa esse contrato; a publicação funcional depende
da estabilização do host no Vectora.

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
