import { useTichaStore } from "../store/useTichaStore";

export function VocabularyDeck() {
  const { deck, activeWordId, setActiveWord, markWord } = useTichaStore();
  const activeWord = deck.find((word) => word.id === activeWordId) ?? deck[0];

  if (!activeWord) {
    return (
      <section className="screen-section">
        <h2>Vocabulary Cards</h2>
        <p className="muted">Starter cards will appear here.</p>
      </section>
    );
  }

  return (
    <section className="screen-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Starter deck</p>
          <h2>Vocabulary Cards</h2>
        </div>
        <span className="pill">{deck.findIndex((word) => word.id === activeWord.id) + 1}/{deck.length}</span>
      </div>

      <article className="vocab-card">
        <div className="emoji">{activeWord.emoji}</div>
        <p className="eyebrow">{activeWord.reviewStatus}</p>
        <h3>{activeWord.word}</h3>
        <p className="pronunciation">{activeWord.pronunciation}</p>
        <p>{activeWord.definition}</p>
        <p className="example">{activeWord.example}</p>
      </article>

      <div className="button-row">
        <button className="secondary-button" onClick={() => void markWord(activeWord.id, "repeat")}>
          Repeat
        </button>
        <button className="primary-button" onClick={() => void markWord(activeWord.id, "known")}>
          Know it
        </button>
      </div>

      <div className="mini-deck" aria-label="Starter vocabulary words">
        {deck.map((word) => (
          <button key={word.id} className={word.id === activeWord.id ? "mini-card active" : "mini-card"} onClick={() => setActiveWord(word.id)}>
            <span>{word.emoji}</span>
            {word.word}
          </button>
        ))}
      </div>
    </section>
  );
}
