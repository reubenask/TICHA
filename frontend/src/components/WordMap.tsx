import type { ReactNode } from "react";
import type { VocabularyWord } from "../domain/types";

interface WordMapProps {
  data: VocabularyWord;
}

export function WordMap({ data }: WordMapProps) {
  return (
    <section className="screen-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Word map</p>
          <h2>My word map</h2>
        </div>
        <span className="pill">{data.emoji} {data.word}</span>
      </div>

      <div className="word-map-grid">
        <InfoCard title="Part of speech">{data.partOfSpeech || "Not available"}</InfoCard>
        <InfoCard title="Pronunciation">{data.pronunciation || "Not available"}</InfoCard>
        <InfoCard title="Definition">{data.definition || "Definition coming soon."}</InfoCard>
        <InfoCard title="Example">{data.example || "Example coming soon."}</InfoCard>
        <InfoCard title="Associations">{renderTags(data.associations)}</InfoCard>
        <InfoCard title="Synonyms">{renderTags(data.synonyms)}</InfoCard>
        <InfoCard title="Antonyms">{data.antonyms.length ? renderTags(data.antonyms) : "None yet"}</InfoCard>
        <InfoCard title="Translation">{data.translation || data.word}</InfoCard>
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="info-card">
      <p className="eyebrow">{title}</p>
      <div>{children}</div>
    </article>
  );
}

function renderTags(items: string[]) {
  if (!items.length) return "Not available";
  return (
    <div className="tag-list">
      {items.map((item) => (
        <span className="tag" key={item}>{item}</span>
      ))}
    </div>
  );
}
