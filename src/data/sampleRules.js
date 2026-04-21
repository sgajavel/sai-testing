export const sampleRules = [
  {
    id: 'DR-001',
    insurer: 'Lakefield Mutual',
    dateSubmitted: '2024-09-12',
    ruleText: 'Decline to insure any applicant with 3 or more at-fault accidents in the preceding 3 years.',
    insurerRationale: 'Historical claims data demonstrates a strong correlation between multiple at-fault accidents and future claims frequency. This threshold reflects an unacceptable level of demonstrated risk.',
    category: 'Driving Record',
    status: 'pending'
  },
  {
    id: 'DR-005',
    insurer: 'Clearwater General Insurance',
    dateSubmitted: '2024-07-30',
    ruleText: 'Decline to insure any applicant whose primary language is not English or French.',
    insurerRationale: 'Communication barriers may result in inaccurate policy information and increased disputes. Ensuring clear communication protects both the insurer and the consumer.',
    category: 'Demographic',
    status: 'pending'
  },
  {
    id: 'DR-007',
    insurer: 'Maplewood Mutual',
    dateSubmitted: '2024-10-18',
    ruleText: 'Decline to insure any applicant under the age of 21.',
    insurerRationale: 'Drivers under 21 represent a statistically higher-risk group. Our portfolio cannot sustain the loss ratios associated with this demographic without jeopardizing the affordability of premiums for other policyholders.',
    category: 'Demographic',
    status: 'pending'
  },
  {
    id: 'DR-012',
    insurer: 'Northern Shield Insurance',
    dateSubmitted: '2024-10-14',
    ruleText: 'Decline to insure any vehicle used on a racetrack or in any organized race, speed test, or competition.',
    insurerRationale: 'Vehicles used in racing or speed competitions are exposed to extreme mechanical stress and collision risk that falls outside the scope of standard personal auto coverage.',
    category: 'Vehicle Use',
    status: 'pending'
  },
  {
    id: 'DR-017',
    insurer: 'Maplewood Mutual',
    dateSubmitted: '2024-10-25',
    ruleText: 'Decline to insure any applicant who has received social assistance or disability benefits within the preceding 12 months.',
    insurerRationale: 'Applicants receiving social assistance may face financial pressures that increase the likelihood of premium non-payment and policy lapse, creating administrative cost and coverage gaps.',
    category: 'Financial / Demographic',
    status: 'pending'
  },
  {
    id: 'DR-028',
    insurer: 'Lakeshore Indemnity',
    dateSubmitted: '2024-08-28',
    ruleText: 'Decline to insure any applicant born outside of Canada.',
    insurerRationale: 'Applicants born outside Canada may have driving experience in jurisdictions with different road rules and safety standards, making risk assessment less reliable.',
    category: 'Demographic',
    status: 'pending'
  },
  {
    id: 'DR-031',
    insurer: 'Clearwater General Insurance',
    dateSubmitted: '2024-11-19',
    ruleText: 'Decline to insure any applicant who has filed 3 or more not-at-fault claims in the preceding 5 years.',
    insurerRationale: 'While individual not-at-fault claims do not indicate driver error, a pattern of frequent claims regardless of fault correlates with higher future claims frequency in our data.',
    category: 'Claims History',
    status: 'pending'
  },
  {
    id: 'DR-033',
    insurer: 'Lakefield Mutual',
    dateSubmitted: '2024-08-14',
    ruleText: 'Decline to insure any applicant with an improper class of licence for the vehicle to be insured, or whose licence is currently invalid or expired.',
    insurerRationale: 'Operating a vehicle without a valid and appropriate licence is a legal violation and voids the basis of the insurance contract.',
    category: 'Licensing',
    status: 'pending'
  },
  {
    id: 'DR-034',
    insurer: 'Grandview Insurance Group',
    dateSubmitted: '2024-10-29',
    ruleText: 'Decline to insure any applicant who has been the subject of a restraining order within the preceding 3 years.',
    insurerRationale: 'Restraining orders may indicate behavioural patterns associated with impulsivity and risk-taking, which correlate with elevated driving risk.',
    category: 'Behavioural / Legal',
    status: 'pending'
  },
  {
    id: 'DR-038',
    insurer: 'Lakeshore Indemnity',
    dateSubmitted: '2024-07-18',
    ruleText: 'Decline to insure any applicant over the age of 80.',
    insurerRationale: 'Drivers over 80 experience age-related declines in reaction time, vision, and cognitive processing that are well documented in medical literature and reflected in our claims data.',
    category: 'Demographic',
    status: 'pending'
  },
  {
    id: 'DR-042',
    insurer: 'Northern Shield Insurance',
    dateSubmitted: '2024-11-27',
    ruleText: 'Decline to insure any applicant who has been charged with but not convicted of a Criminal Code offence related to driving within the preceding 3 years.',
    insurerRationale: 'Criminal charges, even without conviction, indicate involvement in serious driving incidents that elevate risk. Waiting for conviction outcomes would leave us exposed during the interim period.',
    category: 'Legal / Driving Record',
    status: 'pending'
  },
  {
    id: 'DR-044',
    insurer: 'Grandview Insurance Group',
    dateSubmitted: '2024-09-19',
    ruleText: 'Decline to insure any applicant who has outstanding unpaid premiums owed to our company or any of our affiliated companies.',
    insurerRationale: 'Outstanding premium debt represents a direct financial obligation to the insurer. Issuing a new policy while prior obligations remain unpaid is not commercially reasonable.',
    category: 'Payment History',
    status: 'pending'
  },
  {
    id: 'DR-045',
    insurer: 'Beacon Fire & Casualty',
    dateSubmitted: '2024-10-08',
    ruleText: 'Decline to insure any applicant whose surname matches a name on a federal sanctions or watchlist.',
    insurerRationale: 'Compliance with federal anti-money laundering and sanctions requirements is a legal obligation. Name matches warrant a decline pending further verification.',
    category: 'Legal / Compliance',
    status: 'pending'
  },
  {
    id: 'DR-002',
    insurer: 'Northern Shield Insurance',
    dateSubmitted: '2024-10-03',
    ruleText: 'Decline to insure any applicant who has had their licence suspended for impaired driving within the preceding 5 years.',
    insurerRationale: 'Impaired driving suspensions are a strong predictor of future high-severity claims. A 5-year lookback period reflects the sustained elevated risk profile.',
    category: 'Driving Record',
    status: 'pending'
  },
  {
    id: 'DR-013',
    insurer: 'Lakefield Mutual',
    dateSubmitted: '2024-07-09',
    ruleText: 'Decline to insure any applicant who has changed insurance providers more than 3 times in the preceding 2 years.',
    insurerRationale: 'Frequent switching may indicate adverse selection behaviour, where the applicant is seeking coverage only when they anticipate a claim or is being non-renewed by other carriers for undisclosed reasons.',
    category: 'Behavioural',
    status: 'pending'
  }
];
