async function testWandbox() {
  let finalCode = `
class InternalTestRunner {
    public static void main(String[] args) {
        System.out.println("INTERNAL RUNNER");
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println("USER MAIN");
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
