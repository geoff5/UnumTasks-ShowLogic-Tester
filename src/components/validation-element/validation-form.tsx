import React, {FC, useEffect} from "react";
import * as models from "../../data-models";
import * as apis from "../../utils/delivery-api";
import {filterInputTypes} from "../../utils/kentico-utils";
import {
  acceptedInputTypesForValidation,
  validationsByType,
  noComparatorForValidation,
  comparatorTypes,
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
  margin: 16px;
  padding: 8px;
`;

const ButtonContainer = styled.div`
  margin: 8px;
  padding: 8px;
  width: 5%;
`;

const selectOptionRule = ({field, ...props}: any) => {
  if (
    validationsByType[props.type] &&
    validationsByType[props.type].length > 0
  ) {
    return (
      <select required disabled={props.disabled} {...field}>
        <option value="" disabled selected>
          Default
        </option>
        {validationsByType[props.type].map((v: string, index: number) => (
          <option value={v.toLowerCase()} key={index}>
            {v}
          </option>
        ))}
      </select>
    );
  }
};

const selectOptionComparator = ({field, ...props}: any) => {
  const comparators = getComparators(props.items, props.comparatorType);
  return (
    <select required disabled={props.disabled} {...field}>
      <option value="" disabled selected>
        Default
      </option>
      {comparators.map((i: any, index: number) => (
        <option value={i.codename} key={index}>
          {i.name}
        </option>
      ))}
    </select>
  );
};

const getComparators = (formElements: FormField[], type: string) => {
  let returnValues: FormField[] = [];
  const comparatorValues = comparatorTypes[type];
  if (!comparatorValues || comparatorValues.otherValues.length <= 0) {
    return returnValues;
  }
  comparatorValues.otherValues.forEach((v: FormField) => {
    returnValues.push(v);
  });

  if (comparatorValues.useFormElements) {
    returnValues = returnValues.concat(formElements);
  }

  return returnValues;
};

const getFormElements = async (
  context: any,
  setformFields: Function,
  setLoading: Function,
  setElementType: Function
) => {
  let formFilter = "";
  let allElementsResponse;
  let currentElementType = "";

  const itemResponse = await apis.getKenticoItemFormElement(
    context.projectId,
    context.item.codename
  ); //get the item the custom element is on
  if (itemResponse) {
    formFilter = itemResponse.item.elements.form.value;
    currentElementType =
      itemResponse.item.elements.input_type.linkedItems[0].system.type;
    setElementType(currentElementType);
    allElementsResponse = await apis.getKenticoItems(
      context.projectId,
      formFilter
    );
  }

  if (allElementsResponse) {
    const formFieldArray: FormField[] = [];
    const acceptedItems = filterInputTypes(allElementsResponse.items, [
      currentElementType,
    ]);
    acceptedItems.forEach((ai: models.FormElement) => {
      if (ai.system.codename !== context.item.codename) {
        //item the element is on should not have validations rules against itself
        formFieldArray.push({
          codename: ai.system.codename,
          name: ai.system.name,
        });
      }
    });
    setformFields(formFieldArray);
    setLoading(false);
  }
};

const formatValidations = (formValues: UnFormattedValidation[]) => {
  let formatted: Validation = {};

  formValues.forEach((v: UnFormattedValidation) => {
    if (v.key) {
      formatted[v.key] = [];
      if (v.validator && !noComparatorForValidation.includes(v.key))
        formatted[v.key].push(v.validator);
      if (v.message) formatted[v.key].push(v.message);
    }
  });

  return formatted;
};

const unFormatValidations = (values: Validation) => {
  const unFormatted: UnFormattedValidation[] = [];

  Object.keys(values).forEach((key: string) => {
    if (values[key][0] && values[key][1])
      unFormatted.push({
        key: key,
        validator: values[key][0],
        message: values[key][1],
      });
    else {
      unFormatted.push({
        key: key,
        validator: "",
        message: values[key][0],
      });
    }
  });

  return unFormatted;
};

const saveValidations = (
  formValues: UnFormattedValidation[],
  setValidations: Function
) => {
  const formattedValidations = formatValidations(formValues);
  CustomElement.setValue(JSON.stringify(formattedValidations));
  setValidations(formattedValidations);
};

const updateEditMode = (editArray: Array<boolean>, index: number = -1) => {
  if (index === -1) {
    editArray.push(true);
  } else {
    editArray[index] = !editArray[index];
  }

  return editArray;
};

interface Validation {
  [index: string]: string[];
}

interface UnFormattedValidation {
  key: string;
  validator: string;
  message: string;
}

interface FormField {
  codename: string;
  name: string;
}

export const ValidationForm: FC = () => {
  const [formFields, setFormFields] = React.useState<Array<FormField>>([]);
  const [validations, setValidations] = React.useState<Validation>({});
  const [elementDisabled, setElementDisabled] = React.useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<
    Array<UnFormattedValidation>
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [elementType, setElementType] = React.useState<string>("");
  const [editMode, setEditMode] = React.useState<Array<boolean>>([]);

  const formRef = React.useRef<FormikProps<FormikValues>>(null);

  const removeValidationAndSave = (index: number, remove: Function) => {
    remove(index);
    const newEditMode = editMode.splice(index, 1);
    setEditMode(newEditMode);
    formRef?.current?.handleSubmit();
  };

  const addNewValidation = (push: Function, editArray: boolean[]) => {
    push({field: "", validator: "", value: ""});
    setEditMode(updateEditMode(editArray));
  };

  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log("element = " + element + " context = " + context);
      CustomElement.setHeight(600);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setElementDisabled(element.disabled);
      if (element.value) {
        setInitialValue(unFormatValidations(JSON.parse(element.value)));
      }
      getFormElements(context, setFormFields, setLoading, setElementType);
    });
  }, []);

  const initialValues = {
    validations: initialValue || [],
  };

  if (loading) {
    return <h1>Loading</h1>;
  }

  if (!acceptedInputTypesForValidation.includes(elementType)) {
    return <h1>This element is not an acceptable type for validation logic</h1>;
  }

  return (
    <div style={{padding: 14}}>
      <h1>This form is for setting the Validation Logic for tasks forms</h1>
      <div style={{marginTop: 100}}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) =>
            saveValidations(values.validations, setValidations)
          }
        >
          {({values}) => (
            <Form>
              <FieldArray name="validations">
                {({insert, remove, push}) => (
                  <div>
                    {values.validations.length > 0 &&
                      values.validations.map(
                        (validations: UnFormattedValidation, index: number) => (
                          <RuleRow key={`rule-${index}`}>
                            <RuleContainer>
                              <label htmlFor={`validations.${index}.key`}>
                                Rule:{" "}
                              </label>
                              <Field
                                name={`validations.${index}.key`}
                                component={selectOptionRule}
                                disabled={!editMode[index]}
                                type={elementType}
                              />
                            </RuleContainer>
                            {!noComparatorForValidation.includes(
                              values?.validations[index]?.key
                            ) && (
                              <RuleContainer>
                                <label
                                  htmlFor={`validations.${index}.validator`}
                                >
                                  Comparator:{" "}
                                </label>
                                <Field
                                  name={`validations.${index}.validator`}
                                  items={formFields}
                                  comparatorType={values.validations[index].key}
                                  component={selectOptionComparator}
                                  disabled={!editMode[index]}
                                />
                              </RuleContainer>
                            )}
                            <RuleContainer>
                              <label htmlFor={`validations.${index}.message`}>
                                Error Message:{" "}
                              </label>
                              <Field
                                required
                                name={`validations.${index}.message`}
                                disabled={!editMode[index]}
                              />
                            </RuleContainer>
                            <ButtonContainer>
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  removeValidationAndSave(index, remove)
                                }
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
                        )
                      )}
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => addNewValidation(push, editMode)}
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
