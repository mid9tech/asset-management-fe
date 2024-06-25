import { menuItem } from "../types/menu.type";

export const findMenuItem = (menu: menuItem[], pathname: string) => {
    return menu.find(menuItem =>
        menuItem.path.some(path => {
            const pathSegments = path.split('/');
            const pathnameSegments = pathname.split('/');

            if (pathSegments.length !== pathnameSegments.length) {
                return false;
            }

            return pathSegments.every((segment, index) =>
                segment.startsWith(':') || segment === pathnameSegments[index]
            );
        })
    );
};