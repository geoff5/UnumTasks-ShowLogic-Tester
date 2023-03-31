import React, { FC, useEffect } from "react";
import * as models from "./data-models";
import * as apis from "./utils/delivery-api";
import { filterInputTypes } from "./utils/kentico-utils";
import { acceptedInputTypes } from "./maps";
import { Formik, Field, Form, FieldArray } from "formik";
import styled from "styled-components";

const RuleRow = styled.div`
  display: flex;
`;

const RuleContainer = styled.div`
  margin: 16px;
  padding: 8px;
`;
const selectOptionRule = ({ field, ...props }: any) => (
  <select required disabled={props.disabled} {...field}>
    <option value="" disabled selected>
      Default
    </option>
    <option value="matches">Is</option>
    <option value="required">Has value</option>
  </select>
);

const selectOptionField = ({ field, ...props }: any) => {
  if (props.items) {
    return (
      <select required disabled={props.disabled} {...field}>
        <option value="" disabled selected>
          Default
        </option>
        {props.items.map((i: any, index: number) => (
          <option value={i.codename} key={index}>
            {i.name}
          </option>
        ))}
      </select>
    );
  }
};

const selectOptionValue = ({ field, ...props }: any) => {
  const values = getFieldValues(
    props.formFields,
    props.formValues,
    props.index
  );

  if (values && values.length > 0) {
    return (
      <select required disabled={props.disabled} {...field}>
        <option value="" disabled selected>
          Default
        </option>
        {values.map((i: string, index: number) => (
          <option value={i} key={index}>
            {i}
          </option>
        ))}
      </select>
    );
  }
};

const getMultipleItems = async (itemNames: string[], projectId: string) => {
  const values: Array<string> = [];
  itemNames.forEach(async (iName: string) => {
    const response = await apis.getKenticoItemOption(projectId, iName);
    if (response && response.item && response.item.elements.label.value) {
      values.push(response.item.elements.label.value);
    }
  });

  return values;
};

const getFormElements = async (
  context: any,
  setformFields: Function,
  setLoading: Function
) => {
  let formFilter = "";
  let allElementsResponse;
  const formFields: FormField[] = [];

  const itemResponse = await apis.getKenticoItemFormElement(
    context.projectId,
    context.item.codename
  ); //get the item the custom element is on
  if (itemResponse) {
    formFilter = itemResponse.item.elements.form.value;
    allElementsResponse = await apis.getKenticoItems(
      context.projectId,
      formFilter
    );
  }

  if (allElementsResponse) {
    const acceptedItems = filterInputTypes(
      allElementsResponse.items,
      acceptedInputTypes
    );
    acceptedItems.forEach(async (i: models.FormElement) => {
      const inputs = i.elements.input_type.linkedItems[0] as
        | models.InputTypeCheckbox
        | models.InputTypeSelect
        | models.InputTypeRadioButtonGroup;
      const options = inputs.elements.options.value;
      const valueOptions = await getMultipleItems(options, context.projectId);
      if (valueOptions) {
        const field: FormField = {
          codename: i.system.codename,
          name: i.system.name,
          values: valueOptions,
        };
        formFields.push(field);
      }
    });
    setformFields(formFields);
    setLoading(false);
  }
};

const saveRules = (formValues: Rule[], setRules: Function) => {
  CustomElement.setValue(JSON.stringify(formValues));
  setRules(formValues);
};

const getFieldValues = (
  formFields: FormField[],
  formValues: Rule[],
  index: number
) => {
  const field = formFields.find((f) => f.codename === formValues[index].field);
  return field?.values;
};

interface Rule {
  field?: string;
  validator?: string;
  value?: string;
}

interface FormField {
  codename: string;
  name: string;
  values: Array<string>;
}

export const ValidationForm: FC = () => {
  const [formFields, setFormFields] = React.useState<Array<FormField>>([]);
  const [rules, setRules] = React.useState<Array<Rule>>([]);
  const [elementDisabled, setElementDisabled] = React.useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<Array<Rule>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log("element = " + element + " context = " + context);
      CustomElement.setHeight(600);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setElementDisabled(element.disabled);
      setInitialValue(JSON.parse(element.value));
      getFormElements(context, setFormFields, setLoading);
    });
  }, []);

  const initialValues = {
    rules: initialValue || [],
  };

  if (loading) {
    return <></>;
  }

  return (
    <div style={{ padding: 14 }}>
      <h1>This form is for setting the Show/Hide Logic for tasks forms</h1>
      <div style={{ marginTop: 100 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => saveRules(values.rules, setRules)}
        >
          {({ values }) => (
            <Form>
              <FieldArray name="rules">
                {({ insert, remove, push }) => (
                  <div>
                    {values.rules.length > 0 &&
                      values.rules.map((rule: Rule, index: number) => (
                        <RuleRow key={`rule-${index}`}>
                          <RuleContainer>
                            <label htmlFor={`rules.${index}.field`}>
                              Field
                            </label>
                            <Field
                              name={`rules.${index}.field`}
                              items={formFields}
                              component={selectOptionField}
                              disabled={elementDisabled}
                            />
                          </RuleContainer>
                          <RuleContainer>
                            <label htmlFor={`rules.${index}.validator`}>Rule</label>
                            <Field
                              name={`rules.${index}.validator`}
                              component={selectOptionRule}
                              disabled={elementDisabled}
                            />
                          </RuleContainer>
                          {values.rules[index].validator &&
                            values.rules[index].validator !== "required" &&
                            values.rules[index].field && (
                              <RuleContainer>
                                <label htmlFor={`rules.${index}.value`}>
                                  Value
                                </label>
                                <Field
                                  name={`rules.${index}.value`}
                                  component={selectOptionValue}
                                  disabled={elementDisabled}
                                  formFields={formFields}
                                  formValues={values.rules}
                                  index={index}
                                />
                              </RuleContainer>
                            )}
                          <RuleContainer>
                            <button
                              type="button"
                              className="secondary"
                              onClick={() => remove(index)}
                              disabled={elementDisabled}
                            >
                              X
                            </button>
                          </RuleContainer>
                        </RuleRow>
                      ))}
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => push({ field: "", rule: "", value: "" })}
                      disabled={elementDisabled}
                    >
                      Add Rule
                    </button>
                    <br />
                  </div>
                )}
              </FieldArray>
              <button type="submit" disabled={elementDisabled}>
                Save Rules
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div>Saved Rules: {JSON.stringify(rules)}</div>
      <div>initial Rules: {JSON.stringify(initialValue)}</div>
    </div>
  );
};
