import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type BusinessRole } from './businessrole';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * NotificationType
 * Id: 643f0e6f-f5fe-4fd5-8956-191d9ae29333
 * Codename: notificationtype
 */
export type NotificationType = IContentItem<{
  /**
   * BusinessRole (modular_content)
   * Required: false
   * Id: 7a18ddf6-3ae5-4df3-970f-b25ca3eacc03
   * Codename: businessrole
   */
  businessrole: Elements.LinkedItemsElement<BusinessRole>;

  /**
   * Email Body (text)
   * Required: false
   * Id: b1eb1f22-759c-43e7-a15f-ca4438b5ebff
   * Codename: email_body
   */
  email_body: Elements.TextElement;

  /**
   * Email Subject (text)
   * Required: false
   * Id: 00f0b6af-fb2f-4bc4-84c3-55cf00223899
   * Codename: email_subject
   */
  email_subject: Elements.TextElement;

  /**
   * SMS Message (text)
   * Required: false
   * Id: 4d609e40-70ef-453c-9ccb-abb69423acdf
   * Codename: sms_message
   */
  sms_message: Elements.TextElement;
}>;
