async function testWandbox() {
  let userCode = `
#include <iostream>
using namespace std;

class Solution {
public:
    int twoSum() {
        return 0;
    }
};

int main() {
    cout << "USER MAIN" << endl;
    return 0;
}
`;

  let finalCode = `#include <iostream>\n#include <vector>\n#include <string>\n#define main user_main\n` + userCode;
  finalCode += `\n#undef main\n\n// --- AUTO-GENERATED TEST RUNNER ---\n`;
  finalCode += `int main() {\n  std::cout << "INTERNAL RUNNER\\n";\n  return 0;\n}\n`;

  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compiler: "gcc-13.2.0", code: finalCode, save: false })
  });
  
  const data = await response.json();
  console.log(data);
}
testWandbox();
