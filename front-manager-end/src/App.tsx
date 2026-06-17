import {ComponentType, lazy, Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {AuthenticationError, getSysMenuTree} from "./api/apiClient";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {Layout} from "./components/Layout";
import {IndexPage} from "./pages/index/IndexPage";
import {LoginPage} from "./pages/login/LoginPage";
import {useAuth} from "./state/AuthContext";
import type {SysMenu} from "./types";

type PageModule = Record<string, ComponentType> & {
    default?: ComponentType;
};

// Vite 会在构建时扫描这些页面文件，生成“文件路径 -> 动态 import 函数”的映射。
// 登录页和首页不是数据库菜单控制的页面，所以这里排除掉，只让后台菜单页面走动态路由。
const pageModules = import.meta.glob<PageModule>(["./pages/**/*.tsx", "!./pages/index/**", "!./pages/login/**"]);

function normalizeRoutePath(routePath: string) {
    // React Router 的子路由 path 不需要开头的 /，数据库里可以继续保存 /system/users 这种完整路径。
    return routePath.startsWith("/") ? routePath.slice(1) : routePath;
}

function normalizeComponentPath(componentPath: string) {
    // componentPath 推荐填写相对 src/pages 的路径，例如：system/users/UsersPage.tsx。
    // 也兼容写成 src/pages/system/users/UsersPage.tsx、pages/system/users/UsersPage.tsx、
    // /pages/system/users/UsersPage.tsx 或不带后缀的 system/users/UsersPage。
    // 这里会统一转换成相对 src/pages 的路径，再拼成 ./pages/system/users/UsersPage.tsx 去匹配文件。
    return componentPath.trim().replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\/+/, "").replace(/^src\//, "").replace(/^pages\//, "");
}

function toPascalCase(value: string) {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function getPageCandidates(menu: SysMenu) {
    const candidates: string[] = [];

    if (menu.componentPath) {
        // 优先使用数据库配置的 componentPath，支持带 .tsx 或不带 .tsx。
        const componentPath = normalizeComponentPath(menu.componentPath);
        candidates.push(`./pages/${componentPath}`);
        if (!componentPath.endsWith(".tsx")) {
            candidates.push(`./pages/${componentPath}.tsx`);
        }
    }

    if (menu.routePath) {
        // 如果没有配置 componentPath，则按 routePath 推导页面文件：
        // /system/users -> ./pages/system/users/UsersPage.tsx
        const routePath = normalizeRoutePath(menu.routePath);
        const routeParts = routePath.split("/").filter(Boolean);
        const pageName = `${toPascalCase(routeParts[routeParts.length - 1] ?? "")}Page`;
        if (pageName !== "Page") {
            candidates.push(`./pages/${routePath}/${pageName}.tsx`);
        }
    }

    return candidates;
}

function getPageLoader(menu: SysMenu) {
    // 在所有候选路径里找到第一个真实存在的页面文件。
    return getPageCandidates(menu)
        .map((candidate) => ({candidate, loader: pageModules[candidate]}))
        .find((match) => match.loader);
}

function getExportName(modulePath: string) {
    return modulePath.split("/").pop()?.replace(/\.tsx$/, "");
}

function createLazyPage(modulePath: string, loader: () => Promise<PageModule>) {
    const exportName = getExportName(modulePath);

    // 把 Vite 的动态 import 包装成 React.lazy 可渲染的组件。
    // 页面可以 default export，也可以导出与文件同名的组件，例如 UsersPage.tsx 导出 UsersPage。
    return lazy(async () => {
        const module = await loader();
        const Page = module.default ?? (exportName ? module[exportName] : undefined);

        if (!Page) {
            throw new Error(`Page component export not found for ${modulePath}`);
        }

        return {default: Page};
    });
}

function flattenMenuRoutes(menus: SysMenu[]) {
    const routes: SysMenu[] = [];

    // 菜单是树结构，路由注册需要一维数组，所以这里递归收集所有带 routePath 的菜单。
    for (const menu of menus) {
        if (menu.routePath) {
            routes.push(menu);
        }
        routes.push(...flattenMenuRoutes(menu.children ?? []));
    }

    return routes;
}

export default function App() {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const [menus, setMenus] = useState<SysMenu[]>([]);
    const [menuError, setMenuError] = useState("");

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        if (!isAuthenticated) {
            setMenus([]);
            setMenuError("");
            return;
        }

        let isMounted = true;

        getSysMenuTree()
            .then((tree) => {
                if (!isMounted) {
                    return;
                }
                setMenus(tree);
                setMenuError("");
            })
            .catch((exception) => {
                if (exception instanceof AuthenticationError) {
                    navigateRef.current("/login", {replace: true});
                    return;
                }
                console.error("Failed to load manager menus", exception);
                if (isMounted) {
                    setMenuError(exception instanceof Error ? exception.message : "Failed to load menus");
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    const menuRoutes = useMemo(() => {
        const seenPaths = new Set<string>();

        // 数据库返回哪些菜单，这里就尝试为哪些菜单注册路由；
        // 找不到对应页面文件的菜单不会注册 Route，避免跳到不存在的组件。
        return flattenMenuRoutes(menus).flatMap((menu) => {
            const routePath = menu.routePath;
            if (!routePath || seenPaths.has(routePath)) {
                return [];
            }

            const match = getPageLoader(menu);
            if (!match?.loader) {
                return [];
            }

            seenPaths.add(routePath);
            return [{routePath, Page: createLazyPage(match.candidate, match.loader)}];
        });
    }, [menus]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout menus={menus} menuError={menuError}/>
                    </ProtectedRoute>
                }
            >
                <Route index element={<IndexPage/>}/>
                {menuRoutes.map(({routePath, Page}) => (
                    // 每一条数据库菜单最终变成一条 Route，页面组件按需懒加载。
                    <Route
                        key={routePath}
                        path={normalizeRoutePath(routePath)}
                        element={
                            <Suspense fallback={null}>
                                <Page/>
                            </Suspense>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Route>
        </Routes>
    );
}
