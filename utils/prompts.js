export const generateQnaPrompt = ({ role, experience, topics, description }) => `
You are an expert technical interviewer with years of experience hiring for ${role} positions.

Generate exactly 10 interview questions and answers for a ${role} with ${experience} of experience.
Focus on: ${topics.join(', ')}.
${description ? `Extra context: ${description}` : ''}

INSTRUCTIONS:
- Questions must be realistic and commonly asked in real interviews.
- Answers must be detailed, practical, and beginner-friendly where needed.
- Cover a mix of conceptual, practical, and scenario-based questions.
- Output MUST be valid JSON.
- Do NOT wrap in backticks.
- Do NOT add extra text or explanations outside the JSON.

You MUST follow this exact response format in pure JSON:
[
  {
    "question": "string",
    "answer": "string"
  }
]
`;

export const loadMorePrompt = ({ role, experience, topics, existingQuestions }) => `
You are an expert technical interviewer for ${role} positions.

You already generated these interview questions:
${existingQuestions}

Now generate 10 MORE unique questions and answers for a ${role} with ${experience} of experience.
Focus on: ${topics.join(', ')}.

INSTRUCTIONS:
- Do NOT repeat any of the questions listed above.
- Go deeper or cover different angles not yet explored.
- Questions must be realistic and commonly asked in real interviews.
- Answers must be detailed and practical.
- Output MUST be valid JSON.
- Do NOT wrap in backticks.
- Do NOT add extra text or explanations outside the JSON.

You MUST follow this exact response format in pure JSON:
[
  {
    "question": "string",
    "answer": "string"
  }
]
`;

export const learnMorePrompt = ({ topic, role }) => `
You are an expert technical mentor helping a candidate prepare for a ${role} interview.

Explain "${topic}" in depth.

INSTRUCTIONS:
- Keep it practical and interview-focused.
- Use real examples where possible.
- Structure your response with clear sections.
- Use headers and bullet points for readability.
- Explain like you're teaching someone who knows the basics but wants to go deeper.
`;