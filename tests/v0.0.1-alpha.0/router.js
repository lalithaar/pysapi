async function runRoute() {
  const pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/"
  });
  const params = new URLSearchParams(window.location.search);
  const route = params.get("route");

  let pyCode = "";
  if (route === "bla") {
    pyCode = await fetch("bla.py").then(r => r.text());
  } else if (route === "blabla") {
    pyCode = await fetch("blabla.py").then(r => r.text());
  } else {
    document.body.innerHTML = "<h2>404: No such route.</h2>";
    return;
  }

  await pyodide.runPythonAsync(pyCode);
  const output = pyodide.runPython("main()");
  
  // Try to parse output as JSON and display prettily; fallback to raw text
  let rendered;
  try {
    const jsonObj = JSON.parse(output);
    rendered = "<pre>" + JSON.stringify(jsonObj, null, 2) + "</pre>";
  } catch(e) {
    rendered = `<h2>${output}</h2>`;
  }
  document.body.innerHTML = rendered;
}

window.onload = runRoute;