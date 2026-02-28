import { BigQuery } from "@google-cloud/bigquery";

let bigqueryClient: BigQuery | null = null;

export function getBigQueryClient(): BigQuery {
  if (!bigqueryClient) {
    const keyJson = process.env.GCP_SERVICE_ACCOUNT_KEY;
    if (!keyJson) {
      throw new Error("GCP_SERVICE_ACCOUNT_KEY environment variable is not set");
    }

    const credentials = JSON.parse(keyJson);

    bigqueryClient = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      credentials,
    });
  }
  return bigqueryClient;
}

export function getDataset(): string {
  const dataset = process.env.BIGQUERY_DATASET;
  if (!dataset) {
    throw new Error("BIGQUERY_DATASET environment variable is not set");
  }
  return dataset;
}

export const TABLE_NAME = "activation_objectives";

export async function ensureTableExists(): Promise<void> {
  const bq = getBigQueryClient();
  const dataset = getDataset();

  const [tableExists] = await bq
    .dataset(dataset)
    .table(TABLE_NAME)
    .exists();

  if (!tableExists) {
    const schema = [
      { name: "id", type: "STRING", mode: "REQUIRED" },
      { name: "title", type: "STRING", mode: "REQUIRED" },
      { name: "category", type: "STRING", mode: "REQUIRED" },
      { name: "status", type: "STRING", mode: "REQUIRED" },
      { name: "priority", type: "STRING", mode: "REQUIRED" },
      { name: "targetDate", type: "STRING", mode: "REQUIRED" },
    ];

    await bq.dataset(dataset).createTable(TABLE_NAME, { schema });
    console.log(`Created table ${dataset}.${TABLE_NAME}`);
  } else {
    console.log(`Table ${dataset}.${TABLE_NAME} already exists`);
  }
}
