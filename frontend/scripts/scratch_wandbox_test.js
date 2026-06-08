async function test() {
  const code = `
function twoSum(nums, target) {
  for(let i=0; i<nums.length; i++){
    for(let j=i+1; j<nums.length; j++){
      if(nums[i]+nums[j]===target) return [i,j];
    }
  }
}

// --- AUTO-GENERATED TEST RUNNER ---
try {
  const tests = [{"inputArgs":[[2,7,11,15],9],"expectedOutput":[0,1]},{"inputArgs":[[3,2,4],6],"expectedOutput":[1,2]},{"inputArgs":[[3,3],6],"expectedOutput":[0,1]}];
  let passed = 0;
  for (let i = 0; i < tests.length; i++) {
    const res = twoSum(...tests[i].inputArgs);
    if (JSON.stringify(res) !== JSON.stringify(tests[i].expectedOutput)) {
       console.log('TEST_FAILED: Expected ' + JSON.stringify(tests[i].expectedOutput) + ' but got ' + JSON.stringify(res));
       process.exit(1);
    }
    passed++;
  }
  console.log('ALL_TESTS_PASSED');
} catch(e) {
  console.log('ERROR:', e.message);
  process.exit(1);
}
`;

  try {
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        compiler: "nodejs-20.17.0",
        code: code,
        save: false
      })
    });
    const text = await response.text();
    console.log("Wandbox Body:", text);
  } catch (e) {
    console.log("Error Wandbox:", e.message);
  }
}
test();
