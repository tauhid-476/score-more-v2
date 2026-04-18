export interface ExamQuestion {
  question: string;
  marks: number | null;
  frequency: string;
  solution: string;
}

export interface QuestionCategory {
  questions: ExamQuestion[];
}

export interface ExamAnalysisResponse {
  metadata: {
    subject: string;
    paperCount: number;
    totalQuestions: number;
  };
  hot: QuestionCategory;
  cool: QuestionCategory;
  extras: QuestionCategory;
}

export interface ExamAnalysisError {
  error: boolean;
  errorType:
    | "INVALID_DOCUMENT"
    | "MIXED_SUBJECTS"
    | "API_FETCH_FAILED"
    | "UNKNOWN_ERROR";
  message: string;
}
