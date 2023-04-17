import React, {FC, useEffect} from "react";
import * as models from "../../data-models";
import * as apis from "../../utils/delivery-api";
import {filterInputTypes} from "../../utils/kentico-utils";
import {
  acceptedInputTypesForShowHide,
  inputTypesWithOptions,
  inputsIsRuleAllowed,
} from "../../utils/maps";
import {
  Formik,
  Field,
  Form,
  FieldArray,
  FormikProps,
  FormikValues,
} from "formik";
import styled from "styled-components";

const RuleRow = styled.div`
  display: flex;
`;

const RuleContainer = styled.div`
  margin: 8px;
  padding: 8px;
  width: 20%;
`;

const ButtonContainer = styled.div`
  margin: 8px;
  padding: 8px;
  width: 5%;
`;

const selectOptionRule = ({field, ...props}: any) => (
  <>
    {!props.editMode ? (
      <input
        disabled
        type="text"
        {...field}
        value={
          field.value === "matches"
            ? "Is"
            : field.value === "required"
            ? "Has value"
            : ""
        }
      />
    ) : (
      <select required disabled={props.disabled} {...field}>
        <option value="" disabled selected>
          Default
        </option>
        {inputsIsRuleAllowed.includes(props.type) && (
          <option value="matches">Is</option>
        )}
        <option value="required">Has value</option>
      </select>
    )}
  </>
);

const selectOptionField = ({field, ...props}: any) => {
  if (props.items && props.editMode) {
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
  } else {
    return <input type="text" disabled {...field} />;
  }
};

const selectOptionValue = ({field, ...props}: any) => {
  const values = getFieldValues(
    props.formFields,
    props.formValues,
    props.index
  );

  if (values && values.length > 0 && props.editMode) {
    return (
      <>
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
      </>
    );
  } else {
    return <input type="text" disabled {...field} />;
  }
};

const getMultipleItems = async (itemNames: string[], projectId: string) => {
  const values: Array<string> = [];
  for (const iName of itemNames) {
    const response = await apis.getKenticoItemOption(projectId, iName);
    if (response && response.item && response.item.elements.label.value) {
      values.push(response.item.elements.label.value);
    }
  }
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
      acceptedInputTypesForShowHide
    );
    console.log("Accepted Items contains: " + JSON.stringify(acceptedItems));

    for (const i of acceptedItems) {
      let valuesOfOptions: string[] = [];
      let field: FormField = {codename: "", name: "", inputType: ""};
      const inputs = i.elements.input_type.linkedItems[0] as
        | models.InputTypeCheckbox
        | models.InputTypeSelect
        | models.InputTypeRadioButtonGroup;

      if (inputTypesWithOptions.includes(inputs.system.type)) {
        const options = inputs.elements.options.value;
        valuesOfOptions = await getMultipleItems(options, context.projectId);
        if (valuesOfOptions) {
          field = {
            codename: i.system.codename,
            name: i.system.name,
            inputType: i.elements.input_type.linkedItems[0].system.type,
            values: valuesOfOptions,
          };
        }
      } else {
        field = {
          codename: i.system.codename,
          name: i.system.name,
          inputType: i.elements.input_type.linkedItems[0].system.type,
          values: [],
        };
      }

      if (i.system.codename !== context.item.codename) {
        //don't push item if the codename is the same as the item the element is on
        formFields.push(field);
      }
    }
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
  inputType: string;
  name: string;
  values?: Array<string>;
}

const updateEditMode = (editArray: Array<boolean>, index: number = -1) => {
  if (index === -1) {
    editArray.push(true);
  } else {
    editArray[index] = !editArray[index];
  }

  return editArray;
};

export const ShowHideForm: FC = () => {
  const [formFields, setFormFields] = React.useState<Array<FormField>>([]);
  const [rules, setRules] = React.useState<Array<Rule>>([]);
  const [elementDisabled, setElementDisabled] = React.useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<Array<Rule>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [editMode, setEditMode] = React.useState<Array<boolean>>([]);

  const formRef = React.useRef<FormikProps<FormikValues>>(null);

  const removeRuleAndSave = (index: number, remove: Function) => {
    remove(index);
    const newEditMode = editMode;
    newEditMode.splice(index, 1);
    setEditMode(newEditMode);
    formRef?.current?.handleSubmit();
  };

  const addNewRule = (push: Function, editArray: boolean[]) => {
    push({field: "", validator: "", value: ""});
    setEditMode(updateEditMode(editArray));
  };

  useEffect(() => {
    CustomElement.init(async (element, context) => {
      console.log("element = " + element + " context = " + context);
      CustomElement.setHeight(600);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setElementDisabled(element.disabled);
      setInitialValue(JSON.parse(element.value));
      const intialEditValues: boolean[] = [];
      if (element.value) {
        JSON.parse(element.value).forEach((r: Rule) => {
          intialEditValues.push(false);
        });
      }
      setEditMode(intialEditValues);
      await getFormElements(context, setFormFields, setLoading);
    });
  }, []);

  const initialValues = {
    rules: initialValue || [],
  };

  if (loading) {
    return <h1>Loading</h1>;
  }

  return (
    <div style={{padding: 14}}>
      <h1>This form is for setting the Show/Hide Logic for tasks forms</h1>
      <div style={{marginTop: 100}}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => saveRules(values.rules, setRules)}
          innerRef={formRef}
        >
          {({values}) => (
            <Form>
              <FieldArray name="rules">
                {({insert, remove, push}) => (
                  <div>
                    {values.rules.length > 0 &&
                      values.rules.map((rule: Rule, index: number) => (
                        <RuleRow key={`rule-${index}`}>
                          <RuleContainer>
                            <label htmlFor={`rules.${index}.field`}>
                              Field:{" "}
                            </label>
                            <Field
                              name={`rules.${index}.field`}
                              items={formFields}
                              component={selectOptionField}
                              editMode={editMode[index]}
                            />
                          </RuleContainer>
                          <RuleContainer>
                            <label htmlFor={`rules.${index}.validator`}>
                              Rule:{" "}
                            </label>
                            <Field
                              name={`rules.${index}.validator`}
                              component={selectOptionRule}
                              editMode={editMode[index]}
                              type={
                                formFields.find(
                                  (f: FormField) =>
                                    f.codename === values.rules[index].field
                                )?.inputType
                              }
                            />
                          </RuleContainer>
                          {values.rules[index].validator !== "required" && (
                            <RuleContainer>
                              <label htmlFor={`rules.${index}.value`}>
                                Value:{" "}
                              </label>
                              <Field
                                name={`rules.${index}.value`}
                                component={selectOptionValue}
                                editMode={
                                  editMode[index] && values.rules[index].field
                                }
                                formFields={formFields}
                                formValues={values.rules}
                                index={index}
                              />
                            </RuleContainer>
                          )}

                          <ButtonContainer>
                            <button
                              type="button"
                              className="secondary"
                              onClick={() => removeRuleAndSave(index, remove)}
                              disabled={!editMode[index]}
                            >
                              Delete Rule
                            </button>
                          </ButtonContainer>
                          <ButtonContainer>
                            <button
                              type="submit"
                              className="primary"
                              onClick={() =>
                                setEditMode(updateEditMode(editMode, index))
                              }
                              disabled={elementDisabled}
                            >
                              {editMode[index] ? "Save Rule" : "Edit Rule"}
                            </button>
                          </ButtonContainer>
                        </RuleRow>
                      ))}
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => addNewRule(push, editMode)}
                      disabled={elementDisabled}
                    >
                      Add Rule
                    </button>
                    <br />
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
