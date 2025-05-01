import { runPgExists } from "./run-pg-exists.js"
import { runPgModify } from "./run-pg-modify.js"
import { runPgQueryFireAndForget } from "./run-pg-query-fire-and-forget.js"
import { runPgQueryObjOrNull } from "./run-pg-query-obj-or-null.js"
import { runPgTransactionFireAndForget } from "./run-pg-transaction-fire-and-forget.js"
import { runPgTransactionObjOrNull } from "./run-pg-transaction-obj-or-null.js"
/**
 * `runPg` helper series
 *
 * A grouped interface for safe, fault-tolerant PostgreSQL operations.
 * Each helper handles connection acquisition, error logging,
 * and health-check triggering on failure.
 *
 * Categorized into:
 * - `bool`: boolean-returning queries
 *
 * - `query`: single-statement operations
 *
 * - `transaction`: multi-statement atomic operations
 *   ⚠️ Dangerous: Use the callback with care — misuse can trigger false health checks.
 */
export const runPg = {
  bool: {
    exists: runPgExists,
    modify: runPgModify,
  },
  query: {
    fireAndForget: runPgQueryFireAndForget,
    obj: runPgQueryObjOrNull,
  },
  transaction: {
    fireAndForget: runPgTransactionFireAndForget,
    obj: runPgTransactionObjOrNull,
  },
}
