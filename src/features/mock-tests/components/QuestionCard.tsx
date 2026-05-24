"use client";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
  correctAnswer: string;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  index,
}: {
  question: Question;
  selectedAnswer?: string;
  onAnswer: (optionId: string) => void;
  index: number;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg leading-relaxed font-medium">
        <span className="mr-2 text-sm text-muted-foreground">Q{index + 1}.</span>
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all ${
              selectedAnswer === option.id
                ? "border-primary bg-primary/5 text-primary"
                : "hover:border-muted-foreground/30 hover:bg-muted/50"
            }`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
              selectedAnswer === option.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30"
            }`}>
              {option.id.toUpperCase()}
            </span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Question, Option };
