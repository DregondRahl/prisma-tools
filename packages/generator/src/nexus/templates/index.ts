import findPagination from './findPagination';
import findUnique from './findUnique';
import findFirst from './findFirst';
import findMany from './findMany';
import findCount from './findCount';
import createOne from './createOne';
import updateOne from './updateOne';
import deleteOne from './deleteOne';
import upsertOne from './upsertOne';
import deleteMany from './deleteMany';
import updateMany from './updateMany';
import aggregate from './aggregate';
import sync from './sync';
import { QueriesAndMutations } from '@paljs/types';

const crud: { [key in QueriesAndMutations]: string } = {
  findPagination,
  findUnique,
  findFirst,
  findMany,
  findCount,
  createOne,
  updateOne,
  deleteOne,
  upsertOne,
  deleteMany,
  updateMany,
  aggregate,
  sync,
};

function capital(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getCrud(
  model: string,
  type: 'query' | 'mutation' | 'subscription',
  key: QueriesAndMutations,
  onDelete?: boolean,
  isJS?: boolean,
) {
  function getImport(content: string, path: string) {
    return isJS
      ? `const ${content} = require('${path}')`
      : `import ${content} from '${path}'`;
  }
  function getImportArgs() {
    switch (key) {
      case 'sync':
      case 'aggregate':
      case 'findFirst':
        return ', list';
      case 'findCount':
      case 'findMany':
        return ', nonNull, list';
      case 'findPagination':
        return ', objectType, nonNull, list';
      case 'findUnique':
      case 'deleteOne':
      case 'deleteMany':
      case 'createOne':
      case 'updateMany':
      case 'updateOne':
      case 'upsertOne':
        return ', nonNull';
    }
  }
  const modelLower = model.charAt(0).toLowerCase() + model.slice(1);
  const modelUpper = capital(model);
  const importString = getImport(
    `{ ${
      type === 'query'
        ? 'queryField'
        : type === 'mutation'
        ? 'mutationField'
        : 'subscriptionField'
    }${getImportArgs()} }`,
    'nexus',
  );
  return crud[key]
    .replace(/#{ModelName}/g, model)
    .replace(/#{Model}/g, modelUpper)
    .replace(/#{model}/g, modelLower)
    .replace(/#{import}/g, importString)
    .replace(/#{as}/g, isJS ? '' : ' as any')
    .replace(/#{exportTs}/g, isJS ? '' : 'export ')
    .replace(
      /#{exportJs}/g,
      isJS
        ? `module.exports = {${modelUpper}${capital(key)}${capital(type)}}`
        : '',
    )
    .replace(
      /#{onDelete}/g,
      onDelete ? `await prisma.onDelete({ model: '${model}', where })` : '',
    );
}
