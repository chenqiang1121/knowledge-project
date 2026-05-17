import type { AppProps } from "next/app";
import { I18nProvider } from "../i18n/I18nContext";

/**
 * Wraps public pages with shared application providers.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
