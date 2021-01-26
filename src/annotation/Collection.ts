import 'reflect-metadata';

type CollectionResult = (target: any) => void;

const Collection = (collectionName: string): CollectionResult => (target: any): void => {
  Reflect.defineMetadata('collectionName', collectionName, target);
};

export default Collection;
