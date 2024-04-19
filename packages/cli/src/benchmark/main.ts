import 'reflect-metadata';
import { globalHooks } from './hooks';

/* eslint-disable import/no-extraneous-dependencies */
import { withCodSpeed } from '@codspeed/tinybench-plugin';
import Bench from 'tinybench';
import { collectSuites, registerSuites, suiteCount } from './lib/suites';
/* eslint-enable import/no-extraneous-dependencies */

export { beforeEach, task } from './lib/suites';

async function main() {
	await collectSuites();

	const count = suiteCount();

	if (count === 0) {
		console.log('No benchmarking suites found');
		return;
	}

	await globalHooks.setup();

	const _bench = new Bench({
		time: 0, // @TODO: Temp value
		iterations: 1, // @TODO: Temp value
	});

	const bench = process.env.CI === 'true' ? withCodSpeed(_bench) : _bench;

	registerSuites(bench);

	console.log(`Running ${count} benchmarking suites...`);

	await bench.run();

	console.table(bench.table());

	await globalHooks.teardown();
}

void main();