import { DnsRecord, getApiKey, getDns, setDnsRecord } from './transip.ts';
import { sleep } from './sleep.ts';
import { getCurrentIP } from './ipify.ts';

console.log('%cTransIP DDNS fixer', 'color: blue');

console.log('Checking if required files are present...');

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

const watchDnsRecords: { domain: string; name: string; expire: number; type: string }[] = JSON.parse(
	Deno.readTextFileSync('./records.json'),
);

let lastKnownIP = 'unknown';

while (true) {
	try {
		const currentIP = await getCurrentIP();

		if (currentIP !== false && currentIP !== lastKnownIP) {
			const transIpPrivateKey = Deno.readTextFileSync('./transip.key');

			const transIpApiKey = await getApiKey(transIpPrivateKey);

			for (const checkRecord of watchDnsRecords) {
				console.log(
					`Checking %c${checkRecord.type} ${checkRecord.name} ${checkRecord.domain}%c...`,
					'color: yellow',
					'color: initial',
				);

				const domainDnsRecords = await getDns(checkRecord.domain, transIpApiKey);

				const targetRecord = domainDnsRecords.find((record: DnsRecord) =>
					record.name === checkRecord.name && record.type === checkRecord.type
				);

				if (!targetRecord) {
					console.log('Record %cdoes not exist%c!', 'color: red', 'color: initial');
					continue;
				}

				if (targetRecord.content === currentIP) {
					console.log('Record is already %cup to date%c!', 'color: green', 'color: initial');
					continue;
				}

				console.log(
					`The record currently holds %c${targetRecord.content}%c and must be updated...`,
					'color: yellow',
					'color: initial',
				);
				await setDnsRecord(
					checkRecord.domain,
					checkRecord.name,
					checkRecord.expire,
					checkRecord.type,
					currentIP,
					transIpApiKey,
				);
			}

			lastKnownIP = currentIP;
		}
	} catch (error) {
		console.log(`Since an error was thrown, the current IP didn't update. Tying again later...`);
		console.log(error);
	}

	await sleep(60, 'seconds');
}
