module.exports = {
	apps: [
		{
			name: 'example-core',
			script: './dist/src/main.js',
			instances: 1,
			exec_mode: 'cluster',
			watch: false,
			ignore_watch: ['node_modules'],
		},
	],
};
