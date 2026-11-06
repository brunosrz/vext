export interface AuthToken {
  id: string;
  provider: string;
  scopes: readonly string[];
  expiresAt: number;
}
export interface AuthProvider {
  authorize(scopes: readonly string[]): Promise<AuthToken>;
  revoke(token: AuthToken): Promise<void>;
}
export interface OAuthPkceProvider extends AuthProvider {
  createAuthorizationUrl(
    scopes: readonly string[],
    state: string,
    challenge: string,
  ): string;
  exchangeCode(code: string, verifier: string): Promise<AuthToken>;
  refresh(token: AuthToken): Promise<AuthToken>;
}
export interface AuthAuditEvent {
  action: "authorize" | "refresh" | "revoke";
  provider: string;
  scopes: readonly string[];
  at: number;
}

export class MemoryAuthProvider implements AuthProvider {
  private readonly tokens = new Map<string, AuthToken>();
  private sequence = 0;

  constructor(
    private readonly provider = "memory",
    private readonly lifetimeMs = 3_600_000,
  ) {}

  async authorize(scopes: readonly string[]): Promise<AuthToken> {
    const token: AuthToken = {
      id: `token-${++this.sequence}`,
      provider: this.provider,
      scopes: [...new Set(scopes)].sort(),
      expiresAt: Date.now() + this.lifetimeMs,
    };
    this.tokens.set(token.id, token);
    return { ...token, scopes: [...token.scopes] };
  }

  async revoke(token: AuthToken): Promise<void> {
    this.tokens.delete(token.id);
  }

  /** Um token só é válido enquanto foi emitido aqui, não expirou nem foi revogado. */
  isValid(token: AuthToken, requiredScopes: readonly string[] = []): boolean {
    const issued = this.tokens.get(token.id);
    return (
      issued !== undefined &&
      issued.provider === token.provider &&
      issued.expiresAt > Date.now() &&
      requiredScopes.every((scope) => issued.scopes.includes(scope))
    );
  }
}
