async function test() {
  const response = await fetch("https://wandbox.org/api/list.json");
  const data = await response.json();
  const compilers = data.map(c => c.name);
  console.log("Python compilers:", compilers.filter(c => c.includes("python")));
  console.log("Node compilers:", compilers.filter(c => c.includes("node") || c.includes("js")));
}
test();
