const Queue = require("bull");

var clearImagesQueue = new Queue(
	"clear-image-queue",
	`${process.env.OG_IMAGE_REDIS_URL}2`
);

module.exports = {
	clearImagesQueue,
};
