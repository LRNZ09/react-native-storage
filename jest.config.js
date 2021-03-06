module.exports = {
	clearMocks: true,
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	preset: 'react-native',
	modulePathIgnorePatterns: ['<rootDir>/lib/'],
}
