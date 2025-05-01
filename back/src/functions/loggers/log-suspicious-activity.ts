import chalk from "chalk"
import { ErrorSuspiciousActivity } from "../../error-classes/error-suspicious-activity.js"

export const logSuspiciousActivity = (err: ErrorSuspiciousActivity) => {
  const country = err.suspiciousActor.geoLocation?.country || "-"
  const city = err.suspiciousActor.geoLocation?.city || "-"
  const region = err.suspiciousActor.geoLocation?.region || "-"
  const lat = err.suspiciousActor.geoLocation?.lat || "-"
  const lon = err.suspiciousActor.geoLocation?.lon || "-"
  const geoloation = `[${country}/${city}/${region}],[lat:${lat},lon:${lon}]`

  return console.error(`
        ----------------------------------------------------
        ${chalk.hex("#ff5733")("[ERROR]".padEnd(24))}${chalk.hex("#ff5733")(`Suspicious user activity is detected.`)}
        ${chalk.hex("#ff5733")("[TIMESTAMP]".padEnd(24))}${err.timestamp}
        ${chalk.hex("#ff5733")("[MESSAGE]".padEnd(24))}${err.message}
        ----------------------------------------------------
        ${chalk.yellow("[IP]".padEnd(24))}${chalk.red(`${err.suspiciousActor.ip || `-`}`)}
        ${chalk.yellow("[USER AGENT]".padEnd(24))}${err.suspiciousActor.userAgent || `-`}
        ${chalk.yellow("[GEO LOCATIION]".padEnd(24))}${geoloation}
        ${chalk.yellow("[BROWSER ID]".padEnd(24))}${err.suspiciousActor.browserId || `-`}
        ${chalk.yellow("[IDENTITY]".padEnd(24))}${err.suspiciousActor.identity || `-`}
        ----------------------------------------------------
        ${chalk.gray("[PATH/FILE]".padEnd(24))}${err.context.file || `-`}
        ${chalk.gray("[FUNCTION NAME]".padEnd(24))}${err.context.functionName || `-`}
        ----------------------------------------------------
`)
}
