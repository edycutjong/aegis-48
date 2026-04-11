import { z } from "zod";

export const VulnerabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  lineReference: z.string().nullable(),
  lineStart: z.number().nullable(),
  lineEnd: z.number().nullable(),
  description: z.string(),
  remediation: z.string(),
  cweId: z.string().nullable(),
});

export const AuditReportAnalysisSchema = z.object({
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"]),
  threatScore: z.number().min(0).max(100),
  summary: z.string(),
  vulnerabilities: z.array(VulnerabilitySchema),
});
