function inferJavaType(val) {
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double';
  if (typeof val === 'boolean') return 'boolean';
  if (typeof val === 'string') return 'String';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'int[]'; // fallback
    return `${inferJavaType(val[0])}[]`;
  }
  return 'Object';
}

function toJavaLiteral(val) {
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) {
     const type = inferJavaType(val);
     return `new ${type}{${val.map(toJavaLiteral).join(', ')}}`;
  }
  return String(val);
}

async function testWandbox() {
  const function_name = "twoSum";
  const hidden_test_cases = [
    { inputArgs: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] }
  ];

  let userCode = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{0, 1};
    }
}
`;

  let finalCode = `import java.util.*;\n` + userCode;
  finalCode += `\n\n// --- AUTO-GENERATED TEST RUNNER ---\n`;
  finalCode += `class Main {\n`; // REMOVED PUBLIC
  finalCode += `  public static boolean compare(Object a, Object b) {\n`;
  finalCode += `    if (a == null || b == null) return a == b;\n`;
  finalCode += `    if (a instanceof int[] && b instanceof int[]) return Arrays.equals((int[])a, (int[])b);\n`;
  finalCode += `    if (a instanceof double[] && b instanceof double[]) return Arrays.equals((double[])a, (double[])b);\n`;
  finalCode += `    if (a instanceof Object[] && b instanceof Object[]) return Arrays.deepEquals((Object[])a, (Object[])b);\n`;
  finalCode += `    return a.equals(b);\n  }\n\n`;
  finalCode += `  public static void main(String[] args) {\n    Solution sol = new Solution();\n`;
  
  hidden_test_cases.forEach((test, i) => {
    const args = test.inputArgs.map((arg, j) => `${inferJavaType(arg)} arg${i}_${j} = ${toJavaLiteral(arg)};`).join('\n    ');
    const argNames = test.inputArgs.map((_, j) => `arg${i}_${j}`).join(', ');
    
    finalCode += `    {\n    ${args}\n`;
    finalCode += `    Object res = sol.${function_name}(${argNames});\n`;
    finalCode += `    Object expected = ${toJavaLiteral(test.expectedOutput)};\n`;
    finalCode += `    if (!compare(res, expected)) {\n      System.out.println("TEST_FAILED");\n      System.exit(1);\n    }\n    }\n`;
  });
  
  finalCode += `    System.out.println("ALL_TESTS_PASSED");\n  }\n}\n`;

  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compiler: "openjdk-jdk-22+36", code: finalCode, save: false })
  });
  
  const data = await response.json();
  console.log(data);
}
testWandbox();
