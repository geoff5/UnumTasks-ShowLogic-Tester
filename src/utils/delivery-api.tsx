import { DeliveryClient } from "@kontent-ai/delivery-sdk";
import * as models from "../data-models";
import { previewAPIKey } from "./kentico-utils";

const createDeliveryClient = (projectId: string) => {
  return new DeliveryClient({
    projectId: projectId,
    previewApiKey: previewAPIKey,
    defaultQueryConfig: {
      usePreviewMode: true,
    },
  });
};

export const getKenticoItems = async (
  projectId: string,
  formFilter: string
) => {
  const client = createDeliveryClient(projectId);
  const response = await client
    .items<models.FormElement>()
    .type("form_element")
    .equalsFilter("elements.form", formFilter)
    .toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};

export const getKenticoItemFormElement = async (
  projectId: string,
  item: string
) => {
  const client = createDeliveryClient(projectId);
  const response = await client.item<models.FormElement>(item).toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};

export const getKenticoItemCheckBox = async (
  projectId: string,
  item: string
) => {
  const client = createDeliveryClient(projectId);
  const response = await client
    .item<models.InputTypeCheckbox>(item)
    .toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};

export const getKenticoItemOption = async (projectId: string, item: string) => {
  const client = createDeliveryClient(projectId);
  const response = await client.item<models.InputTypeOption>(item).toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};

export const getKenticoItemSeelct = async (projectId: string, item: string) => {
  const client = createDeliveryClient(projectId);
  const response = await client.item<models.InputTypeSelect>(item).toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};

export const getKenticoItemRadio = async (projectId: string, item: string) => {
  const client = createDeliveryClient(projectId);
  const response = await client
    .item<models.InputTypeRadioButtonGroup>(item)
    .toPromise();

  if (response && response.data) {
    return response.data;
  } else {
    return null;
  }
};
