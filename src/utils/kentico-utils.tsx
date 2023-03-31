import * as models from '../data-models';

export const filterInputTypes = (
  items: Array<any>,
  acceptedTypes: string[]
) => {
  const acceptedItems: Array<models.FormElement> = [];
  items.forEach((i: any) => {
    if (i.elements.input_type.linkedItems.length) {
      i.elements.input_type.linkedItems.forEach((li: any) => {
        if (acceptedTypes.includes(li.system.type)) {
          acceptedItems.push(i);
        }
      });
    }
  });

  return acceptedItems;
};
