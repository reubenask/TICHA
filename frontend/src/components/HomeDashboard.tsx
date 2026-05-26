import { useTichaStore } from "../store/useTichaStore";

export function HomeDashboard() {
  const { profile, progress, createDemoAccount } = useTichaStore();

  return (
    <section className="screen-section hero-section">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1>{profile?.name ?? "Ticha"}</h1>
        <p className="muted">Your personal English learning companion.</p>
      </div>

      {!profile ? (
        <button className="primary-button" onClick={() => void createDemoAccount()}>
          Create demo learner
        </button>
      ) : null}

      <div className="stats-grid">
        <div>
          <strong>{progress?.totalWords ?? 0}</strong>
          <span>Total</span>
        </div>
        <div>
          <strong>{progress?.knownWords ?? 0}</strong>
          <span>Known</span>
        </div>
        <div>
          <strong>{progress?.sessions ?? 0}</strong>
          <span>Sessions</span>
        </div>
      </div>
    </section>
  );
}
