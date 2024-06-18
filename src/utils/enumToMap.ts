export const convertEnumToMap = (enumObject: any): Map<string, string> => {
    const map = new Map<string, string>();
    for (const key in enumObject) {
        if (enumObject.hasOwnProperty(key)) {
            map.set(key, enumObject[key]);
        }
    }
    return map;
}