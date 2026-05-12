// plugins/grow.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // 1. Initialize the growMe global variable
    window.growMe ||
      ((window.growMe = function (e: any) {
        window.growMe._.push(e);
      }),
      (window.growMe._ = []));

    // 2. Create and inject the external script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://faves.grow.me/main.js";
    script.defer = true;
    script.setAttribute(
      "data-grow-faves-site-id",
      "U2l0ZTpjOWRkODE5OC01NjQ1LTQ5YTYtYTEyZS0wYTliZmI1YmRhMzc=",
    );

    // Optional: Add the initializer attribute from your snippet
    script.setAttribute("data-grow-initializer", "");

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
});
