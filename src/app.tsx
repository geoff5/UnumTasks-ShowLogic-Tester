import React, { FC, useEffect } from "react";
import { ShowHideForm } from "./components/show-hide-element/show-hide-form";
import { ValidationForm } from "./components/validation-element/validation-form";

type Config = Readonly<{
  use?: string;
}>;

export const App: FC = () => {
  const [config, setConfig] = React.useState<Config | null>(null);

  useEffect(() => {
    CustomElement.init((element, context) => {
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
