async function runCode() {
  const lang = document.getElementById("language").value;
  const code = document.getElementById("code").value;
  const output = document.getElementById("output");
  const iframe = document.getElementById("iframe-output");

  output.innerText = "";
  iframe.style.display = "none";

  if (lang === "html") {
    iframe.style.display = "block";
    iframe.srcdoc = code;
    return;
  }

  if (lang === "javascript") {
    try {
      iframe.style.display = "block";
      iframe.srcdoc = `<script>${code}<\/script>`;
    } catch (e) {
      output.innerText = e.toString();
    }
    return;
  }

  const langMap = {
    "python": "python3",
    "c": "c",
    "java": "java"
  };

  const fileExtMap = {
    "python": "py",
    "c": "c",
    "java": "java"
  };

  const mappedLang = langMap[lang];
  const fileExt = fileExtMap[lang];

  if (!mappedLang || !fileExt) {
    output.innerText = "Language not supported.";
    return;
  }

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: mappedLang,
        version: "*",
        files: [
          {
            name: `Main.${fileExt}`,
            content: code
          }
        ]
      })
    });

    const result = await res.json();
    output.innerText = result.run?.output ?? "No output or error occurred.";
  } catch (err) {
    output.innerText = "Execution error: " + err;
  }
}

// 🌗 Toggle using checkbox switch
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
  });
}

// 🌙 Toggle using button
const themeButton = document.getElementById("toggle-theme");
if (themeButton) {
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (themeToggle) {
      themeToggle.checked = document.body.classList.contains("dark-mode");
    }
  });
}
