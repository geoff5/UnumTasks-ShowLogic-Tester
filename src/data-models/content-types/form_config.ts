import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type FormElement } from './form_element';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Form Config
 * Id: 6cdeffca-2396-48a1-9146-288d1b46b148
 * Codename: form_config
 */
export type FormConfig = IContentItem<{
  /**
   * Form Elements (modular_content)
   * Required: true
   * Id: 67b06545-0f90-4805-ba5a-8ac3a567d788
   * Codename: form_elements
   */
  form_elements: Elements.LinkedItemsElement<FormElement>;
}>;
