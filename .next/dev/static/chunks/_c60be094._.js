(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://umfnfwhgnyzveuetsmzn.supabase.co") || 'https://placeholder.supabase.co', ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZm5md2hnbnl6dmV1ZXRzbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTg2NDksImV4cCI6MjA4NDMzNDY0OX0.4hXxj9zFg0t30tkDW4akEYtSyNebLEw9gvZPabibA4c") || 'placeholder-key');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Import necessary React hooks for managing state, side effects, and context.
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)"); // Import our helper function to create a Supabase client instance.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)"); // Import the Next.js router hook to programmatic navigation (like redirecting).
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client"; // This directive tells Next.js that this component runs in the browser (client-side), allowing us to use React hooks like useState and useEffect.
;
;
;
// Create the context object with default/initial values.
// These default values are used if a component tries to use this context outside of an <AuthProvider>.
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null,
    session: null,
    isLoading: true,
    signOut: async ()=>{}
});
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // State variable to hold the current user. Starts as null.
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // State variable to hold the current session. Starts as null.
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true); // State variable for loading status. Starts as true (loading).
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])(); // Initialize the Next.js router so we can redirect users.
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])(); // Initialize the Supabase client to interact with our backend.
    // useEffect runs specific code when the component mounts (loads) or when its dependencies change.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // 1. Check for an identifiable active session correctly when the app initially loads.
            const checkUser = {
                "AuthProvider.useEffect.checkUser": async ()=>{
                    // Get the current session from Supabase.
                    const { data: { session } } = await supabase.auth.getSession();
                    // Update our local state with the session data found.
                    setSession(session);
                    // Update the user state. If session exists, use its user; otherwise null.
                    setUser(session?.user ?? null);
                    // We are done checking, so set loading to false.
                    setIsLoading(false);
                }
            }["AuthProvider.useEffect.checkUser"];
            checkUser(); // Call the function we just defined.
            // 2. Set up a listener to react to real-time changes in authentication state (e.g., user signs in or out).
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": (_event, session)=>{
                    // Update session state with the new session.
                    setSession(session);
                    // Update user state with the new user.
                    setUser(session?.user ?? null);
                    // Ensure loading is false (we know the state now).
                    setIsLoading(false);
                    // Refresh the Next.js router. This re-runs server components to ensure they reflect the new auth state (like updating protected routes).
                    router.refresh();
                }
            }["AuthProvider.useEffect"]);
            // implementation of the cleanup function.
            // This runs when the component unmounts (rare for a root provider) to stop listening for changes.
            return ({
                "AuthProvider.useEffect": ()=>subscription.unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        router,
        supabase
    ]); // Dependencies: if 'router' or 'supabase' changes, re-run this effect (unlikely to change often).
    // Define a function to sign the user out.
    const signOut = async ()=>{
        // Call Supabase's signOut method to clear the session on the server/backend.
        await supabase.auth.signOut();
        // Redirect the user to the login page immediately after signing out.
        router.push("/login");
    // Note: router.refresh() happens in the onAuthStateChange listener above, so we don't need it here.
    };
    // Render the Context Provider.
    // We pass the current state (user, session, isLoading) and the signOut function into the 'value' prop.
    // {children} represents all the components inside this Provider (your whole app).
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            session,
            isLoading,
            signOut
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/auth/AuthProvider.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "egEo7piAQen+eX3wcfuPoA4LK2A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c60be094._.js.map