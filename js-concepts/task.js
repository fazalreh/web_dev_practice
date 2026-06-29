// Starter Data
const users = [
  { id: 101, name: " Ada ", scores: [10, 20, 30] },
  { id: 102, name: "", scores: [5, 0, 15] },
  { id: 103, name: null, scores: [7, 14] },
  { id: 104, /* name missing on purpose */ scores: [3, 3, 3, 3] },
  { id: 105, name: "Grace", scores: [] }
];


// =====================================================
// 1. normalizeName(value)
// =====================================================
// Goal:
// - Return "Unknown" if value is:
//   a) null
//   b) undefined
//   c) a string that becomes "" after trim()
//
// Requirements:
// - You must use typeof at least once.
// - You must use trim() at least once.
//
// Hints:
// - Check null separately.
// - Check undefined using typeof.
// - After that, use value.trim().
// - If value.trim() is "", return "Unknown".
// - Otherwise return value.trim().

function normalizeName(value) {
  // TODO 1A: Check if value is null.
  // If yes, return "Unknown".
  if (value === null) {
    return "Unknown";
  }

  // TODO 1B: Check if value is undefined using typeof.
  // If yes, return "Unknown".
  if (typeof value === "undefined") {
    return "Unknown";
  }

  // TODO 1C: Use trim() on value.
  // Store the trimmed result in a variable.
  const trimmedValue = value.trim();

  // TODO 1D: If the trimmed value is an empty string, return "Unknown".
    if (trimmedValue === "") {
    return "Unknown";
  }
  // TODO 1E: Otherwise, return the trimmed value.
    return trimmedValue;
}


// =====================================================
// 2. averageScore(scores)
// =====================================================
// Goal:
// - If scores is not an array, throw this exact error:
//   Error("scores must be an array")
//
// - If scores is an empty array, return null.
//
// - Otherwise calculate the average and round it to 2 decimals.
//
// Requirements:
// - Must use Array.isArray().
// - Must use Math.round() or equivalent math rounding.
//
// Formula:
// average = total / numberOfScores
//
// Rounding trick:
// Math.round(average * 100) / 100

function averageScore(scores) {
  // TODO 2A: Use Array.isArray(scores).
  // If false, throw new Error("scores must be an array").
  if (!Array.isArray(scores)) {
    throw new Error("scores must be an array");
  }

  // TODO 2B: If scores.length is 0, return null. 
  if (scores.length === 0) {
    return null;
  }
  // TODO 2C: Create a total variable starting at 0.
  let total = 0;
  // TODO 2D: Loop through scores and add each score to total.
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  // TODO 2E: Divide total by scores.length to get average.
    const average = total / scores.length;
  // TODO 2F: Return the average rounded to 2 decimals.
  return Math.round(average * 100) / 100;
}


// =====================================================
// 3. buildUserSummary(user)
// =====================================================
// Goal:
// - If user is not a non-null object, throw this exact error:
//   Error("user must be an object")
//
// Return an object like:
// {
//   id: ...,
//   name: ...,
//   scoreCount: ...,
//   avg: ...
// }
//
// Rules:
// - id comes from user.id.
// - name comes from normalizeName(user.name).
// - scoreCount is the number of scores.
// - If scores is missing or not an array, scoreCount should be 0.
// - avg comes from averageScore(scores).
// - If scores is missing or not an array, treat scores as [] so avg becomes null.
//
// Requirements:
// - Must use dot notation at least once.
// - Must use bracket notation at least once.
//
// Dot notation example:
// user.id
//
// Bracket notation example:
// user["scores"]

function buildUserSummary(user) {
  // TODO 3A: Check if user is not an object OR user is null.
  // If invalid, throw new Error("user must be an object").
  if (typeof user !== "object" || user === null) {
    throw new Error("user must be an object");
  }

  // TODO 3B: Get scores.
  // If user["scores"] is an array, use it.
  // Otherwise, use an empty array [].
  const scores = Array.isArray(user["scores"]) ? user["scores"] : [];

  // TODO 3C: Return an object with:
  // id: user.id
  // name: normalizeName(user.name)
  // scoreCount: scores.length
  // avg: averageScore(scores)
    return {
    id: user.id,
    name: normalizeName(user.name),
    scoreCount: scores.length,
    avg: averageScore(scores)
  };
}


