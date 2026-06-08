function inferCppType(val) {
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double';
  if (typeof val === 'boolean') return 'bool';
  if (typeof val === 'string') return 'std::string';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'std::vector<int>'; // fallback
    return `std::vector<${inferCppType(val[0])}>`;
  }
  return 'auto';
}

function toCppLiteral(val) {
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) return `{${val.map(toCppLiteral).join(', ')}}`;
  return String(val);
}

async function testWandbox() {
  const function_name = "twoSum";
  const hidden_test_cases = [
    { inputArgs: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] }
  ];

  let userCode = `
class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        return {0, 1};
    }
};
`;

  let finalCode = `#include <iostream>\n#include <vector>\n#include <string>\n` + userCode;
  finalCode += `\n\n// --- AUTO-GENERATED TEST RUNNER ---\n`;
  finalCode += `int main() {\n  Solution sol;\n`;
  
  hidden_test_cases.forEach((test, i) => {
    const args = test.inputArgs.map((arg, j) => {
        const typeName = Array.isArray(arg) ? inferCppType(arg) : '';
        return `auto arg${i}_${j} = ${typeName}${toCppLiteral(arg)};`;
    }).join('\n  ');
    const argNames = test.inputArgs.map((_, j) => `arg${i}_${j}`).join(', ');
    
    finalCode += `  {\n  ${args}\n`;
    finalCode += `  auto res = sol.${function_name}(${argNames});\n`;
    const expTypeName = Array.isArray(test.expectedOutput) ? inferCppType(test.expectedOutput) : '';
    finalCode += `  auto expected = ${expTypeName}${toCppLiteral(test.expectedOutput)};\n`;
    finalCode += `  if (res != expected) {\n    std::cout << "TEST_FAILED\\n";\n    return 1;\n  }\n  }\n`;
  });
  
  finalCode += `  std::cout << "ALL_TESTS_PASSED\\n";\n  return 0;\n}\n`;

  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compiler: "gcc-13.2.0", code: finalCode, save: false })
  });
  
  const data = await response.json();
  console.log(data);
}
testWandbox();
