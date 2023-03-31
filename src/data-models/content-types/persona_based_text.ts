import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Persona } from '../taxonomies/persona';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * Persona Based Text
 * Id: 196470ea-198b-45b8-8dce-2e19988ae481
 * Codename: persona_based_text
 */
export type PersonaBasedText = IContentItem<{
  /**
   * Persona (taxonomy)
   * Required: true
   * Id: cfa14538-5b30-452a-938c-de7b8cdbdd2c
   * Codename: persona
   */
  persona: Elements.TaxonomyElement<Persona>;

  /**
   * Text (custom)
   * Required: true
   * Id: 619c6324-6a3a-4224-9a8a-996ef88dcc41
   * Codename: text
   */
  text: Elements.CustomElement;
}>;