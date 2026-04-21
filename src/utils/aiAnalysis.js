export async function analyzeRule(ruleId, ruleText, insurerRationale, category, insurerName, dateSubmitted) {
  const prompt = `ROLE: You are an expert regulatory analyst evaluating auto insurance underwriting decline rules for compliance with Ontario insurance regulations, consumer protection principles, and fairness standards.

CONTEXT:
You are reviewing the following proposed decline rule:

RULE ID: ${ruleId}
INSURER: ${insurerName}
DATE SUBMITTED: ${dateSubmitted}
PROPOSED RULE: ${ruleText}
INSURER'S RATIONALE: ${insurerRationale}
RULE CATEGORY: ${category}

EVALUATION CRITERIA:
You must assess this rule against the following regulatory framework:

1. LEGISLATIVE COMPLIANCE
   - Does it comply with the Insurance Act, UDAP, Human Rights Code, and Canadian Charter of Rights and Freedoms?
   - Does it violate any protected grounds (age, race, ethnicity, national origin, disability, language, etc.)?

2. FAIR CONSUMER OUTCOMES PRINCIPLES
   - Accurate Pricing and Underwriting: Is it based on relevant risk factors?
   - Absence of Unfair Discrimination: Does it avoid direct or indirect discrimination?
   - Accessible Products: Does it unfairly limit access to essential coverage?
   - Clear Consumer Communications: Is the language clear and unambiguous?

3. ACTUARIAL SOUNDNESS AND RISK RELEVANCE
   - Is there a direct, demonstrable link between the criterion and insurance risk?
   - Is it supported by actuarial data or analysis (stated or implied)?
   - Is it subjective or arbitrary?

4. CLARITY AND SPECIFICITY
   - Is the rule clearly defined with no room for multiple interpretations?
   - Are all terms and thresholds specific and measurable?

5. PUBLIC POLICY ALIGNMENT
   - Does this rule conflict with consumer protection priorities?
   - Could it create barriers for vulnerable populations?
   - Does it feel appropriate from a fairness perspective?

TASK:
Provide a structured analysis in JSON format with the following sections:

1. EXTRACTED_DETAILS
   {
     "who_affected": "Clear description of the population this rule targets",
     "conditions": "Specific triggers that activate the decline",
     "stated_rationale": "Insurer's justification",
     "category": "Rule category"
   }

2. CRITERION_ASSESSMENT
   For each criterion, provide:
   {
     "legislative_compliance": {
       "status": "MEETS" or "FAILS" or "NEEDS_CLARIFICATION",
       "reasoning": "2-3 sentence explanation of why",
       "supporting_evidence": "Reference to data, precedent, or principle"
     },
     "fair_consumer_outcomes": { ... },
     "actuarial_soundness": { ... },
     "clarity_specificity": { ... },
     "public_policy": { ... }
   }

3. SIMILAR_RULES
   [
     {
       "rule_id": "DR-XXX",
       "similarity_score": 0.85,
       "why_similar": "Explanation of commonality",
       "key_difference": "How this case differs (if applicable)",
       "precedent_outcome": "Approved or Rejected"
     }
   ]

4. FLAGGED_CONCERNS
   [
     {
       "concern_type": "Vague Language" | "Consumer Fairness" | "Inconsistency" | "Human Rights" | "Not Risk-Relevant",
       "description": "Specific issue identified",
       "severity": "High" | "Medium" | "Low"
     }
   ]

5. RECOMMENDATION
   {
     "decision": "APPROVE" | "REJECT" | "REQUEST_MORE_INFO",
     "confidence": "High" | "Medium" | "Low",
     "reasoning": "3-5 sentence explanation grounded in the criteria",
     "next_steps": "What should the analyst do next?"
   }

CRITICAL GUIDELINES:
- Be specific and evidence-based. Reference actual criteria, not generalizations.
- Flag consumer fairness issues prominently—these are high-priority concerns.
- If the rule involves protected characteristics (age, race, disability, language, national origin), scrutinize carefully for discrimination.
- Vague language is a common rejection reason. If terms are undefined or ambiguous, flag it.
- Consider precedent, but don't rubber-stamp. Each case requires independent evaluation.
- If you're uncertain, recommend REQUEST_MORE_INFO with specific questions to ask the insurer.

OUTPUT FORMAT: Valid JSON only. No preamble, no markdown code fences, just the JSON object.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  return JSON.parse(content);
}
