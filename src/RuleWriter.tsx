import React from 'react';
import { rulesMap } from './maps';
import { DeliveryClient } from '@kontent-ai/delivery-sdk';
import { FC, useEffect } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';

const selectOptionRule = (initialValue: Array<Rule>) => { 
  return (
    <>
      <option value="default" selected={!initialValue[0] || !initialValue[0].rule}>Default</option>
      <option value="is" selected={initialValue[0] !== undefined && initialValue[0].rule !== undefined && initialValue[0].rule === rulesMap['is']}>Is</option>
      <option value="isNot" selected={initialValue[0] !== undefined && initialValue[0].rule !== undefined && initialValue[0].rule === rulesMap['isNot']}>Is not</option>
      <option value="hasValue" selected={initialValue[0] !== undefined && initialValue[0].rule !== undefined && initialValue[0].rule === rulesMap['hasValue']}>Has value</option>
    </>
  );
};

const selectOptionField = (response: any, initialValue: Array<Rule>) => {
  if (response && response.items) {
    return(
      <>
        <option value="default" selected={!initialValue[0] || !initialValue[0].field}>Default</option>
        {response.items.map((i: any) => (
          <option value={i.system.codename} selected={initialValue[0] !== undefined && initialValue[0].field !== undefined && initialValue[0].field === i.system.codename}>{i.system.codename}</option>
        ))}
      </>
    )
  }
}

const getFormElements = async (context: any, setResponse: Function) => {
  const client = new DeliveryClient({projectId: context.projectId});
  const response = await client.items().type('form_element').toPromise();

  if (response && response.data) {
    setResponse(response.data);
  }
}

interface Rule {
  field?: string;
  rule?: string;
  value?: string;
}

export const RuleWriter: FC = () => {
  const [response, setResponse]: any = React.useState(null);
  const [rules, setRules] = React.useState<Array<Rule>>([]);
  const [elementDisabled, setElementDisabled] = React.useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<Array<Rule>>([]);

  useEffect(() => {
    CustomElement.setValue(JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log('element = ' + element + ' context = ' + context);
      CustomElement.setHeight(350);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setElementDisabled(element.disabled);
      setInitialValue(JSON.parse(element.value));

      getFormElements(context, setResponse);
    });
  }, []);

  const setFieldAndCreateRules = (e: any) => {
    const currentRules = {...rules};
    const name = e.target.name;
    const eventValue: string = e.target.value;
    if(!currentRules[0]) {
      currentRules[0] = {};
    }

    switch(name) {
      case 'field':
        currentRules[0].field = eventValue;
        break;

      case 'value':
        currentRules[0].value = eventValue;
        break;

      case 'rule':
        currentRules[0].rule = rulesMap[eventValue];
        break;
    }
    
    setRules(currentRules);
  };

  return (
    <div style={{ padding: 14 }}>
      <h1>This is a test for Show/Hide Logic</h1>
      <div style={{ marginTop: 100 }}>
        <table>
          <tr>
            <th>And/Or</th>
            <th>Field Name</th>
            <th>Rule</th>
            <th>Value</th>
            <th>Delete</th>
          </tr>
          <tr>
            <td>
              N/A
            </td>
            <td>
              <select disabled={elementDisabled} defaultValue="Select a field" name="field" onChange={(e) => setFieldAndCreateRules(e)}>{selectOptionField(response, initialValue)}</select>
            </td>
            <td><select disabled={elementDisabled} name="rule" onChange={(e) => setFieldAndCreateRules(e)}>{selectOptionRule(initialValue)}</select></td>
            <td><input disabled={elementDisabled} type="text" defaultValue={'Default'} name="value" onChange={(e) => setFieldAndCreateRules(e)} /></td>
            <td><button>X</button></td>
          </tr>
        </table>
      </div>
      <div>{JSON.stringify(rules)}</div>
    </div>
  );
};

RuleWriter.displayName = 'RecombeeTypesManager';
