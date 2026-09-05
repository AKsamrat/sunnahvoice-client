export interface NavItem {
  name: string;
  path?: string;
  children?: NavItem[];
}

export const navRoutes: NavItem[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Projects",
    path: "/projects",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Insights",
    path: "/insights",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
