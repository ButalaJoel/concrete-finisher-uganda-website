const parseOrigins = (value) => {
    if (!value) {
        return [];
    }

    return value.split(",").map((entry) => {
        const origin = entry.trim();
        let parsed;

        try {
            parsed = new URL(origin);
        } catch {
            throw new Error("CORS_ORIGINS must contain valid HTTP(S) origins.");
        }

        if (
            !["http:", "https:"].includes(parsed.protocol) ||
            parsed.pathname !== "/" ||
            parsed.search ||
            parsed.hash ||
            parsed.username ||
            parsed.password
        ) {
            throw new Error("CORS_ORIGINS entries must be origins without paths or credentials.");
        }

        return parsed.origin;
    });
};

export const createCorsOptions = (environment = process.env) => {
    const production = environment.NODE_ENV === "production";
    const configuredOrigins = parseOrigins(environment.CORS_ORIGINS);

    if (production && configuredOrigins.length === 0) {
        throw new Error("CORS_ORIGINS must be configured before production startup.");
    }

    const allowedOrigins = new Set(configuredOrigins);

    if (!production) {
        allowedOrigins.add("http://localhost:5173");
        allowedOrigins.add("http://127.0.0.1:5173");
    }

    return {
        origin(origin, callback) {
            // In development, accept the site on any local port
            // (Vite moves to 5174, 5175... when 5173 is busy).
            const isLocalDevOrigin =
                !production &&
                /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

            callback(null, !origin || allowedOrigins.has(origin) || isLocalDevOrigin);
        },
    };
};

export const securityHeaders = (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (!req.path.endsWith("/pdf")) {
        res.setHeader("X-Frame-Options", "DENY");
    }
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000");
    }

    next();
};
