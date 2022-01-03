'use strict'

const os = require('os')
const {v4: uuidv4} = require('uuid')
const fs = require('fs')
const {pipeline} = require('stream/promises')

module.exports = async function (fastify) {
	fastify.post('/upload', async function (request) {
		const parts = await request.files()
		let currentReadStream = null

		function cleanup() {
			if (!currentReadStream?.destroyed) {
				request.log.info('Cleaning up')
				currentReadStream.destroy()
			}
		}
		request.raw.on('close', cleanup)

		for await (const part of parts) {
			const tempFile = `${os.tmpdir()}/${uuidv4()}.file`
			currentReadStream = part.file
			try {
				const writeStream = fs.createWriteStream(tempFile)
				await pipeline(currentReadStream, writeStream)
			} catch (error) {
				request.log.error('Error caught in main loop')
				request.log.error(error)
				throw error
			} finally {
				request.log.info('Finally finished in main loop')
			}
		}
		return 'OK'
	})
}
