import React, { FC, useEffect } from "react";
import { ShowHideForm } from "./ShowHideForm";
import { ValidationForm } from "./ValidationForm";

type Config = Readonly<{
  use?: string;
}>;

export const App: FC = () => {
  const [elementDisabled, setElementDisabled] = React.useState<boolean>(false);
  const [initialValue, setInitialValue] = React.useState<any>();
  const [projectId, setProjectId] = React.useState<string>("");
  const [config, setConfig] = React.useState<Config | null>(null);

  useEffect(() => {
    CustomElement.init((element, context) => {
      console.log("element = " + element + " context = " + context);
      CustomElement.setHeight(600);
      CustomElement.onDisabledChanged(() => console.log(element.disabled));
      setProjectId(context.projectId);
      setElementDisabled(element.disabled);
      setInitialValue(JSON.parse(element.value));
      setConfig(element.config);
    });
  }, []);

  return (
    <>
      {config?.use === "showHide" && <ShowHideForm></ShowHideForm>}
      {config?.use === "validation" && <ValidationForm></ValidationForm>}
    </>
  );
};
