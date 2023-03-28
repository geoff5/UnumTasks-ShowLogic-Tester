import React from "react";
import { rulesMap } from "./maps";
import { DeliveryClient } from "@kontent-ai/delivery-sdk";
import { FC, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";

const selectOptionRule = (initialValue: Array<Rule>) => {
  return (
    <>
      <option
        value="default"
        selected={!initialValue[0] || !initialValue[0].rule}
      >
        Default
      </option>
      <option
        value="is"
        selected={
          initialValue[0] !== undefined &&
          initialValue[0].rule !== undefined &&
          initialValue[0].rule === rulesMap["is"]
        }
      >
        Is
      </option>
      <option
        value="isNot"
        selected={
          initialValue[0] !== undefined &&
          initialValue[0].rule !== undefined &&
          initialValue[0].rule === rulesMap["isNot"]
        }
      >
        Is not
      </option>
      <option
        value="hasValue"
        selected={
          initialValue[0] !== undefined &&
          initialValue[0].rule !== undefined &&
          initialValue[0].rule === rulesMap["hasValue"]
        }
      >
        Has value
      </option>
    </>
  );
};

const selectOptionField = (response: any, initialValue: Array<Rule>) => {
  if (response && response.items) {
    return (
      <>
        <option
          value="default"
          selected={!initialValue[0] || !initialValue[0].field}
        >
          Default
        </option>
        {response.items.map((i: any, index: number) => (
          <option
            value={i.system.codename}
            key={index}
            selected={
              initialValue[0] !== undefined &&
              initialValue[0].field !== undefined &&
              initialValue[0].field === i.system.codename
            }
          >
            {i.system.codename}
          </option>
        ))}
      </>
    );
  }
};

const getFormElements = async (context: any, setResponse: Function) => {
  const client = new DeliveryClient({ projectId: context.projectId });
  const response = await client.items().type("form_element").toPromise();

  if (response && response.data) {
    setResponse(response.data);
  }
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

  useEffect(() => {
    CustomElement.setValue(JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log("element = " + element + " context = " + context);
      CustomElement.setHeight(350);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setElementDisabled(element.disabled);
      setInitialValue(JSON.parse(element.value));

      getFormElements(context, setResponse);
    });
  }, []);

  const saveRules = (formValues: Rule[]) => {
    setRules(formValues);
  }

  return (
    <div style={{ padding: 14 }}>
      <h1>This is a test for Show/Hide Logic</h1>
      <div style={{ marginTop: 100 }}>
        <Formik
          initialValues={initialValue}
          onSubmit={(values) => saveRules(values)}
        >
          {({ values }) => (
            <Form>
              <FieldArray name="rules">
                {({ remove, push }) => (
                  <div>
                    {values.length > 0 &&
                      values.map((rule, index) => (
                        <div className="row" key={`rule-${index}`}>
                          <div className="col">
                            <label htmlFor={`rules.${index}.field`}>Field</label>
                            <Field
                              name={`rules.${index}.field`}
                              placeholder="Select field"
                              as="select"
                            >
                                {() => selectOptionField(response, initialValue)}
                            </Field>
                          </div>
                          <div className="col">
                            <label htmlFor={`rules.${index}.rule`}>
                              Rule
                            </label>
                            <Field
                              name={`rules.${index}.rule`}
                              placeholder="Select the rule"
                              as="select"
                            >
                                {() => selectOptionRule(initialValue)}
                            </Field>
                          </div>
                          <div className="col">
                            <label htmlFor={`rules.${index}.value`}>
                              Value
                            </label>
                            <Field
                              name={`rules.${index}.value`}
                              placeholder="Select the field value"
                              type="text"
                            />
                          </div>
                          <div className="col">
                            <button
                              type="button"
                              className="secondary"
                              onClick={() => remove(index)}
                            >
                              X
                            </button>
                          </div>
                        </div>
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
              <button type="submit" disabled={elementDisabled}>Save Rules</button>
            </Form>
          )}
        </Formik>
      </div>
      <div>{JSON.stringify(rules)}</div>
    </div>
  );
};
