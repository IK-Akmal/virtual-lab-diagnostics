export interface NormalValues {
  men: string;
  women: string;
  children?: string;
  general?: string;
}

export interface Theory {
  definition: string;
  functions: string[];
  normalValues: NormalValues;
  clinicalSignificance: {
    increased: string[];
    decreased: string[];
  };
  additionalInfo?: string[];
}

export interface MethodStep {
  title: string;
  description: string;
}

export interface Method {
  id: string;
  name: string;
  description: string;
  steps: MethodStep[];
  animationType: "analyzer-workflow" | "goryaev-chamber" | "microscope" | "spectrophotometer" | "centrifuge";
}

export interface Situation {
  id: string;
  caseDescription: string;
  question: string;
  hint?: string;
}

export interface SkillStep {
  id: string;
  instruction: string;
  correctAction: string;
  options: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  theory: Theory;
  methods: Method[];
  situations: Situation[];
  skillSteps: SkillStep[];
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
