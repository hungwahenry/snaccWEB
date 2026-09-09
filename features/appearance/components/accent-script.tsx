import { ACCENTS } from "../utils/accents"
import { accentCss, ACCENT_STYLE_ID } from "../utils/accent-css"

const CSS_BY_KEY = Object.fromEntries(
  ACCENTS.map((accent) => [accent.key, accentCss(accent)])
)

/**
 * Paints the saved accent before the first frame.
 *
 * The accent lives in localStorage, which a server render cannot see, so React would otherwise
 * render the default and swap on hydration — a visible flash of the wrong colour on every load.
 * The same trick next-themes uses for dark mode, for the same reason.
 *
 * It always leaves the node behind, empty or not, so the client has one thing to keep in step.
 */
export function AccentScript() {
  const script = `(function(){try{
var s=document.createElement("style");
s.id=${JSON.stringify(ACCENT_STYLE_ID)};
s.textContent=(${JSON.stringify(CSS_BY_KEY)}[localStorage.getItem("snacc_accent")])||"";
document.head.appendChild(s);
}catch(e){}})()`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
