import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WANDBOX_COMPILERS = {
  javascript: "nodejs-20.17.0",
  python: "cpython-3.14.0",
  java: "openjdk-jdk-22+36",
  cpp: "gcc-13.2.0"
};

// Helper functions for C++ and Java type inference and literal generation
function inferCppType(val: any): string {
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double';
  if (typeof val === 'boolean') return 'bool';
  if (typeof val === 'string') return 'std::string';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'std::vector<int>'; // fallback
    return `std::vector<${inferCppType(val[0])}>`;
  }
  return 'auto';
}

function toCppLiteral(val: any, overrideType?: string): string {
  if (typeof val === 'string') {
     if (overrideType === 'char' || overrideType === 'std::vector<char>' || overrideType === 'char[]') return `'${val}'`;
     return `"${val}"`;
  }
  if (Array.isArray(val)) return `{${val.map(v => toCppLiteral(v, overrideType?.includes('char') ? 'char' : undefined)).join(', ')}}`;
  return String(val);
}

function inferJavaType(val: any): string {
  if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double';
  if (typeof val === 'boolean') return 'boolean';
  if (typeof val === 'string') return 'String';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'int[]'; // fallback
    return `${inferJavaType(val[0])}[]`;
  }
  return 'Object';
}

function toJavaLiteral(val: any, overrideType?: string): string {
  if (typeof val === 'string') {
    if (overrideType === 'char' || overrideType === 'char[]') {
      return `'${val}'`;
    }
    return `"${val}"`;
  }

  if (Array.isArray(val)) {
    const type = overrideType || inferJavaType(val);

    if (type.endsWith('[]')) {
      const baseType = type.replace(/\[\]/g, '');

      return `new ${baseType}[]{${val
        .map(v =>
          toJavaLiteral(
            v,
            type.includes('char') ? 'char' : undefined
          )
        )
        .join(', ')}}`;
    }

    return `{${val.map(v => toJavaLiteral(v)).join(', ')}}`;
  }

  return String(val);
}

function extractJavaSignature(code: string, fnName: string) {
  const regex = new RegExp(
    `(?:public\\s+|private\\s+|protected\\s+|static\\s+)*([^\\s]+)\\s+${fnName}\\s*\\(([^)]*)\\)`
  );

  const match = code.match(regex);

  if (!match) return null;

  return {
    returnType: match[1].trim(),

    paramTypes: match[2]
      .split(',')
      .map(param => {
        param = param.trim();

        const lastSpace = param.lastIndexOf(' ');

        if (lastSpace === -1) {
          return param;
        }

        return param.substring(0, lastSpace).trim();
      })
  };
}

