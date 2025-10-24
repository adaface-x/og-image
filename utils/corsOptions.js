// Configure CORS for OG image routes only
const ogImageCorsOptions = {
    origin: function (origin, callback) {
        // Check if CORS restriction is enabled
        const corsEnabled = process.env.ENABLE_CORS_RESTRICTION || false;

        if (!corsEnabled) {
            // CORS restriction disabled, allow all origins
            console.debug(
                "CORS: CORS restriction disabled, allowing all origins"
            );
            return callback(null, true);
        }

        if (!origin) {
            console.debug("CORS: No origin provided, allowing all origins");
            return callback(null, true);
        }

        // Get allowed origins from environment variable
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
            .split(",")
            .map((origin) => origin.trim())
            .filter((origin) => origin.length > 0);

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            console.debug(`CORS: Origin ${origin} is in allowed list`);
            return callback(null, true);
        }

        // Check for wildcard subdomain support (e.g., *.example.com)
        const isAllowed = allowedOrigins.some((allowedOrigin) => {
            if (allowedOrigin.startsWith("*.")) {
                const domain = allowedOrigin.substring(2); // Remove *.
                return origin.endsWith("." + domain) || origin === domain;
            }
            return false;
        });

        if (isAllowed) {
            console.debug(`CORS: Origin ${origin} is in allowed list`);
            return callback(null, true);
        }

        console.debug(`CORS: Blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = {
    ogImageCorsOptions,
};
