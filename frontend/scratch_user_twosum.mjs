async function testWandbox() {
  const userCode = `
import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }

            map.put(nums[i], i);
        }

        return new int[] {};
    }
}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();

        int[] nums = {2, 7, 11, 15};
        int target = 9;

        int[] result = sol.twoSum(nums, target);

        System.out.println(Arrays.toString(result));
    }
}
`;

  // Fix the regex escaping in this scratch script
  let finalCode = userCode.replace(/\bclass\s+Main\b/g, "class UserMain");
  
  finalCode = `import java.util.*;\n` + finalCode;
  finalCode += `\n\n// --- AUTO-GENERATED TEST RUNNER ---\n`;
  finalCode += `class Main {\n`;
  finalCode += `  public static boolean compare(Object a, Object b) {\n`;
  finalCode += `    if (a == null || b == null) return a == b;\n`;
  finalCode += `    if (a instanceof int[] && b instanceof int[]) return Arrays.equals((int[])a, (int[])b);\n`;
  finalCode += `    if (a instanceof double[] && b instanceof double[]) return Arrays.equals((double[])a, (double[])b);\n`;
  finalCode += `    if (a instanceof char[] && b instanceof char[]) return Arrays.equals((char[])a, (char[])b);\n`;
  finalCode += `    if (a instanceof Object[] && b instanceof Object[]) return Arrays.deepEquals((Object[])a, (Object[])b);\n`;
  finalCode += `    return a.equals(b);\n  }\n\n`;
  finalCode += `  public static void main(String[] args) {\n    Solution sol = new Solution();\n`;
  
  finalCode += `    {\n`;
  finalCode += `    int[] arg0_0 = new int[]{2, 7, 11, 15};\n`;
  finalCode += `    int arg0_1 = 9;\n`;
  finalCode += `    Object res = sol.twoSum(arg0_0, arg0_1);\n`;
  finalCode += `    Object expected = new int[]{0, 1};\n`;
  finalCode += `    if (!compare(res, expected)) {\n      System.out.println("TEST_FAILED");\n      System.exit(1);\n    }\n    }\n`;
  
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
