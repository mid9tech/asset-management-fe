export const loadPath = (name: string, enumType: any, label: string) => {
    const states = Object.values(enumType);
    // Construct the query string with all states
    const queryParams = states.map(item => `${label}=${item}`).join('&');
    return `/${name}?${queryParams}`;
};