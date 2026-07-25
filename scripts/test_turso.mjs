import { createClient } from '@libsql/client';

const url = 'libsql://horizon-eyuel.aws-ap-northeast-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ5NjY3NjYsImlkIjoiMDE5Zjk4NDYtOGIwMS03MWFlLWE1NTEtMzJmMDI5ODU1M2Q2Iiwia2lkIjoiRmgtVlg5TGctRHhzX0ZjOC1EdktsNVRrN1M4amNweFdIc3hQWTdfT0pVRSIsInJpZCI6IjY4YjIxYWIzLTY0OGEtNDQwOC1iN2ViLTk3NTk1Y2JhODg4NyJ9.DNixvRz7kVaTIQm_Oa7KAnWPkCJjY998Bgf0gPYlt3tObOwcgQPkEvmPWbbGrd95wozz73CXPby69CdRYTi0AQ';

const client = createClient({ url, authToken });

async function run() {
  try {
    const res = await client.execute('SELECT 1 + 1 AS result;');
    console.log('Turso connection successful!', res.rows);
  } catch (err) {
    console.error('Turso connection error:', err);
  }
}

run();
