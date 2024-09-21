import { createTypedHooks } from 'easy-peasy';
import { StoreModel } from './store';

const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>();

export { useStoreActions, useStoreDispatch, useStoreState };