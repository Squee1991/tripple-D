import * as Sentry from "@sentry/nuxt";

Sentry.init({
    dsn: "https://d3637d8568743823f7071ca9c962f301@o4511395970547712.ingest.de.sentry.io/4511395993944144",
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.inboundFiltersIntegration({ disableErrorDefaults: true }),
    ],

    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: true,
});
