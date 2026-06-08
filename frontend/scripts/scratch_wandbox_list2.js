async function test() {
  const response = await fetch("https://wandbox.org/api/list.json");
  const data = await response.json();
  const compilers = data.map(c => c.name);
  console.log("C++ compilers:", compilers.filter(c => c.includes("gcc") && c.includes("c++")));
  console.log("Java compilers:", compilers.filter(c => c.includes("java") || c.includes("jdk")));
}
test();
