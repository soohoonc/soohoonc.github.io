exports.id = 858;
exports.ids = [858];
exports.modules = {

/***/ 2754:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 414, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 9443, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 8043, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 5608, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7284, 23))

/***/ }),

/***/ 4655:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 4323));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 3701))

/***/ }),

/***/ 2669:
/***/ (() => {



/***/ }),

/***/ 4323:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9755);
/* __next_internal_client_entry_do_not_use__ ThemeProvider auto */ 


function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_themes__WEBPACK_IMPORTED_MODULE_2__/* .ThemeProvider */ .f, {
        ...props,
        children: children
    });
}


/***/ }),

/***/ 3701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Navbar)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(8038);
// EXTERNAL MODULE: ./node_modules/.pnpm/@radix-ui+react-icons@1.3.0_react@18.2.0/node_modules/@radix-ui/react-icons/dist/react-icons.cjs.production.min.js
var react_icons_cjs_production_min = __webpack_require__(6972);
// EXTERNAL MODULE: ./node_modules/.pnpm/@radix-ui+react-navigation-menu@1.1.3_@types+react-dom@18.2.7_@types+react@18.2.15_react-dom@18.2.0_react@18.2.0/node_modules/@radix-ui/react-navigation-menu/dist/index.mjs + 14 modules
var dist = __webpack_require__(7457);
// EXTERNAL MODULE: ./node_modules/.pnpm/class-variance-authority@0.7.0/node_modules/class-variance-authority/dist/index.mjs
var class_variance_authority_dist = __webpack_require__(2891);
// EXTERNAL MODULE: ./node_modules/.pnpm/clsx@2.0.0/node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4643);
// EXTERNAL MODULE: ./node_modules/.pnpm/tailwind-merge@1.14.0/node_modules/tailwind-merge/dist/lib/tw-merge.mjs + 10 modules
var tw_merge = __webpack_require__(6312);
;// CONCATENATED MODULE: ./src/lib/utils.ts


function cn(...inputs) {
    return (0,tw_merge/* twMerge */.m)((0,clsx/* clsx */.W)(inputs));
}

;// CONCATENATED MODULE: ./src/components/ui/navigation-menu.tsx






const NavigationMenu = /*#__PURE__*/ react_.forwardRef(({ className, children, ...props }, ref)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(dist/* Root */.fC, {
        ref: ref,
        className: cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuViewport, {})
        ]
    }));
NavigationMenu.displayName = dist/* Root */.fC.displayName;
const NavigationMenuList = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* List */.aV, {
        ref: ref,
        className: cn("group flex flex-1 list-none items-center justify-center space-x-1", className),
        ...props
    }));
NavigationMenuList.displayName = dist/* List */.aV.displayName;
const NavigationMenuItem = dist/* Item */.ck;
const navigationMenuTriggerStyle = (0,class_variance_authority_dist/* cva */.j)("group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50");
const NavigationMenuTrigger = /*#__PURE__*/ react_.forwardRef(({ className, children, ...props }, ref)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(dist/* Trigger */.xz, {
        ref: ref,
        className: cn(navigationMenuTriggerStyle(), "group", className),
        ...props,
        children: [
            children,
            "",
            /*#__PURE__*/ jsx_runtime_.jsx(react_icons_cjs_production_min/* ChevronDownIcon */.v4q, {
                className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
                "aria-hidden": "true"
            })
        ]
    }));
NavigationMenuTrigger.displayName = dist/* Trigger */.xz.displayName;
const NavigationMenuContent = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Content */.VY, {
        ref: ref,
        className: cn("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto", className),
        ...props
    }));
NavigationMenuContent.displayName = dist/* Content */.VY.displayName;
const NavigationMenuLink = dist/* Link */.rU;
const NavigationMenuViewport = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: cn("absolute left-0 top-full flex justify-center"),
        children: /*#__PURE__*/ jsx_runtime_.jsx(dist/* Viewport */.l_, {
            className: cn("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50", className),
            ref: ref,
            ...props
        })
    }));
