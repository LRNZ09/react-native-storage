const parseValue = <T>(rawValue: string | null): T | null =>
	rawValue === null ? null : JSON.parse(rawValue)

const stringifyValue = <T>(value: T): string => JSON.stringify(value)

const parseEntries = <T>(
	rawEntries: [string, string | null][],
): [string, T | null][] =>
	rawEntries.map(([key, rawValue]) => [key, parseValue<T>(rawValue)])

const stringifyEntries = <T>(entries: [string, T][]): [string, string][] =>
	entries.map(([key, value]) => [key, stringifyValue<T>(value)])

export { parseValue, stringifyValue, parseEntries, stringifyEntries }
