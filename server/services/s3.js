import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import https from 'node:https';

// Lazy client — env vars are guaranteed to be loaded by the time any route handler runs
let _s3Client = null;

function getS3Client() {
  if (!_s3Client) {
    // TLS configuration:
    //
    // On some local networks (routers, ISPs, corporate proxies) that perform TLS
    // inspection, Node.js throws:
    //   "unable to verify the first certificate" (UNABLE_TO_VERIFY_LEAF_SIGNATURE)
    // because Node bundles its own CA store and does not trust the network's
    // injected intermediate CA.
    //
    // AWS_S3_INSECURE_TLS=true can be set in .env for local development only to
    // work around this. It is NEVER enabled in production (NODE_ENV=production
    // acts as a hard override regardless of the flag).
    //
    // In production (EC2 / any cloud host), full certificate validation is enforced
    // and this flag must not be set.
    const insecureTls =
      process.env.NODE_ENV !== 'production' &&
      process.env.AWS_S3_INSECURE_TLS === 'true';

    if (insecureTls) {
      console.warn(
        '[S3] WARNING: TLS certificate validation is DISABLED (AWS_S3_INSECURE_TLS=true). ' +
        'This must never be set in production.'
      );
    }

    const requestHandler = insecureTls
      ? new NodeHttpHandler({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
      : new NodeHttpHandler(); // default: full certificate validation

    _s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      requestHandler
    });
  }
  return _s3Client;
}

// Export a Proxy so callers can still write `s3Client.send(...)` without changes
const s3Client = new Proxy({}, {
  get(_target, prop) {
    return getS3Client()[prop];
  }
});

async function uploadToS3(buffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await getS3Client().send(command);
  return key;
}

export { s3Client, uploadToS3, getS3Client };


