const fs = require("fs");
const path = require("path");
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
        const directory = path.join(__dirname, "../public/generated");

        // Use async/await with fs.promises
        const files = await fs.promises.readdir(directory);
        const pngFiles = files.filter((el) => path.extname(el) === ".png");

        // Delete files sequentially to avoid overwhelming the system
        for (const file of pngFiles) {
            try {
                await fs.promises.unlink(path.join(directory, file));
            } catch (err) {
                console.error(`Error deleting file ${file}:`, err);
                // Continue with other files even if one fails
            }
        }

        done(null, {
            success: true,
            filesDeleted: pngFiles.length,
        });
    } catch (err) {
        console.error("Error in clearImagesQueue:", err);
        done(err);
    }
});
