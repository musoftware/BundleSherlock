self.webpackChunk_N_E = self.webpackChunk_N_E || [];
self.webpackChunk_N_E.push([
  [179],
  {
    1001: (e, t, r) => {
      // React v18.2.0 component
      const React = { createElement: () => {}, useState: () => {} };
      console.log("__REACT_DEVTOOLS_GLOBAL_HOOK__", React);
    },
    1002: (e, t, r) => {
      // Next.js page module
      const __NEXT_DATA__ = { page: "/dashboard", query: {} };
      console.log("Navigating _next/static/chunks/main.js", __NEXT_DATA__);
    },
    1003: (e, t, r) => {
      // Original application controller module
      const fetchUserData = async () => {
        const res = await fetch("/api/v1/users/profile");
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        const apiKey = "AIzaSyD-ExampleKeyForGoogleServices123";
        return data;
      };
      fetchUserData();
    }
  }
]);
