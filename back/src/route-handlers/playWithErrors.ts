import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import { ErrorRedis } from "../error-classes/error-redis.js"
import chalk from "chalk"

import { ErrorSuspiciousActivity } from "../error-classes/error-suspicious-activity.js"

const findFirstOccurrence = (string: string, searchElements: string[], fromIndex = 0) => {
  let min = string.length
  for (let i = 0; i < searchElements.length; i += 1) {
    const occ = string.indexOf(searchElements[i], fromIndex)
    if (occ !== -1 && occ < min) {
      min = occ
    }
  }
  return min === string.length ? -1 : min
}

type Func = () => void
type FuncOrNull = Func | null

const functionName = (func: FuncOrNull = null) => {
  if (func) {
    if (func.name) {
      return func.name
    }
    const result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString())
    return result ? result[1] : ""
  }
  const obj: any = {}
  Error.captureStackTrace(obj, functionName)
  const { stack } = obj
  const firstCharacter = stack.indexOf("at ") + 3
  const lastCharacter = findFirstOccurrence(stack, [" ", ":", "\n"], firstCharacter)
  return stack.slice(firstCharacter, lastCharacter)
}

const runWithTimeout = (promise: Promise<any>, timeoutMs: number) => {
  return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("Redis Timeout Exceeded")), timeoutMs))])
}

export const playWithErrors = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Redis Command Wrapper
    // runRedisCommand(
    //   fastify,
    //   async () => {
    //     await fastify.redis.ping()
    //     await fastify.redis.set("SET IF COMMAND IS PRESERVED", `${new Date().toISOString()}`) // Placeholder! Replace this with actual redis command!!!!
    //   },
    //   "userId-12345"
    // )
    //throw new ErrorSuspiciousActivity("testing with error!")
    function extractCodeContext() {
      const original = Error.prepareStackTrace

      try {
        // Error.prepareStackTrace = (_, stack) => stack

        // const err = new Error()
        // const stack = err.stack as unknown as NodeJS.CallSite[]

        // const caller = stack[2] // Skip: [0] this function, [1] Error constructor

        // const callFunction = caller.getFunctionName() || caller.getMethodName()
        // const callFile = caller.getFileName()

        // const callPath = caller.getFileName() // Optional duplicate if needed
        // const callSomething = caller.getFunctionName()
        // // You can also add line/column here!
        // console.log("🌱🌻🔥callFunction", callFunction)
        // console.log("🌱🌻🔥callFile", callFile)
        // console.log("🌱🌻🔥callPath", callPath)
        // console.log("🌱🌻🔥callSomething", callSomething)
        //throw new ErrorSuspiciousActivity("Something suspicious has happened!!", {}, { functionName: "playWithErrors()" })

        throw new ErrorSuspiciousActivity("", "Malformed RPT didn't pass the format check. Less likely a bug than tampered", {
          ip: "192.168.0.1",
        })
      } finally {
        // Always restore to avoid affecting global behavior!
        Error.prepareStackTrace = original
      }
    }
    extractCodeContext()
    const myName = functionName()
    console.log("🌱🥁✨🌷🌸🌻✨", myName)
    try {
      await fastify.pg.connect()
    } catch (err) {
      console.log("pg.connect() just failed and throwing an error!!!!!", err)
      return reply.code(200).send({ message: `${new Date().toISOString()} Postgres is failng to connect!!🔥🔥🔥 ` })
    }
  }
}
