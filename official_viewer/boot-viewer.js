(function () {
  if (location.protocol === "file:") return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = "./viewer.js";
  script.addEventListener("error", () => {
    const status = document.querySelector("#status");
    if (status) status.textContent = "Viewer error";
  });
  document.body.appendChild(script);
})();
