/**
 * Opções do campo "Tipo de projeto" no formulário de contato.
 * Edite a lista abaixo à vontade: "Não sei" é adicionada automaticamente
 * e fica sempre como última opção.
 */
export const PROJECT_TYPE_OPTIONS: readonly string[] = [
  'Landing page',
  'Site institucional',
  'E-commerce',
  'Sistema web',
  'Manutenção',
  'Outro',
];

export const UNSURE_PROJECT_TYPE = 'Não sei';

export const PROJECT_TYPES: readonly string[] = [
  ...PROJECT_TYPE_OPTIONS.filter((option) => option !== UNSURE_PROJECT_TYPE),
  UNSURE_PROJECT_TYPE,
];
