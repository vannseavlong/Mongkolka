/**
 * Name for an injected `<style href>` that changes whenever the CSS does. React keeps one stylesheet per href, so a
 * fixed name made a page that was already open keep serving the OLD css after the css was edited (new elements
 * rendered unstyled). Keyed by content, an edit becomes a new stylesheet.
 */
export function styleKey(prefix: string, css: string): string {
  let hash = 5381;
  for (let i = 0; i < css.length; i++) hash = ((hash << 5) + hash + css.charCodeAt(i)) | 0;
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}
