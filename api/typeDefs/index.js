import * as path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

const types = fileLoader(path.join(__dirname, './**/*.graphql'));
const typesMerged = mergeTypes(types, { all: true });

export default typesMerged;
