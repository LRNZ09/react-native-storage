module.exports = {
	env: {
		jest: true,
	},
	extends: [
		'@lrnz09/eslint-config',
		'@lrnz09/eslint-config/typescript',
		'@lrnz09/eslint-config/react-native',
	],
	parserOptions: {
		project: './tsconfig.json',
	},
	root: true,
}
