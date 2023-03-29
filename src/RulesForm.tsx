import React, { FC, useEffect } from "react";
import { rulesMap } from "./maps";
import { DeliveryClient } from "@kontent-ai/delivery-sdk";
import { Formik, Field, Form, FieldArray } from "formik";
import styled from "styled-components";

const RuleRow = styled.div`
  display: flex;
`;

const RuleContainer = styled.div`
  margin: 16px;
  padding: 8px;
`;
const selectOptionRule = ({
  field,
  form: { touched, errors },
  ...props
}: any) => (
  <select required {...field}>
    <option value="" disabled selected>Default</option>
    <option value="fieldValueIs">Is</option>
    <option value="fieldValueIsNot">Is not</option>
    <option value="fieldValueDefined">Has value</option>
  </select>
);

const selectOptionField = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  if (props.response && props.response.items) {
    return (
      <select required {...field}>
        <option value="" disabled selected>Default</option>
        {props.response.items.map((i: any, index: number) => (
          <option value={i.system.codename} key={index}>
            {i.system.codename}
          </option>
        ))}
      </select>
    );
  }
};

const getFormElements = async (
  context: any,
  setResponse: Function,
  setLoading: Function
) => {
  const client = new DeliveryClient({ projectId: context.projectId });
  const response = await client.items().type("form_element").toPromise();

  if (response && response.data) {
    setResponse(response.data);
    setLoading(false);
  }
};

const saveRules = (formValues: Rule[], setRules: Function) => {
  CustomElement.setValue(JSON.stringify(formValues));
  setRules(formValues);
};

interface Rule {
  field?: string;
  rule?: string;
  value?: string;
}

export const RulesForm: FC = () => {
  const [response, setResponse]: any = React.useState(null);
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
      getFormElements(context, setResponse, setLoading);
    });
  }, []);

  const initialValues = {
    rules: initialValue,
  };

  if (loading) {
    return <></>;
  }

  return (
    <div style={{ padding: 14 }}>
      <h1>This is a test for Show/Hide Logic</h1>
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
                              response={response}
                              component={selectOptionField}
                            />
                          </RuleContainer>
                          <RuleContainer>
                            <label htmlFor={`rules.${index}.rule`}>Rule</label>
                            <Field
                              name={`rules.${index}.rule`}
                              index={index}
                              component={selectOptionRule}
                            />
                          </RuleContainer>
                          {values.rules[index].rule !== "fieldValueDefined" && (
                            <RuleContainer>
                              <label htmlFor={`rules.${index}.value`}>
                                Value
                              </label>
                              <Field
                                name={`rules.${index}.value`}
                                type="text"
                                required
                              />
                            </RuleContainer>
                          )}
                          <RuleContainer>
                            <button
                              type="button"
                              className="secondary"
                              onClick={() => remove(index)}
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
                    >
                      Add Rule
                    </button>
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
