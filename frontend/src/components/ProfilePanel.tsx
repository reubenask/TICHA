import { useTichaStore } from "../store/useTichaStore";

export function ProfilePanel() {
  const { profile, progress } = useTichaStore();

  return (
    <section className="screen-section">
      <p className="eyebrow">Profile</p>
      <div className="profile-card">
        <div className="avatar">{profile?.photoUrl ? <img src={profile.photoUrl} alt="" /> : "👤"}</div>
        <h2>{profile?.name ?? "Learner"}</h2>
        <p className="muted">{profile?.id ?? "TICHA-XXXX"}</p>
      </div>

      <div className="settings-list">
        <div><strong>Name</strong><span>{profile?.name ?? "Learner"}</span></div>
        <div><strong>Level</strong><span>{profile?.level ?? "grade-1-3"}</span></div>
        <div><strong>Language</strong><span>{profile?.nativeLanguage ?? "English"}</span></div>
        <div><strong>Vocabulary</strong><span>{progress?.totalWords ?? 0} words</span></div>
      </div>
    </section>
  );
}
