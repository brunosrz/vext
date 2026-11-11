# Security Policy

This policy covers the Vext ecosystem in this repository: the extension
contract (manifest and JSON-RPC protocol), the TypeScript and Python SDKs, the
official extensions and the release pipeline that publishes them. The host that
loads and isolates extensions lives in the Vectora app repository and has its
own policy.

## Reporting a Vulnerability

If you find a security vulnerability, **do not open a public issue**. This
would expose the problem before a fix is available.

**How to report:**

1. Open a [GitHub Security Advisory](https://github.com/vectora-company/vext/security/advisories/new) (private)
2. Include: affected package or extension, vulnerability type, steps to
   reproduce, estimated impact

**What to include:**

- Package name and version, or the commit where you observed it
- A minimal manifest, message or `.vext` package that triggers it
- Expected vs. observed behavior

**What NOT to include:**

- Real secrets, tokens, or credentials
- Full technical exploit before coordinating disclosure

**Disclosure process:**

1. Maintainer acknowledges receipt within 48h
2. Validates and reproduces the vulnerability
3. Develops and tests the fix
4. Publishes the fixed versions to npm and PyPI and a coordinated advisory

---

## Secure Development Practices

All submitted code must follow:

- **Untrusted input**: manifests, JSON-RPC messages and `.vext` packages are
  hostile input; validate them against the schema before using them, enforce
  size limits and reject paths that leave the package root
- **Deny by default**: an extension only gets the capabilities it declares and
  the host grants; the SDKs never widen a permission
- **Secrets out of git**: publishing credentials live in GitHub Environments
  or, preferably, in OIDC trusted publishing; never in the repository (check
  `.gitignore` before any commit)
- **Publishing only through the pipeline**: packages are published from the
  release commit with provenance; never from a developer machine
- **Reviewed dependencies**: every new SDK dependency is justified, because it
  ships to everyone who installs the package; `pnpm audit` and the Snyk scan
  check for known advisories
- **Special attention to**: signature and integrity verification of packages,
  the sandbox and capability code, process spawning, path handling and anything
  that parses a manifest or a message
