import 'reflect-metadata';

export type Target = {
  new (...args: any[]): any;
  collectionName: string;
};
type CollectionResult = (target: any) => void;

const Collection = (collectionName: string): CollectionResult => (target: any): void => {
  Reflect.defineMetadata('collectionName', collectionName, target);
};
// type CollectionResult = (target: any) => void;
//
// const Collection = (collectionName: string): CollectionResult => (target: Target): void => {
//   // eslint-disable-next-line no-param-reassign
//   target.collectionName = collectionName;
// };

// eslint-disable-next-line @typescript-eslint/ban-types
// function Collection<T extends { new (...args: any[]): {} }>(collectionName: string) {
//   return (constructor: T) => {
//     return class extends constructor {
//       collectionName = collectionName;
//     };
//   };
// }

export default Collection;
