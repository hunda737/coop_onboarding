import { SidebarTrigger } from "./sidebar";
import { Separator } from "./separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavUser } from "../sidebar/nav-user";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useLocation, Link } from "react-router-dom";
import { ToasterProvider } from "@/providers/toast-provider";

const Header = () => {
  const { data } = useGetCurrentUserQuery();
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="bg-primary/95 sticky top-0 z-10">
      <ToasterProvider />
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 text-secondary" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return (
                  <BreadcrumbItem key={routeTo} className="text-lg flex">
                    {isLast ? (
                      <span className="text-secondary">{name}</span>
                    ) : (
                      <Link to={routeTo}>
                        <BreadcrumbLink>{name}</BreadcrumbLink>
                      </Link>
                    )}
                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mx-2">
          <NavUser user={data} />
        </div>
      </header>
      <Separator orientation="horizontal" />
    </div>
  );
};

export default Header;
