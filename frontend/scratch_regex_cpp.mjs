const userCode = `
class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        return {0, 1};
    }
};
`;

const function_name = "twoSum";
const regex = new RegExp(`([^\\s<>]+(?:<[^>]+>)?(?:\\s+[*&])?)\\s+${function_name}\\s*\\(([^)]*)\\)`);
const match = userCode.match(regex);
console.log("Match:", match);
if (match) {
    console.log("Return Type:", match[1].trim());
    const params = match[2].split(',').map(s => {
       let parts = s.trim().split(/\s+/);
       if (parts.length > 1) parts.pop();
       return parts.join(' ').replace(/&/g, '').trim();
    });
    console.log("Param Types:", params);
}
