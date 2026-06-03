const userCode = `
import java.util.Arrays;

class Solution {
    public void reverseString(char[] s) {
        // ...
    }
}
`;

const function_name = "reverseString";
const regex = new RegExp(`(?:public\\s+|private\\s+|protected\\s+|static\\s+)*([^\\s]+)\\s+${function_name}\\s*\\(([^)]*)\\)`);
const match = userCode.match(regex);
console.log("Match:", match);
if (match) {
    console.log("Return Type:", match[1]);
    const params = match[2].split(',').map(s => s.trim().split(/\s+/)[0]);
    console.log("Param Types:", params);
}
