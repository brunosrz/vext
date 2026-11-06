# Deployment & GitHub Actions

## Pipeline (`vext.yml`, workflow `Vext`)

| Job             | Quando roda                                                 | O que faz                                             |
| --------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `verify`        | todo PR e todo push                                         | typecheck, testes, build e validação dos manifestos   |
| `verify-python` | todo PR e todo push                                         | testes do SDK Python e do tooling, e build do SDK     |
| `publish-npm`   | push em `master` de um commit de release, ou disparo manual | publica os pacotes `@vext/*` no npm, com proveniência |
| `publish-pypi`  | os mesmos, com a variável `PUBLISH_PYPI` igual a `true`     | publica o SDK Python no PyPI                          |
| `tag-release`   | depois do `publish-npm` e do `publish-pypi` (se não pulado) | tag, GitHub Release e rotação das linhas              |

A tag só sai depois de o npm publicar com sucesso, para uma tag nunca existir
sem o pacote correspondente. Os dois SDKs saem na mesma versão. O pnpm ignora
versões que já estão no npm, então repetir a publicação pela aba Actions
(`workflow_dispatch` a partir do `master`) é seguro.

## Pré-requisitos do repositório

- **Settings → Actions → General → Workflow permissions:** marque "Allow GitHub
  Actions to create and approve pull requests". Sem isso o Release Please não
  consegue abrir o PR de release (`GitHub Actions is not permitted to create or
approve pull requests`).
- **Label `autorelease: pending`:** criado pelo próprio workflow.
- **Milestones `0.1.x` e `0.2`:** o workflow `PR Release Milestone` cria a
  milestone da linha quando ela falta.
- **Branch `release/0.2`:** é a linha de desenvolvimento definida em
  `.github/release-lines.json`. Ela precisa existir de antemão; depois da
  primeira release minor a rotação passa a criar a próxima sozinha.

## Publicação

**npm (obrigatória).** O repositório usa trusted publishing: no npm, configure
cada pacote `@vext/*` para confiar neste repositório e no workflow
`vext.yml`, com o Environment `npm`. Com isso não é preciso nenhum token. Se
o trusted publishing ainda não estiver configurado, cadastre `NPM_TOKEN` no
Environment `npm` como fallback (token granular, só de publicação nos pacotes
`@vext/*`).

**PyPI (opcional).** Cadastre o repositório como publisher confiável do projeto
no PyPI, com o Environment `pypi`, e defina a variável de repositório
`PUBLISH_PYPI=true`. Sem a variável, o job é pulado e a tag sai só com o npm.

## Secrets e variáveis

- Environment `npm`: `NPM_TOKEN` (opcional, só se não houver trusted publishing)
- Environment `pypi`: nenhum, o PyPI autentica por OIDC
- Variável de repositório: `PUBLISH_PYPI`
- `SNYK_TOKEN` (opcional): habilita a varredura do Snyk quando o workflow
  correspondente existir

## Rollback

Uma versão publicada no npm não deve ser removida. Para recuar:

```bash
npm deprecate "@vext/pacote@X.Y.Z" "use X.Y.W"
```

e publique uma versão corrigida pelo pipeline. No PyPI, marque a versão como
retirada (`yank`) pela interface do projeto.
