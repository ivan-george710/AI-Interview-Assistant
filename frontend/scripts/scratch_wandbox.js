async function test() {
  try {
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        compiler: "nodejs-20.17.0",
        code: "console.log('hello')",
        save: false
      })
    });
    const text = await response.text();
    console.log("Wandbox Body:", text);
  } catch (e) {
    console.log("Error Wandbox:", e.message);
  }
}
test();
