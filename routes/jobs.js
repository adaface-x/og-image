const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { clearImagesQueue } = require("../services/queue");
const { sendDiscordAlert } = require("../services/discord");

clearImagesQueue.add(
	"clear-image-queue",
	{},
	{
		repeat: {
			cron: "0 */2 * * *",
		},
		attempts: 2,
		jobId: `clear-image-queue`,
	}
);

clearImagesQueue.on("failed", (job, err) => {
	console.log("clearImagesQueue failed", job, err);
	sendDiscordAlert({
		message: "clearImagesQueue job failed",
		data: {
			jobId: (job || {}).id,
			error: String(err),
		},
	});
});

clearImagesQueue.process("clear-image-queue", async (job, done) => {
	try {
		console.log("clearImagesQueue job started");
		const directory = path.join(__dirname, "../public/generated");
		fs.readdir(directory, (err, files) => {
			if (err) throw err;
			const pngFiles = files.filter((el) => path.extname(el) === ".png");

			if ((pngFiles || []).length > 10) {
				for (const file of pngFiles) {
					fs.unlink(path.join(directory, file), (err) => {
						if (err) throw err;
					});
				}
			}
		});

		//find dev profile files with name starting with "puppeteer_dev*" and delete them
		command = `find / -type d -name "puppeteer_dev*" | xargs rm -rf`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing command: ${error.message}`);
				return;
			}

			if (stderr) {
				console.error(`Command stderr: ${stderr}`);
				return;
			}

			console.log(`Command stdout: ${stdout}`);
		});
		done(null, {
			success: true,
		});
	} catch (err) {
		console.error(err);

		done(err);
	}
});
