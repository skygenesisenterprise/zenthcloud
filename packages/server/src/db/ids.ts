import { randomBytes } from "node:crypto";

/**
 * Identifier used by organizations and their workspace routes.
 *
 * 16 random bytes rendered as 32 lowercase hexadecimal characters, e.g.
 * `dbc7a507e8a140194d193445ecfdb7cf` for `/dbc7a507e8a140194d193445ecfdb7cf/home`.
 * The format is stable in URLs: no dashes, no mixed case, no URL escaping.
 */
export const generateOrganizationId = () => randomBytes(16).toString("hex");
