async function testWandbox() {
  let finalCode = `
class Solution {
    public int[] twoSum() {
        return new int[]{0, 1};
    }
}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] arg0_0 = new int[]{2, 7, 11, 15};
        int arg0_1 = 9;
        Object res = sol.twoSum(arg0_0, arg0_1);
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
