import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type DescriptionByBusinessRole } from './descriptionbybusinessrole';
import { type FormTextElement } from './form_text_element';
import { type InputTypeCheckbox } from './inputtypecheckbox';
import { type InputTypeDatePicker } from './inputtypedatepicker';
import { type InputTypeDateTime } from './inputtypedatetime';
import { type InputTypeFileUpload } from './inputtypefileupload';
import { type InputTypeRadioButtonGroup } from './inputtyperadiobutton';
import { type InputTypeTextArea } from './inputtypetextarea';
import { type InputTypeTextField } from './inputtypetext';

/**
 * Generated by '@kontent-ai/model-generator@5.10.0'
 *
 * FormElement
 * Id: cba3b184-4924-4ed5-99ba-bfa18d6bb62d
 * Codename: formelement
 */
export type FormElement = IContentItem<{
  /**
   * InputLabel (text)
   * Required: true
   * Id: ef9a2498-3665-4196-b0e5-e5c5636baf62
   * Codename: inputlabel
   *
   * Form Label
   */
  inputlabel: Elements.TextElement;

  /**
   * InputName (text)
   * Required: true
   * Id: 98a8cc70-6ae0-4d93-8f8b-dc102e432a61
   * Codename: inputname
   *
   * Form Input Name
   */
  inputname: Elements.TextElement;

  /**
   * InputType (modular_content)
   * Required: false
   * Id: 13baf3b8-77d7-4527-97c0-4ccd64b4b432
   * Codename: inputtype
   */
  inputtype: Elements.LinkedItemsElement<
    | InputTypeCheckbox
    | InputTypeTextField
    | InputTypeTextArea
    | InputTypeRadioButtonGroup
    | InputTypeFileUpload
    | InputTypeDateTime
    | InputTypeDatePicker
    | FormTextElement
  >;

  /**
   * Tooltip (modular_content)
   * Required: false
   * Id: 30476aa5-29aa-44f9-b164-e23bfa46d5cc
   * Codename: tooltip
   */
  tooltip: Elements.LinkedItemsElement<DescriptionByBusinessRole>;
}>;
