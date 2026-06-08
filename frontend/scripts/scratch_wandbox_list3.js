async function test() {
  const response = await fetch("https://wandbox.org/api/list.json");
  const data = await response.json();
  const compilers = data.map(c => c.name);
  require('fs').writeFileSync('compilers.txt', compilers.join('\n'));
}
test();
