import { describe, expect, it } from 'vitest';
import { calculateTrustScore } from './trust.js';

describe('Explainable rule-based catch trust engine', () => {
  it('returns VERIFIED for a valid catch', () => {
    const result = calculateTrustScore({
      gpsValid: true,
      zoneAllowed: true,
      quotaValid: true,
      quantityNormal: true,
      temporalPlausible: true,
      weatherPlausible: true,
      duplicateDetected: false,
      priorViolations: 0,
    });

    expect(result.status).toBe('VERIFIED');
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.rules.length).toBeGreaterThan(0);
  });

  it('flags a restricted-zone catch for review', () => {
    const result = calculateTrustScore({
      gpsValid: true,
      zoneAllowed: false,
      quotaValid: true,
      quantityNormal: true,
      temporalPlausible: true,
      weatherPlausible: true,
      duplicateDetected: false,
      priorViolations: 0,
    });

    expect(result.status).toBe('REVIEW');
    expect(result.score).toBeLessThan(80);
  });

  it('flags quota overrun as suspicious', () => {
    const result = calculateTrustScore({
      gpsValid: true,
      zoneAllowed: true,
      quotaValid: false,
      quantityNormal: true,
      temporalPlausible: true,
      weatherPlausible: true,
      duplicateDetected: false,
      priorViolations: 0,
    });

    expect(result.status).toBe('SUSPICIOUS');
  });

  it('detects duplicate submissions as suspicious', () => {
    const result = calculateTrustScore({
      gpsValid: true,
      zoneAllowed: true,
      quotaValid: true,
      quantityNormal: true,
      temporalPlausible: true,
      weatherPlausible: true,
      duplicateDetected: true,
      priorViolations: 0,
    });

    expect(result.status).toBe('SUSPICIOUS');
  });
});
