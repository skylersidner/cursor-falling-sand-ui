import { createStore } from 'easy-peasy';
import { toolbarModel, ToolbarModel } from "../models/toolbar.model";
import { SandModel, sandModel } from '../models/sand.model';

export interface StoreModel {
    toolbar: ToolbarModel;
    sand: SandModel;
}

const store = createStore<StoreModel>({
    toolbar: toolbarModel,
    sand: sandModel,
});

export default store;