import { hemoglobinTopic } from "./topics/hemoglobin";
import { erythrocytesTopic } from "./topics/erythrocytes";
import { erythrocyteIndicesTopic } from "./topics/erythrocyte-indices";
import { leukocytesTopic } from "./topics/leukocytes";
import { leukocyteFormulaTopic } from "./topics/leukocyte-formula";
import { plateletsTopic } from "./topics/platelets";
import { esrTopic } from "./topics/esr";

import { hemoglobinQuestions } from "./questions/hemoglobin";
import { erythrocytesQuestions } from "./questions/erythrocytes";
import { erythrocyteIndicesQuestions } from "./questions/erythrocyte-indices";
import { leukocytesQuestions } from "./questions/leukocytes";
import { leukocyteFormulaQuestions } from "./questions/leukocyte-formula";
import { plateletsQuestions } from "./questions/platelets";
import { esrQuestions } from "./questions/esr";

import { Topic, Question } from "./types";

export const allTopics: Topic[] = [
  hemoglobinTopic,
  erythrocytesTopic,
  erythrocyteIndicesTopic,
  leukocytesTopic,
  leukocyteFormulaTopic,
  plateletsTopic,
  esrTopic,
];

export const allQuestions: Question[] = [
  ...hemoglobinQuestions,
  ...erythrocytesQuestions,
  ...erythrocyteIndicesQuestions,
  ...leukocytesQuestions,
  ...leukocyteFormulaQuestions,
  ...plateletsQuestions,
  ...esrQuestions,
];

export function getTopicById(id: string): Topic | undefined {
  return allTopics.find((t) => t.id === id);
}

export function getQuestionsByTopicId(topicId: string): Question[] {
  return allQuestions.filter((q) => q.topicId === topicId);
}
