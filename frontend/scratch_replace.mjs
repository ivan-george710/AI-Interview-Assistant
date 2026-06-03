const userCode = `
class Main {
    public static void main(String[] args) {
`;

console.log(userCode.replace(/\\bclass\\s+Main\\b/g, "class UserMain"));
