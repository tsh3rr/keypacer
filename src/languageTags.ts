/**
 * The language of `ids` a browser language tag stands for: the tag itself
 * (any case), else its primary subtag ("de-AT" is "de"). Portuguese comes in
 * two variants: Brazil for "pt" and "pt-BR", Portugal for every other region
 * (Angola, Mozambique, … write the European way).
 */
export function matchLanguage<T extends string>(tag: string, ids: readonly T[]): T | undefined {
  const lower = tag.toLowerCase();
  const exact = ids.find((id) => id.toLowerCase() === lower);
  if (exact) return exact;
  const [primary, region] = lower.split('-');
  const want = primary === 'pt' ? (region === undefined || region === 'br' ? 'pt-br' : 'pt-pt') : primary;
  return ids.find((id) => id.toLowerCase() === want);
}
