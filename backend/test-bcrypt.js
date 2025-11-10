import bcrypt from "bcryptjs";

const test = async () => {
  const entered = "abcd1234";
  const storedHash = "$2a$10$qENwuV2mZL0yE1YlZrYhC.1Cnq5KnmCvQXz/YyYD7IOXF3NI2CFYO";

  const match = await bcrypt.compare(entered, storedHash);
  console.log("Compare result:", match ? "✅ Match" : "❌ Mismatch");
};

test();
