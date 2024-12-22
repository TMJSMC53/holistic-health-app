import http from "http";
// @ts-expect-error can't declare a d.ts file for the server
import app from "../../server/server.js"; // Ensure the path to your `server.js` is correct.
import fs from 'fs'
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AddressInfo } from "net";


/**
 * Start & cleanup an instance of the server
 *
 * @returns a function that returns the base URL the server is running on
 */
export function givenAServer() {
	let server: http.Server;
	let baseUrl = ''

	beforeEach(async () => {
		await new Promise<void>((resolve, reject) => {
			// 0 for a random port
			server = app.listen(0, () => {
				const { port } = server.address() as AddressInfo;
				baseUrl = `http://localhost:` + port
			}).on('listening', resolve)
				.on('error', reject);
		});
	});

	afterEach(async () => {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) reject(error)
				else resolve()
			});
		})
	});

	return () => baseUrl
}

/**
 * Ensures the dist/index.html contains test data - and restores it's original contents when done
 */
export function givenDistIndexHtml() {
	let originalDistIndexHtmlContent = ''
	beforeEach(async () => {
		if (fs.existsSync('dist/index.html')) {
			originalDistIndexHtmlContent = await fs.promises.readFile('dist/index.html', 'utf-8');
		}

		if (!fs.existsSync('dist')) await fs.promises.mkdir('dist')

		await fs.promises.writeFile('dist/index.html', 'Hello, World!')
	})

	afterEach(async () => {
		if (originalDistIndexHtmlContent) {
			await fs.promises.writeFile('dist/index.html', originalDistIndexHtmlContent)
		} else {
			await fs.promises.rm('dist/index.html')
		}
	})
}

/**
 * Set an env variable to a value - deleting it if the value is undefined
 */
function setEnvVariableTo(key: string, value?: string) {
	if (value) process.env[key] = value;
	else delete process.env[key]
}

/**
 * Set an env variable to a value, restoring it to it's original value when done
 */
function givenAnEnvVariableOfValue(key: string, value?: string) {
	let original: string | undefined
	beforeEach(() => {
		original = process.env[key]
		setEnvVariableTo(key, value)
	})

	afterEach(() => setEnvVariableTo(key, original))
}


/**
 * Set the mongo connection env variable to a non-existent URL, so there is no mongodb to connect to
 */
export const givenNoMongoDBToConnectTo = () => givenAnEnvVariableOfValue('ATLAS_URI', 'mongodb://localhost:12349/')


/**
 * Create a fresh instance of MongoDB, and set it to be connect to by a server
 */
export function givenAMongoDBInstance() {
	let server: MongoMemoryServer;
	beforeEach(async () => {
		server = await MongoMemoryServer.create();

		process.env.ATLAS_URI = server.getUri()
	})

	afterEach(async () => {
		await server.stop();
	})
}

/**
 * User returned from the API
 */
export type APIUser = {
	_id: string
	firstName: string
	lastName: string
	username: string
	password: string
	__v: number
}


/**
 * Register a user
 * @returns the APIUser along with the session JWT cookie to be that use
 */
export async function givenAUser(baseURL: string) {
	const response = await fetch(baseURL + '/api/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: 'TestUser1',
			firstName: 'Test',
			lastName: 'User',
			password: '123456',
		}),
	})

	expect(response.status).toBe(201)

	const Cookie = response.headers.get('set-cookie')!
	expect(Cookie).includes('jwt=')

	const data = await response.json() as { message: string, user: APIUser }
	expect(data.user).toMatchObject({
		username: 'TestUser1'
	});

	return {
		user: data.user,
		Cookie
	}
}

/**
 * Set the current date for the system
 * @returns The date you set the system to
 */
export function givenTheCurrentDateIs(date: Date) {
	vi.setSystemTime(date)
	return date
}