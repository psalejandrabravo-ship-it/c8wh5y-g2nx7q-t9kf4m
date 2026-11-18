import { useState } from "react";

type GuideAge = "4-5" | "6-8";
type GuideFormat = "pdf" | "docx";

const guides: Record<GuideAge, { label: string; file: string }> = {
  "4-5": { label: "4 a 5 años", file: "Grandes-observadores-4-5" },
  "6-8": { label: "6 a 8 años", file: "Grandes-observadores-6-8" },
};

export function GuideDownloadModal({ onClose }: { onClose: () => void }) {
  const [age, setAge] = useState<GuideAge>("4-5");
  const [format, setFormat] = useState<GuideFormat>("pdf");
  const guide = guides[age];
  const fileName = `${guide.file}.${format}`;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-download-title"
        className="w-full max-w-md rounded-card bg-paper p-6 shadow-xl"
      >
        <h2 id="guide-download-title" className="text-xl font-extrabold text-indigo">
          Descargar guía
        </h2>
        <p className="mt-1 text-sm text-ink/75">Elige la edad y el formato que necesitas.</p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-1.5 text-sm font-bold text-indigo">
            Edad
            <select
              autoFocus
              value={age}
              onChange={(event) => setAge(event.target.value as GuideAge)}
              className="min-h-12 rounded-xl border-2 border-indigo/20 bg-white px-3 text-base font-semibold text-ink"
            >
              {Object.entries(guides).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-sm font-bold text-indigo">
            Formato
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as GuideFormat)}
              className="min-h-12 rounded-xl border-2 border-indigo/20 bg-white px-3 text-base font-semibold text-ink"
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word (.docx)</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="min-h-11 rounded-full border-2 border-indigo px-4 font-bold text-indigo"
            onClick={onClose}
          >
            Cancelar
          </button>
          <a
            href={`/${fileName}`}
            download={fileName}
            className="inline-flex min-h-11 items-center rounded-full bg-coral px-5 font-extrabold text-paper"
          >
            Descargar {format === "pdf" ? "PDF" : "Word"}
          </a>
        </div>
      </section>
    </div>
  );
}
