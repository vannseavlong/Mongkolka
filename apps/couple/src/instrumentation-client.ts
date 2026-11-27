// Runs before React and the router start (see the Next.js file convention), so an editor token leaves the address bar
// before anything else can read it, record it or send the tab somewhere.
import { assistSession } from "@/lib/assist-session";

const capture = () =>
  assistSession.capture(window.location, (url) => window.history.replaceState(window.history.state, "", url));

capture();
// An editor link pasted into an already open tab only changes the fragment; reload so the app starts clean.
window.addEventListener("hashchange", () => {
  if (capture()) window.location.reload();
});
