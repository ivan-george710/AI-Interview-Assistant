async function testWandbox() {
  let finalCode = `
class Main {
    public static void main(String[] args) {
        System.out.println("USER MAIN");
    }
}

class ZInternalTestRunner {
    public static void main(String[] args) {
        System.out.println("INTERNAL RUNNER");
    }
}
`;

  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compiler: "openjdk-jdk-22+36", code: finalCode, save: false })
  });
  
  const data = await response.json();
  console.log(data);
}
testWandbox();
