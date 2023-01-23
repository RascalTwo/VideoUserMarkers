const simpleGit = require('simple-git');

simpleGit('.')
	.diff(['--cached', 'package.json'])
	.then(diff => {
		const [oldM, newM] = [...diff.matchAll(/.*("version":)([ ])?"([\d]*)\.([\d]*)\.([\d]*)".*/g)];
		if (!oldM || !newM) {
			console.log('package.json version was not updated');
			process.exit(1);
		}

		let shouldBeZero = false;
		for (let i = 2; i <= 5; i++) {
			if (shouldBeZero) {
				if (newM[i] !== '0') {
					console.log('remainder of package.json version should be 0s');
					process.exit(1);
				}
			} else {
				if (oldM[i] === newM[i]) continue;
				if (+newM[i] - +oldM[i] !== 1) {
					console.log('package.json version should be incremented by one');
					process.exit(1);
				}
				shouldBeZero = true;
			}
		}
	});
