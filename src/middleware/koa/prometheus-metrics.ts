import { Context } from 'koa'
import * as promClient from 'prom-client'

export default function prometheusMetricsFactory({
  client = promClient,
  collectDefaultMetrics = true,
  timeout = 10000,
  defaultLabels = {},
} = {}) {
  if (collectDefaultMetrics) {
    client.collectDefaultMetrics({ timeout })
  }

  if (Object.keys(defaultLabels).length) {
    client.register.setDefaultLabels(defaultLabels)
  }

  return async function prometheusMetrics(ctx: Context) {
    ctx.set('Content-Type', client.register.contentType)
    ctx.body = client.register.metrics()
  }
}
