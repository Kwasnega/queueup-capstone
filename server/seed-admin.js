import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const { Pool } = pg;
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

function ask(question) {
  return new Promise((resolve) => {
    const interfaceHandle = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    interfaceHandle.question(question, (answer) => {
      interfaceHandle.close();
      resolve(answer.trim());
    });
  });
}

function askPassword(question) {
  return new Promise((resolve) => {
    const input = process.stdin;
    let password = '';

    process.stdout.write(question);
    input.setRawMode(true);
    input.resume();

    const handleInput = (data) => {
      const character = data.toString();

      if (character === '\r' || character === '\n') {
        input.setRawMode(false);
        input.pause();
        input.removeListener('data', handleInput);
        process.stdout.write('\n');
        resolve(password);
        return;
      }

      if (character === '\u0003') {
        input.setRawMode(false);
        input.pause();
        input.removeListener('data', handleInput);
        process.stdout.write('\n');
        process.exit(1);
      }

      if (character === '\u007f') {
        password = password.slice(0, -1);
        return;
      }

      password += character;
    };

    input.on('data', handleInput);
  });
}

const email = await ask('Admin email: ');
const password = await askPassword('Admin password: ');

if (!email || !password) {
  console.error('Email and password are required.');
  process.exitCode = 1;
} else {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admins (uid, full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), 'Super Administrator', email, passwordHash, 'SuperAdmin']
    );
    console.log(`SuperAdmin account created for ${email}`);
  } catch (error) {
    if (error.code === '23505') {
      console.error('An admin with that email already exists.');
    } else {
      console.error('Failed to create admin:', error.message);
    }
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
