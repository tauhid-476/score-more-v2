import type { ExamAnalysisResponse } from "@score-more-finale/api/lib/types";
import { QuestionCard } from "./QuestionCard";

interface QuesCardSecProps {
  data: ExamAnalysisResponse;
}

interface SectionHeaderProps {
  dot: string;
  emoji: string;
  label: string;
  count: number;
}

function SectionHeader({ dot, emoji, label, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: dot }}
      />
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {emoji} {label}
      </h2>
      <span className="text-sm text-muted-foreground font-normal">
        ({count})
      </span>
    </div>
  );
}

export const QuesCardSec = ({ data }: QuesCardSecProps) => {
  return (
    <div className="space-y-12">
      {data.hot.questions.length > 0 && (
        <section>
          <SectionHeader
            dot="#ef4444"
            emoji="🔥"
            label="Hot Topics"
            count={data.hot.questions.length}
          />
          <div className="flex flex-col gap-3">
            {data.hot.questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                type="hot"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {data.cool.questions.length > 0 && (
        <section>
          <SectionHeader
            dot="#3b82f6"
            emoji="❄️"
            label="Cool Topics"
            count={data.cool.questions.length}
          />
          <div className="flex flex-col gap-3">
            {data.cool.questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                type="cool"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {data.extras.questions.length > 0 && (
        <section>
          <SectionHeader
            dot="#b6de3f"
            emoji="⭐"
            label="Extra Topics"
            count={data.extras.questions.length}
          />
          <div className="flex flex-col gap-3">
            {data.extras.questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                type="extra"
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
