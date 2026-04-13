import type { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_BASES: Record<string, string> = {
  polkadot: 'https://coretime-polkadot.api.subscan.io',
  kusama: 'https://coretime-kusama.api.subscan.io',
  paseo: 'https://coretime-paseo.api.subscan.io',
  westend: 'https://coretime-westend.api.subscan.io',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { network, endpoint, body } = req.body;

  const base = ALLOWED_BASES[network];
  if (!base || !endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Only allow /api/scan/ and /api/v2/scan/ paths.
  if (!endpoint.startsWith('/api/scan/') && !endpoint.startsWith('/api/v2/scan/')) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (process.env.NEXT_PUBLIC_SUBSCAN_API_KEY) {
    headers['X-API-Key'] = process.env.NEXT_PUBLIC_SUBSCAN_API_KEY;
  }

  try {
    const upstream = await fetch(`${base}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body ?? {}),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Subscan' });
  }
}
