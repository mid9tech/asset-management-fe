import { menuItem } from "../types/menu.type";

export const findMenuItem = (menu: menuItem[], pathname: string) => {
    // Function to remove query strings from URL paths
    const cleanPath = (url: string) => {
        const queryStringIndex = url.indexOf('?');
        return queryStringIndex !== -1 ? url.substring(0, queryStringIndex) : url;
    };

    // Clean the input pathname
    const cleanedPathname = cleanPath(pathname);
    const pathnameSegments = cleanedPathname.split('/').filter(Boolean);

    return menu.find(menuItem =>
        menuItem.path.some(path => {
            const cleanedPath = cleanPath(path);
            const pathSegments = cleanedPath.split('/').filter(Boolean);

            if (pathSegments.length !== pathnameSegments.length) {
                return false;
            }

            return pathSegments.every((segment, index) =>
                segment.startsWith(':') || segment === pathnameSegments[index]
            );
        })
    );
};
