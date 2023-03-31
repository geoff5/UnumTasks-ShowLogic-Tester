import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type BusinessRole } from './businessrole';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * DescriptionByBusinessRole
 * Id: bd7af076-4bf8-4c25-b73a-68d5eb7f1a1e
 * Codename: descriptionbybusinessrole
 */
export type DescriptionByBusinessRole = IContentItem<{
  /**
   * BusinessRole (modular_content)
   * Required: false
   * Id: 452f06de-1089-4965-b47a-c70ea4821596
   * Codename: businessrole
   */
  businessrole: Elements.LinkedItemsElement<BusinessRole>;

  /**
   * Message (text)
   * Required: false
   * Id: 6cdce62d-0aa4-4823-857f-a902b43bb3a0
   * Codename: message
   */
  message: Elements.TextElement;
}>;