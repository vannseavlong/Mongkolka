import type { AssistActivity } from "../data/assist-api";
import { activityText } from "../lib/assist-state";

const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

/** Latest help activity, so a couple can see what the team did on their site. */
export function AssistActivityList({ activity }: { activity: AssistActivity[] }) {
  if (activity.length === 0) return null;
  return (
    <section aria-labelledby="assist-activity-title" className="border-t pt-4">
      <p id="assist-activity-title" className="mb-2 text-sm font-medium">
        Recent activity
      </p>
      <ul className="flex flex-col gap-1.5 text-sm">
        {activity.map((a, i) => (
          <li key={`${a.at.toISOString()}-${i}`} className="flex flex-wrap justify-between gap-x-3">
            <span>{activityText(a)}</span>
            <time dateTime={a.at.toISOString()} className="text-xs text-muted-foreground">
              {when.format(a.at)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
