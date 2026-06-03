async function test() {
  try {
    const response = await fetch("https://piston.codes/api/v2/piston/execute", { // or piston.codes
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: "print('hello from piston.codes')" }]
      })
    });
    const text = await response.text();
    console.log("piston.codes Status:", response.status);
    console.log("piston.codes Body:", text);
  } catch (e) {
    console.log("Error piston.codes:", e.message);
  }
}

test();
