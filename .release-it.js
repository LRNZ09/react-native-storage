module.exports = {
	git: {
		commitMessage: 'chore: release ${version}',
		requireBranch: 'main',
		requireCleanWorkingDir: true,
		// requireCommits: true,
		tagName: 'v${version}',
	},
	github: {
		release: true,
	},
	npm: {
		publish: true,
	},
	plugins: {
		'@release-it/conventional-changelog': {
			preset: 'angular',
		},
	},
}