// =====================================================
// 4. summarizeUsers(userArray)
// =====================================================
// Goal:
// - If userArray is not an array, throw this exact error:
//   Error("userArray must be an array")
//
// - Return userArray.map(buildUserSummary).
//
// Requirement:
// - Must use map().

function summarizeUsers(userArray) {
  // TODO 4A: Check if userArray is not an array.
  // If invalid, throw new Error("userArray must be an array").
  if (!Array.isArray(userArray)) {
    throw new Error("userArray must be an array");
  }

  // TODO 4B: Use map() to apply buildUserSummary to every user.
  // Return the result.
  return userArray.map(buildUserSummary);
}


// =====================================================
// 5. safeSummarizeUsers(userArray)
// =====================================================
// Goal:
// - Use try/catch around summarizeUsers.
//
// If summarizeUsers works, return:
// {
//   ok: true,
//   data: result
// }
//
// If summarizeUsers throws an error, return:
// {
//   ok: false,
//   error: "<message>"
// }
//
// Hint:
// - Inside catch, the error message is usually e.message.

function safeSummarizeUsers(userArray) {
  // TODO 5A: Start a try block.
  try {

  // TODO 5B: Inside try, call summarizeUsers(userArray).
  // Store the result.
    const result = summarizeUsers(userArray);

  // TODO 5C: Return { ok: true, data: result }.
    return { ok: true, data: result };

  // TODO 5D: Add a catch block.
  } catch (e) {

  // TODO 5E: Inside catch, return { ok: false, error: e.message }.
    return { ok: false, error: e.message };
  }
}


// =====================================================
// 6. getUserDisplayNameById(userArray, id)
// =====================================================
// Goal:
// - If userArray is not an array, throw:
//   Error("userArray must be an array")
//
// - If id is not a number, throw:
//   Error("id must be a number")
//
// - Use find() to locate the user whose id matches.
//
// - If no user is found, throw:
//   Error("user not found")
//
// - Return normalizeName(found.name).
//
// Requirement:
// - Must use find().

function getUserDisplayNameById(userArray, id) {
  // TODO 6A: Check if userArray is not an array.
  // If invalid, throw new Error("userArray must be an array").
  if (!Array.isArray(userArray)) {
    throw new Error("userArray must be an array");
  }

  // TODO 6B: Check if id is not a number using typeof.
  // If invalid, throw new Error("id must be a number").
  if (typeof id !== "number") {
    throw new Error("id must be a number");
  }

  // TODO 6C: Use find() to search for the user with matching id.
  const found = userArray.find((user) => user.id === id);

  // TODO 6D: If no user is found, throw new Error("user not found").
  if (!found) {
    throw new Error("user not found");
  }

  // TODO 6E: Return normalizeName(found.name).
  return normalizeName(found.name);
}


// =====================================================
// Part C answers
// =====================================================

// 1) typeof undefined =
// Write your answer here as a comment.

// 2) typeof null =
// Write your answer here as a comment.

// 3) Why treat "" differently than null/undefined in normalizeName conceptually?
// Write your explanation here as a comment.


// =====================================================
// Required test calls
// Fill in the expected output comments yourself after testing.
// =====================================================

console.log(normalizeName(" Ada "));               
// expected:

console.log(normalizeName("   "));                 
// expected:

console.log(normalizeName(null));                  
// expected:

console.log(averageScore([10, 20, 30]));           
// expected:

console.log(averageScore([]));                     
// expected:

console.log(buildUserSummary(users[0]));           
// expected:

console.log(buildUserSummary(users[3]));           
// expected:

console.log(safeSummarizeUsers(users).ok);         
// expected:

console.log(getUserDisplayNameById(users, 105));   
// expected:

console.log(safeSummarizeUsers("not an array"));   
// expected:
