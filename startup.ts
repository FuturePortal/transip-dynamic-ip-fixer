export const startupChecks = async (): Promise<void> => {
	console.log('Checking if required files are present...');

	if (!Deno.env.has('TRANSIP_USERNAME')) {
		console.log('Missing %cTRANSIP_USERNAME%c environment variable.', 'color: red', 'color: initial');
		Deno.exit(1);
	}

	try {
		await Deno.lstat('./transip.key');
		console.log('Found %cTransIP key%c file, good to proceed.', 'color: green', 'color: initial');
	} catch (_error) {
		console.log('Missing %c./transip.key%c file, create it in your TransIP dashboard.', 'color: red', 'color: initial');
		Deno.exit(1);
	}

	try {
		await Deno.lstat('./records.json');
		console.log('Found %cDNS records%c file, good to proceed.', 'color: green', 'color: initial');
	} catch (_error) {
		console.log('Missing %c./records.json%c check the README how to create one.', 'color: red', 'color: initial');
		Deno.exit(1);
	}

	// TODO: validate records
}
