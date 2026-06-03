const userCode = `
import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
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

const fnName = "twoSum";
const regex = new RegExp(`(?:public\\s+|private\\s+|protected\\s+|static\\s+)*([^\\s]+)\\s+${fnName}\\s*\\(([^)]*)\\)`);
const match = userCode.match(regex);
console.log(match);
