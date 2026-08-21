import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import FormData from 'form-data';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

const TOKEN1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyZjQwYWY3Zi1kMmM3LTQ5YjMtOWU4MC0yNDdiZjhlNDIzMmYiLCJzdHVkZW50SWQiOiJVU1IwODIwMTkwMjQ3Iiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3ODcyODEyOTYsImV4cCI6MTc4NzI4NDg5Nn0.toyhSBwpXSGqlpYTTh2UKohUb6xQ1j6xTga1xcZP8vo';
const TOKEN2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJiN2ZhMWU3MS0wMzQ0LTQ5YjItOTJlOC1iZjRmODAzMWEwOTciLCJzdHVkZW50SWQiOiJFRElUMDgyMDA1MzQxOCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzg3MjgxMjk2LCJleHAiOjE3ODcyODQ4OTZ9.1GwiKG5sDARvfMZSih4PxLiBuqMjQITyWoAcch54hW8';

async function postForm(path, token, fd) {
  const buffer = fd.getBuffer();
  const headers = { ...fd.getHeaders(), Authorization: 'Bearer ' + token };
  const res = await fetch('http://localhost:5000' + path, { method: 'POST', headers, body: buffer });
  return { status: res.status, body: await res.json() };
}

async function apiGet(path, token) {
  const res = await fetch('http://localhost:5000' + path, { headers: { Authorization: 'Bearer ' + token } });
  return { status: res.status, body: await res.json() };
}

console.log('\n=== TEST 1: POST with PNG attachment ===');
const form1 = new FormData();
form1.append('course_code', 'CS101');
form1.append('description', 'Grade discrepancy PNG upload test');
form1.append('attachment', pngBuffer, { filename: 'evidence.png', contentType: 'image/png' });
const t1 = await postForm('/api/results-issues', TOKEN1, form1);
console.log('Status:', t1.status, t1.status === 201 ? 'PASS' : 'FAIL');
const issueId = t1.body?.resultsIssue?.id;
const s3Key = t1.body?.resultsIssue?.attachment_url;
console.log('Issue ID:', issueId);
console.log('S3 Key:', s3Key);

console.log('\n=== TEST 2: Confirm S3 key format ===');
if (s3Key && s3Key.startsWith('results-issues/') && s3Key.includes('evidence.png')) {
  console.log('PASS: Key =', s3Key);
} else {
  console.log('FAIL: Key =', s3Key);
}

console.log('\n=== TEST 3: Upload .txt file - expect 400 ===');
const form3 = new FormData();
form3.append('course_code', 'CS102');
form3.append('description', 'Bad type test');
form3.append('attachment', Buffer.from('evil'), { filename: 'exploit.txt', contentType: 'text/plain' });
const t3 = await postForm('/api/results-issues', TOKEN1, form3);
console.log('Status:', t3.status, t3.status === 400 ? 'PASS' : 'FAIL', '-', t3.body.message);

console.log('\n=== TEST 4: GET signed URL ===');
if (issueId) {
  const t4 = await apiGet('/api/results-issues/' + issueId + '/attachment', TOKEN1);
  console.log('Status:', t4.status, t4.status === 200 ? 'PASS' : 'FAIL');
  const url = t4.body?.url;
  if (url) console.log('Signed URL:', url.substring(0, 130) + '...');
  else console.log('No URL:', JSON.stringify(t4.body));
} else { console.log('SKIP'); }

console.log('\n=== TEST 5: Cross-student 403 ===');
if (issueId) {
  const t5 = await apiGet('/api/results-issues/' + issueId + '/attachment', TOKEN2);
  console.log('Status:', t5.status, t5.status === 403 ? 'PASS' : 'FAIL', '-', t5.body.message);
} else { console.log('SKIP'); }

console.log('\nDONE');
