import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

// Skip the CMS admin, every API route, Next internals and files with an extension.
export const config = { matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"] };
