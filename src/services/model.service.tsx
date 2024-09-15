import axios from "../utils/axios";

// This is just a skeleton pattern to serve as a foundation for whatever RESTful API you want to call
const basePath = "/api";

export const getModels = () => {
  return axios.get(`${basePath}/models`);
};
export const getModel = (modelId: any) => {
  return axios.get(`${basePath}/models/${modelId}`);
};
export const createModel = (newModel: any) => {
  return axios.post(`${basePath}/model`, newModel);
};
export const updateModel = (modelId: any, updatedModel: any) => {
  return axios.patch(`${basePath}/model/${modelId}`, updatedModel);
};
export const deleteModel = (modelId: any) => {
  return axios.delete(`${basePath}/model/${modelId}`);
};

const modelService = {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
};
export default modelService;
