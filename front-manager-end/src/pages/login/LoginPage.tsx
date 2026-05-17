import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { useAuth } from "../../state/AuthContext";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : t("login.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <form className="login-panel" onSubmit={handleSubmit}>
          <label className="language-select login-language">
            <span>{t("language.label")}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
              <option value="en">{t("language.english")}</option>
              <option value="zh-CN">{t("language.chinese")}</option>
            </select>
          </label>
          <h1>{t("login.title")}</h1>
          <label>
            {t("login.username")}
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </label>
          <label>
            {t("login.password")}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? t("login.signingIn") : t("login.signIn")}
          </button>
        </form>
      </section>
    </main>
  );
}
