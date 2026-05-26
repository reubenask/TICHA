import { useTichaStore } from "../store/useTichaStore";

export function RadioHub() {
  const { radio } = useTichaStore();

  return (
    <section className="screen-section">
      <p className="eyebrow">Ticha Radio</p>
      <h2>Listen and learn</h2>
      <p className="muted">Original stories, songs, facts, news, and podcasts.</p>

      <div className="radio-list">
        {radio.map((item) => (
          <article className="radio-card" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <span>{item.cadence}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
