import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Event } from './event';
import { type FormElement } from './formelement';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Form
 * Id: 463e58d9-d3ae-42e3-a27e-770e8e49afcf
 * Codename: form
 */
export type Form = IContentItem<{
  /**
   * ActionEvent (modular_content)
   * Required: false
   * Id: 7e41b56d-0133-4d93-a9d7-2727fc765b20
   * Codename: actionevent
   */
  actionevent: Elements.LinkedItemsElement<Event>;

  /**
   * Description (text)
   * Required: false
   * Id: e10187d8-1c78-4a1a-acb5-944b6ba3cb47
   * Codename: description
   *
   * Customer Facing Form Description
   */
  description: Elements.TextElement;

  /**
   * FormElements (modular_content)
   * Required: false
   * Id: 134431ee-1f8c-41d9-8a98-023df2bc9a06
   * Codename: formelements
   *
   * Questions and Informational Text on Form
   */
  formelements: Elements.LinkedItemsElement<FormElement>;

  /**
   * Title (text)
   * Required: false
   * Id: 736f8e7f-e274-4ab9-9229-d3c29ee26314
   * Codename: title
   *
   * Customer Facing Form Title
   */
  title: Elements.TextElement;
}>;
