import { useEffect } from "react";
import { useTichaStore } from "./store/useTichaStore";
import { HomeDashboard } from "./components/HomeDashboard";
import { VocabularyDeck } from "./components/VocabularyDeck";
import { WordMap } from "./components/WordMap";
import { RadioHub } from "./components/RadioHub";
import { ProfilePanel } from "./components/ProfilePanel";

export default function App() {
  const { load, deck, activeWordId } = useTichaStore();

  useEffect(() => {
    void load();
  }, [load]);

  const activeWord = deck.find((word) => word.id === activeWordId) ?? deck[0];

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="Ticha app preview">
        <HomeDashboard />
        <VocabularyDeck />
        {activeWord ? <WordMap data={activeWord} /> : null}
        <RadioHub />
        <ProfilePanel />
      </section>
    </main>
  );
}
