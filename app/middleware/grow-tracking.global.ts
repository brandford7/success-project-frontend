// plugins/grow.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Initialize the growMe global variable
    window.growMe ||
      ((window.growMe = function (e: any) {
        window.growMe._.push(e);
      }),
      (window.growMe._ = []));

    // Inject the script tag
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://grow.me";
    script.defer = true;
    script.setAttribute("data-grow-faves-site-id", "YOUR_SITE_ID");
    script.setAttribute("data-grow-initializer", "");
    document.head.appendChild(script);

    // Provide growMe so it's accessible as $growMe in your app
    return {
      provide: {
        growMe: (event: any) => window.growMe(event),
      },
    };
  }
});
