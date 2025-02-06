import crypto from 'node:crypto';

export type DnsRecord = {
	name: string;
	expire: number;
	type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'SRV' | 'SSHFP' | 'TLSA' | 'CAA' | 'NAPTR';
	content: string;
};

export const getApiKey = async (transIpKey: string): Promise<string> => {
	const nonce = crypto.randomBytes(10).toString('hex');

	const request = {
		'login': 'rvanderstaaij',
		nonce,
		'read_only': false,
		'expiration_time': '50 seconds',
		'label': `TransIP DDNS fixer`,
		'global_key': true,
	};

	const requestString = JSON.stringify(request);

	const signer = crypto.createSign('sha512');
	signer.update(requestString, 'utf8');
	const signature = signer.sign(transIpKey, 'base64');

	const response = await fetch('https://api.transip.nl/v6/auth', {
		method: 'POST',
		headers: { Signature: signature },
		body: requestString,
	});

	if (response.status !== 201) {
		console.log(
			'%cFailed%c to get an %cTransIP bearer token%c.',
			'color: red',
			'color: initial',
			'color: yellow',
			'color: initial',
		);

		if (response.headers.get('content-type') === 'application/json') {
			const errorBody = await response.json();

			console.log(errorBody);
		}

		throw 'Failed.';
	}

	const auth = await response.json();

	return auth['token'];
};

export const getDns = async (domain: string, key: string): Promise<DnsRecord[]> => {
	const response = await fetch(`https://api.transip.nl/v6/domains/${domain}/dns`, {
		headers: { Authorization: `Bearer ${key}` },
	});

	if (response.status !== 200) {
		return [];
	}

	const dns = await response.json();

	return dns.dnsEntries;
};

export const setDnsRecord = async (
	domain: string,
	name: string,
	expire: number,
	type: string,
	content: string,
	key: string,
): Promise<boolean> => {
	const response = await fetch(`https://api.transip.nl/v6/domains/${domain}/dns`, {
		headers: { Authorization: `Bearer ${key}` },
		method: 'PATCH',
		body: JSON.stringify({
			dnsEntry: {
				name,
				expire,
				type,
				content,
			},
		}),
	});

	if (response.status !== 204) {
		console.log(
			'%cFailed%c to set %c${type} ${name} ${domain}%c to %c${content}%c.',
			'color: red',
			'color: initial',
			'color: yellow',
			'color: initial',
			'color: yellow',
			'color: initial',
		);
		return false;
	}

	console.log(
		`%cSuccesfully%c set %c${type} ${name} ${domain}%c to %c${content}%c.`,
		'color: green',
		'color: initial',
		'color: blue',
		'color: initial',
		'color: blue',
		'color: initial',
	);
	return true;
};
