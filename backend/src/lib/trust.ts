type RuleResult = {
  rule: string;
  contribution: number;
  status: string;
  explanation: string;
};

export function getTrustStatus(score: number) {
  if (score >= 80) return 'VERIFIED';
  if (score >= 60) return 'REVIEW';
  return 'SUSPICIOUS';
}

export function calculateTrustScore(params: {
  gpsValid: boolean;
  zoneAllowed: boolean;
  quotaValid: boolean;
  quantityNormal: boolean;
  temporalPlausible: boolean;
  weatherPlausible: boolean;
  duplicateDetected: boolean;
  priorViolations: number;
}) {
  let total = 0;
  const rules: RuleResult[] = [];

  if (params.gpsValid) {
    total += 15;
    rules.push({ rule: 'GPS VALID', contribution: 15, status: 'PASS', explanation: 'Location is valid and captured with a coherent coordinate pair.' });
  } else {
    total -= 20;
    rules.push({ rule: 'GPS VALID', contribution: -20, status: 'FAIL', explanation: 'Location is missing or invalid.' });
  }

  if (params.zoneAllowed) {
    total += 20;
    rules.push({ rule: 'ZONE COMPATIBLE', contribution: 20, status: 'PASS', explanation: 'Catch is within a permitted fishing zone.' });
  } else {
    total -= 25;
    rules.push({ rule: 'ZONE COMPATIBLE', contribution: -25, status: 'FAIL', explanation: 'Catch took place in a restricted or incompatible zone.' });
  }

  if (params.quotaValid) {
    total += 20;
    rules.push({ rule: 'QUOTA VALID', contribution: 20, status: 'PASS', explanation: 'Catch is within available quota for the season.' });
  } else {
    total -= 30;
    rules.push({ rule: 'QUOTA VALID', contribution: -30, status: 'FAIL', explanation: 'Catch exceeds the available quota or violates seasonal capacity.' });
  }

  if (params.quantityNormal) {
    total += 15;
    rules.push({ rule: 'QUANTITY NORMAL', contribution: 15, status: 'PASS', explanation: 'Quantity is consistent with the fisher history and expected range.' });
  } else {
    total -= 20;
    rules.push({ rule: 'QUANTITY NORMAL', contribution: -20, status: 'FAIL', explanation: 'Quantity deviates significantly from the fisher’s historical pattern.' });
  }

  if (params.temporalPlausible) {
    total += 10;
    rules.push({ rule: 'TEMPORAL PLAUSIBLE', contribution: 10, status: 'PASS', explanation: 'Catch time appears reasonable for the fishing activity.' });
  } else {
    total -= 15;
    rules.push({ rule: 'TEMPORAL PLAUSIBLE', contribution: -15, status: 'FAIL', explanation: 'Catch timestamp does not match a plausible fishing window.' });
  }

  if (params.weatherPlausible) {
    total += 10;
    rules.push({ rule: 'WEATHER CONSISTENT', contribution: 10, status: 'PASS', explanation: 'Weather conditions are broadly consistent with active fishing conditions.' });
  } else {
    total -= 10;
    rules.push({ rule: 'WEATHER CONSISTENT', contribution: -10, status: 'FAIL', explanation: 'Weather conditions are inconsistent with safe or plausible fishing activity.' });
  }

  if (params.duplicateDetected) {
    total -= 25;
    rules.push({ rule: 'DUPLICATE DETECTION', contribution: -25, status: 'FAIL', explanation: 'A nearly identical catch record has already been submitted.' });
  } else {
    total += 10;
    rules.push({ rule: 'DUPLICATE DETECTION', contribution: 10, status: 'PASS', explanation: 'No duplicate catch pattern was detected.' });
  }

  if (params.priorViolations > 0) {
    total -= Math.min(20, params.priorViolations * 8);
    rules.push({ rule: 'HISTORICAL COMPLIANCE', contribution: -Math.min(20, params.priorViolations * 8), status: 'FAIL', explanation: `The fisher has ${params.priorViolations} prior compliance issue(s).` });
  } else {
    total += 10;
    rules.push({ rule: 'HISTORICAL COMPLIANCE', contribution: 10, status: 'PASS', explanation: 'No repeated compliance issues were observed for this fisher.' });
  }

  const finalScore = Math.max(0, Math.min(100, total));
  let status = getTrustStatus(finalScore);

  if (params.duplicateDetected || !params.quotaValid) {
    status = 'SUSPICIOUS';
  } else if (!params.zoneAllowed) {
    status = 'REVIEW';
  }

  return {
    score: finalScore,
    status,
    rules,
  };
}
