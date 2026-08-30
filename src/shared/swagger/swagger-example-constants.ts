import { v4 as uuid } from 'uuid';

export const SwaggerExampleConstants = {
  STRING: 'string',
  UUID: uuid(),
  DATE: new Date(),
  TRUE: true,
  FALSE: false,
  VALUE: 'Value1',
  PATH: '/path',
  REPLACE: 'replace',
  DATE_ONLY: '2023-04-21',
  NUMBER: 'number',
  DATE_FORMAT: 'date',
  ANY: {},
  STRING_ARRAY: ['string'],
  UUID_ARRAY: [uuid()],
  TODAY_DATE: new Date().toISOString().split('T')[0]
};
