import { GraphQLScalarType } from 'graphql';

export const VOID = new GraphQLScalarType({
  name: 'VOID',
  description: 'Represent a void value',
  serialize() {
    return;
  },
  parseValue() {
    return;
  },
  parseLiteral() {
    return;
  },
});
