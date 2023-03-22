import { FC, useEffect } from 'react';

const SelectOption = () => { 
  return (
  <select name="rule">
    <option value="is">Is</option>
    <option value="is-not">Is not</option>
    <option value="has-value">Has value</option>
  </select>);
};

export const RuleWriter: FC = () => {
  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log('element = ' + element + ' context = ' + context);
      CustomElement.setHeight(350);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
    });
  }, []);

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
            <td><input type="text" name="field" /></td>
            <td>{SelectOption()}</td>
            <td><input type="text" name="value" /></td>
            <td><button onClick={}>X</button></td>
          </tr>
        </table>
      </div>
    </div>
  );
};

RuleWriter.displayName = 'RecombeeTypesManager';
