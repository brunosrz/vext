# Deployment & GitHub Actions

## Pipeline (`vext.yml`, workflow `Vext`)

| Job             | Quando roda                                                 | O que faz                                           |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| `verify`        | todo PR e todo push                                         | typecheck, testes, build e validação dos manifestos |
| `verify-python` | todo PR e todo push                                         | testes do SDK Python e do tooling, e build do SDK   |
| `publish-npm`   | push em `master` de um commit de release, ou disparo manual | publica `@vext/sdk` no npm, com proveniência        |
| `publish-pypi`  | os mesmos, com a variável `PUBLISH_PYPI` igual a `true`     | publica o SDK Python no PyPI                        |
| `tag-release`   | depois do `publish-npm` e do `publish-pypi` (se não pulado) | tag, GitHub Release e rotação das linhas            |

A tag só sai depois de a publicação npm passar e a publicação PyPI passar ou
ser explicitamente desabilitada. Os SDKs compartilham a mesma versão. O primeiro
`0.0.1` é o primeiro bootstrap sem API utilizável; o disparo manual existe para concluir
essa publicação inicial depois que o PR chegar a `master`.

## Pré-requisitos do repositório

- **Settings → Actions → General → Workflow permissions:** marque "Allow GitHub
  Actions to create and approve pull requests". Sem isso o Release Please não
  consegue abrir o PR de release (`GitHub Actions is not permitted to create or
approve pull requests`).
- **Label `autorelease: pending`:** criado pelo próprio workflow.
- **Milestones `0.0.x` e `0.1`:** o workflow `PR Release Milestone` cria a
  milestone da linha quando ela falta.
- **Branch `release/0.1`:** é a próxima linha de desenvolvimento definida em
  `.github/release-lines.json`. Ela precisa existir de antemão; depois da
  primeira release minor a rotação passa a criar a próxima sozinha.

Crie um único GitHub Environment chamado `production` em Settings →
Environments. Os jobs `publish-npm` e `publish-pypi` usam esse Environment.
Guarde nele `NPM_TOKEN` para criar o pacote inicial, se necessário. Depois da
configuração de trusted publishing no npm, remova o token. O PyPI usa o mesmo
Environment `production` como parte da identidade do trusted publisher e não
precisa de token secreto.

## Publicação

**npm (obrigatória).** O workflow usa o Environment `production` e publica apenas
`@vext/sdk` com proveniência. Para o bootstrap inicial, se trusted publishing
não puder criar o pacote ainda inexistente, cadastre `NPM_TOKEN` como secret
desse Environment, usando um token granular de publicação. Configure depois o
trusted publisher do npm para este repositório, workflow `vext.yml` e
Environment `production`; então remova o token.

**PyPI (opcional).** Cadastre o repositório como publisher confiável do projeto
no PyPI, com o Environment `production`, e defina a variável de repositório
`PUBLISH_PYPI=true`. Sem a variável, o job é pulado e a tag sai só com o npm.

## Secrets e variáveis

- Environment `production`: `NPM_TOKEN` (necessário para bootstrap se OIDC não criar o pacote)
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
