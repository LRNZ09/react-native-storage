module.exports = {
	git: {
		commitMessage: 'chore: release ${version}',
		requireBranch: 'main',
		requireCleanWorkingDir: false,
		requireCommits: true,
		tagName: 'v${version}',
	},
	increment: false,
	npm: {
		publish: true,
	},
	plugins: {
		'@release-it/conventional-changelog': {
			preset: 'angular',
		},
	},
}
