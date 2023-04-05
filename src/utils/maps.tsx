export const acceptedInputTypesForShowHide: string[] = [
  "inputtyperadiobutton",
  "inputtypecheckbox",
  "inputtypedatepicker",
  "inputtypeselect",
];

export const inputTypesWithOptions: string[] = [
    "inputtyperadiobutton",
    "inputtypecheckbox",
    "inputtypeselect",
  ];

export const acceptedInputTypesForValidation: string[] = [
  "inputtypedatepicker",
  "inputtypedatetime",
  "inputtypetext",
];

export const validationsByType: {[key: string]: string[]} = {
  inputtypedatepicker: ["Min", "Max"],
  inputtypedatetime: ["Required"],
  inputtypetext: ["Required", "Length", "Email"],
};

type ComparatorType = {
  useFormElements: boolean;
  otherValues: any[];
};

export const comparatorTypes: {[key: string]: ComparatorType} = {
  min: {
    useFormElements: true,
    otherValues: [{name: "Today", codename: "today"}],
  },
  max: {
    useFormElements: true,
    otherValues: [{name: "Today", codename: "today"}],
  },
  required: {useFormElements: false, otherValues: []},
  email: {useFormElements: false, otherValues: []},
  length: {
    useFormElements: false,
    otherValues: [
      {name: "20", codename: 20},
      {name: "50", codename: 50},
      {name: "100", codename: 100},
    ],
  },
};

export const noComparatorForValidation: string[] = ["required", "email"];

export const inputsIsRuleAllowed: string[] = [
  "inputtyperadiobutton",
  "inputtypecheckbox",
  "inputtypeselect",
]
