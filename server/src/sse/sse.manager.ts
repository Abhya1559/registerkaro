import type { Response } from "express";

const clients = new Map<string, Response[]>();

export function addClient(jobId: string, res: Response) {
  const existing = clients.get(jobId) || [];

  existing.push(res);

  clients.set(jobId, existing);
}

export function removeClient(jobId: string, res: Response) {
  const existing = clients.get(jobId);

  if (!existing) return;

  clients.set(
    jobId,
    existing.filter((client) => client !== res),
  );
}

export function broadcast(jobId: string, event: unknown) {
  const existing = clients.get(jobId);

  if (!existing) return;

  existing.forEach((client) => {
    client.write(`data: ${JSON.stringify(event)}\n\n`);
  });
}
