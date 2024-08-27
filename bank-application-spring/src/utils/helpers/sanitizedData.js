export const sanitizedData = ({ data, keysTobeSelected }) => {
  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizedData({ data: item, keysTobeSelected }))
      .filter(Boolean);
  }

  if (data && typeof data === 'object') {
    const resultList = {};

    keysTobeSelected.forEach((element) => {
      if (element.includes(".")) {
        const [firstKey, ...rest] = element.split(".");
        const nestedKey = rest.join(".");

        if (data[firstKey]) {
          resultList[firstKey] = {
            ...resultList[firstKey],
            ...sanitizedData({
              data: data[firstKey],
              keysTobeSelected: [nestedKey],
            }),
          };
        }
      } else if (data.hasOwnProperty(element)) {
        resultList[element] = data[element];
      }
    });

    return resultList;
  }

  return null;
};
