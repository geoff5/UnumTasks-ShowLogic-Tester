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

export const previewAPIKey: string = "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogImY1NjA0NTI4ZmJkNjRmMjNiNmFiMzEzYjUzODE5Y2YzIiwNCiAgImlhdCI6ICIxNjY4MTg4MDQwIiwNCiAgImV4cCI6ICIyMDEzNzg4MDQwIiwNCiAgInZlciI6ICIxLjAuMCIsDQogICJwcm9qZWN0X2lkIjogImQ2MDliZWY3OTJiMDAwOTBiNzRiZTZiZGE2NjA0ZjIxIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0._witpu7ljU6R4H1IIhOLYBv4-eSjGMwszpN1vys6ru8";