NavigationMenuViewport.displayName = dist/* Viewport */.l_.displayName;
const NavigationMenuIndicator = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(dist/* Indicator */.z$, {
        ref: ref,
        className: cn("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", className),
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-slate-200 shadow-md dark:bg-slate-800"
        })
    }));
NavigationMenuIndicator.displayName = dist/* Indicator */.z$.displayName;


// EXTERNAL MODULE: ./node_modules/.pnpm/@radix-ui+react-slot@1.0.2_@types+react@18.2.15_react@18.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs
var react_slot_dist = __webpack_require__(724);
;// CONCATENATED MODULE: ./src/components/ui/button.tsx





const buttonVariants = (0,class_variance_authority_dist/* cva */.j)("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ react_.forwardRef(({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? react_slot_dist/* Slot */.g7 : "button";
    return /*#__PURE__*/ jsx_runtime_.jsx(Comp, {
        className: cn(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    });
});
Button.displayName = "Button";


// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.10_react-dom@18.2.0_react@18.2.0/node_modules/next/link.js
var next_link = __webpack_require__(3331);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./src/components/Navbar.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




function Navbar() {
    const [show, setShow] = (0,react_.useState)(false);
    const menuRef = (0,react_.useRef)(null); // Reference to the menu
    (0,react_.useEffect)(()=>{
        // Function to handle the outside click
        function handleOutsideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShow(false);
            }
        }
        // Add the outside click listener
        document.addEventListener("mousedown", handleOutsideClick);
        // Cleanup the listener on component unmount
        return ()=>{
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);
    return /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenu, {
        ref: menuRef,
        children: /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuList, {
            className: "w-screen justify-center fixed gap-4 pt-8 text-sm",
            children: show ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuItem, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/",
                            children: "Home"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuItem, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/experience",
                            children: "Experience"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuItem, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/projects",
                            children: "Projects"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(NavigationMenuItem, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/misc",
                            children: "Misc"
                        })
                    })
                ]
            }) : /*#__PURE__*/ jsx_runtime_.jsx(Button, {
                variant: "ghost",
                className: "rounded-full h-4 w-4 p-4",
                onClick: ()=>setShow(true),
                children: /*#__PURE__*/ jsx_runtime_.jsx("p", {
                    className: "text-xl text-slate-400 hover:text-slate-300",
                    children: "☉"
                })
            })
        })
    });
}


/***/ }),

/***/ 3416:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.10_react-dom@18.2.0_react@18.2.0/node_modules/next/font/google/target.css?{"path":"src/app/layout.tsx","import":"Inter","arguments":[{"subsets":["latin"]}],"variableName":"inter"}
var layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_ = __webpack_require__(5560);
var layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_);
// EXTERNAL MODULE: ./src/styles/globals.css
var globals = __webpack_require__(9728);
// EXTERNAL MODULE: ./node_modules/.pnpm/next@13.4.10_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(2850);
;// CONCATENATED MODULE: ./src/app/providers.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/Users/schoi/Projects/schoi98.github.io/src/app/providers.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["ThemeProvider"];

;// CONCATENATED MODULE: ./src/components/Navbar.tsx

const Navbar_proxy = (0,module_proxy.createProxy)(String.raw`/Users/schoi/Projects/schoi98.github.io/src/components/Navbar.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: Navbar_esModule, $$typeof: Navbar_$$typeof } = Navbar_proxy;
const Navbar_default_ = Navbar_proxy.default;


/* harmony default export */ const Navbar = (Navbar_default_);
;// CONCATENATED MODULE: ./src/app/layout.tsx





const metadata = {
    title: "Soohoon Choi",
    description: "Soohoon's personal website"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ jsx_runtime_.jsx("body", {
            className: (layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_default()).className,
            children: /*#__PURE__*/ jsx_runtime_.jsx("main", {
                className: (layout_tsx_import_Inter_arguments_subsets_latin_variableName_inter_default()).className,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(e0, {
                    attribute: "class",
                    defaultTheme: "system",
                    enableSystem: true,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(Navbar, {}),
                        children
                    ]
                })
            })
        })
    });
}


/***/ }),

/***/ 9728:
/***/ (() => {



/***/ })

};
;