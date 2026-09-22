import { btn, more } from "../lib/ui.mjs";

export default {
  path: "/404",
  title: "Page not found",
  description: "The page you were looking for has moved or no longer exists.",
  noindex: true,
  body: `
<section class="section phero--center" style="min-height:70svh;display:grid;place-items:center">
  <div class="wrap wrap--narrow center intro">
    <p class="eyebrow">Error 404</p>
    <h1 class="h1">This road ends here.</h1>
    <p class="lead" style="margin:24px auto 0;max-width:34ch">The page moved or never existed. Pick a lane below.</p>
    <div class="actions actions--center">${btn("Go to the home page", "/")}${more("Electric bikes", "/electric-bikes")}${more("Electric fleet", "/dongfeng")}</div>
  </div>
</section>`,
};