function extractCppSignature(code: string, fnName: string) {
  const regex = new RegExp(`([^\\s<>]+(?:<[^>]+>)?(?:\\s+[*&])?)\\s+${fnName}\\s*\\(([^)]*)\\)`);
  const match = code.match(regex);
  if (match) {
    return {
      returnType: match[1].trim(),
      paramTypes: match[2].split(',').map(s => {
         const parts = s.trim().split(/\s+/);
         if (parts.length > 1) parts.pop();
         return parts.join(' ').replace(/&/g, '').trim();
      })
    };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { language, code, stdin, type, questionId } = body;

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required." }, { status: 400 });
    }

    const compiler = WANDBOX_COMPILERS[language as keyof typeof WANDBOX_COMPILERS];
    if (!compiler) {
      return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
    }

    let finalCode = code;

    // INJECT TEST RUNNER FOR SUBMIT
    if (type === "submit" && questionId) {
      // Securely fetch hidden test cases from Supabase database
      const { data: question, error } = await supabase
        .from('questions')
        .select('function_name, hidden_test_cases')
        .eq('id', questionId)
        .single();

      if (error || !question) {
        return NextResponse.json({ error: "Failed to load question data for validation." }, { status: 500 });
      }

      if (language === 'javascript') {
        const testCasesJson = JSON.stringify(question.hidden_test_cases);
        finalCode += `
\n// --- AUTO-GENERATED TEST RUNNER ---
try {
  const tests = ${testCasesJson};
  let passed = 0;
  for (let i = 0; i < tests.length; i++) {
    const res = ${question.function_name}(...tests[i].inputArgs);
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
      } else if (language === 'python') {
        const testCasesJson = JSON.stringify(question.hidden_test_cases);
        finalCode += `
\n# --- AUTO-GENERATED TEST RUNNER ---
import json
import sys
try:
    tests = json.loads('''${testCasesJson}''')
    for t in tests:
        res = ${question.function_name}(*t['inputArgs'])
        if json.dumps(res).replace(" ", "") != json.dumps(t['expectedOutput']).replace(" ", ""):
            print(f"TEST_FAILED: Expected {t['expectedOutput']} but got {res}")
            sys.exit(1)
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
`;
      } else if (language === 'cpp') {
        const sig = extractCppSignature(finalCode, question.function_name);
        
        finalCode = `#include <iostream>\n#include <vector>\n#include <string>\n#define main user_main\n` + finalCode;
        finalCode += `\n#undef main\n\n// --- AUTO-GENERATED TEST RUNNER ---\n`;
        finalCode += `int main() {\n  Solution sol;\n`;
        
        question.hidden_test_cases.forEach((test: any, i: number) => {
        const args = test.inputArgs.map((arg: any, j: number) => {
          const overrideType = sig?.paramTypes[j];
          const typeName = overrideType || (Array.isArray(arg) ? inferCppType(arg) : '');

          if (typeName.includes("vector")) {
            return `${typeName} arg${i}_${j} = ${toCppLiteral(arg, overrideType)};`;
          }

          return `auto arg${i}_${j} = ${toCppLiteral(arg, overrideType)};`;
        }).join('\n  ');
          const argNames = test.inputArgs.map((_: any, j: number) => `arg${i}_${j}`).join(', ');
          
          finalCode += `  {\n  ${args}\n`;
          
          if (sig?.returnType === 'void') {
             finalCode += `  sol.${question.function_name}(${argNames});\n`;
             const expType = sig?.paramTypes[0] || (Array.isArray(test.expectedOutput) ? inferCppType(test.expectedOutput) : '');
             finalCode += `  auto expected = ${expType}${toCppLiteral(test.expectedOutput, expType)};\n`;
             finalCode += `  if (arg${i}_0 != expected) {\n    std::cout << "TEST_FAILED\\n";\n    return 1;\n  }\n  }\n`;
          } else {
             finalCode += `  auto res = sol.${question.function_name}(${argNames});\n`;
             const expType = sig?.returnType || (Array.isArray(test.expectedOutput) ? inferCppType(test.expectedOutput) : '');
             finalCode += `  auto expected = ${expType}${toCppLiteral(test.expectedOutput, expType)};\n`;
             finalCode += `  if (res != expected) {\n    std::cout << "TEST_FAILED\\n";\n    return 1;\n  }\n  }\n`;
          }
        });
        
        finalCode += `  std::cout << "ALL_TESTS_PASSED\\n";\n  return 0;\n}\n`;
      } else if (language === 'java') {
        const sig = extractJavaSignature(finalCode, question.function_name);
        
        finalCode = finalCode.replace(/\bclass\s+Main\b/g, "class UserMain");
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
        
        question.hidden_test_cases.forEach((test: any, i: number) => {
          const args = test.inputArgs.map((arg: any, j: number) => {
             const overrideType = sig?.paramTypes[j];
             const typeName = overrideType || inferJavaType(arg);
             return `${typeName} arg${i}_${j} = ${toJavaLiteral(arg, overrideType)};`;
          }).join('\n    ');
          const argNames = test.inputArgs.map((_: any, j: number) => `arg${i}_${j}`).join(', ');
          
          finalCode += `    {\n    ${args}\n`;
          
          if (sig?.returnType === 'void') {
             finalCode += `    sol.${question.function_name}(${argNames});\n`;
             const expType = sig?.paramTypes[0];
             finalCode += `    Object expected = ${toJavaLiteral(test.expectedOutput, expType)};\n`;
             finalCode += `    if (!compare(arg${i}_0, expected)) {\n      System.out.println("TEST_FAILED");\n      System.exit(1);\n    }\n    }\n`;
          } else {
             finalCode += `    Object res = sol.${question.function_name}(${argNames});\n`;
             const expType = sig?.returnType;
             finalCode += `    Object expected = ${toJavaLiteral(test.expectedOutput, expType)};\n`;
             finalCode += `    if (!compare(res, expected)) {\n      System.out.println("TEST_FAILED");\n      System.exit(1);\n    }\n    }\n`;
          }
        });
        
        finalCode += `    System.out.println("ALL_TESTS_PASSED");\n  }\n}\n`;
      }
    }
    if (type === "run" && language === "java") {
      if (!code.includes("public static void main")) {
        finalCode = `
    import java.util.*;

    ${code}

    class Main {
      public static void main(String[] args) {
        System.out.println("Code compiled successfully.");
      }
    }
`    ;
      }
    }
    if (type === "run" && language === "cpp") {
      if (!code.includes("int main(")) {
        finalCode = `
    #include <iostream>
    #include <vector>
    #include <string>

    ${code}

    int main() {
      std::cout << "Code compiled successfully." << std::endl;
      return 0;
    }
    `;
      }
    }

    const startTime = performance.now();

    console.log("========== GENERATED CODE ==========");
    console.log(finalCode);
    console.log("====================================");

    // Call Wandbox API
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        compiler: compiler,
        code: finalCode,
        stdin: stdin || "",
        save: false
      })
    });

    if (!response.ok) {
       throw new Error(`Wandbox API failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("WANDBOX RESPONSE:");
    console.log(JSON.stringify(data, null, 2));
    const endTime = performance.now();

    // Check for compilation errors (for C++ and Java)
    if (data.compiler_error || (data.status !== "0" && !data.program_message && !data.program_error)) {
       return NextResponse.json({
         success: false,
         output: data.compiler_error || data.compiler_message || "Compilation failed.",
         metrics: { time: 0, memory: 0 }
       });
    }

   
    const stdout =
    data.program_output ||
    data.program_message ||
    '';
   
    const stderr =
    data.compiler_error ||
    data.program_error ||
    '';
    const fullOutput = stdout + (stderr ? `\n--- Errors ---\n${stderr}` : '');

    const executionTime = Math.round(endTime - startTime);
    const mockMemory = (Math.random() * 10 + 30).toFixed(1);

    // If it was a submit, check for our custom success flag
    let isSuccess = data.status === "0";
    if (type === "submit") {
       isSuccess = fullOutput.includes("ALL_TESTS_PASSED");
    }

    return NextResponse.json({
      success: isSuccess,
      output: fullOutput.replace("ALL_TESTS_PASSED", "").trim() || (isSuccess ? "Execution finished." : "Failed without output."),
      stderr: stderr,
      metrics: {
        time: executionTime,
        memory: mockMemory
      }
    });

  } catch (error: any) {
    console.error("Code Execution Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
