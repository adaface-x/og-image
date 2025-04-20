var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

const { isValidHexaCode } = require("../utils/util");
const { generateScreenshotUsingPuppeteer } = require("../services/puppeteer");
const { sendDiscordAlert } = require("../services/discord");
require("./jobs");

// Return with generated image
router.get("/og-image/:image/", async function (req, res, next) {
    try {
        if (!req.params.image) {
            res.status(400).send({
                error: "BAD_REQUEST",
                message: "Missing required fields",
            });
            return;
        }

        const title = req.params.image.split(".png")[0] || "";

        const { name, backgroundColor, fontColor, authorName, profilePicture } =
            req.query || {};

        if (!title || !authorName || !profilePicture || !name) {
            res.status(400).send({
                error: "BAD_REQUEST",
                message: "Missing required fields",
            });
            return;
        }

        if (profilePicture && !profilePicture.startsWith("http")) {
            res.status(400).send({
                error: "BAD_REQUEST",
                message: "Profile picture must be a valid URL",
            });
            return;
        }

        if (backgroundColor && !isValidHexaCode(backgroundColor)) {
            res.status(400).send({
                error: "BAD_REQUEST",
                message: "Background color must be a valid hex color",
            });
            return;
        }

        if (fontColor && !isValidHexaCode(fontColor)) {
            res.status(400).send({
                error: "BAD_REQUEST",
                message: "Font color must be a valid hex color",
            });
            return;
        }

        var data = {
            ...(req.query || {}),
            title: title || "",
            tags: ((req.query || {}).tags || "").split(",") || [],
        };

        // create a unique hash for all the data used to generate this image
        // this will be used to check if the image is already generated
        const hash = crypto
            .createHash("md5")
            .update(JSON.stringify(data))
            .digest("hex");

        // check if the file is present in the public/generated folder

        const filePath = path.join(
            __dirname,
            "../public/generated",
            hash + "-" + encodeURIComponent(title || "og_image") + ".png"
        );

        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }

        const image = await generateScreenshotUsingPuppeteer({
            template: "og-image",
            data,
        });

        fs.writeFile(filePath, image, (err) => {
            if (err) {
                console.error("Error generating og image", err);
                sendDiscordAlert({
                    message: "Error generating og image",
                    data: {
                        error: String(err),
                        ...(req.query || {}),
                        title: title || "",
                        error_message: err?.message || "",
                    },
                });
                res.status(500).send({
                    error: "INTERNAL_SERVER_ERROR",
                    message: (err || {}).message || "Something went wrong",
                });
                return;
            } else {
                return res.sendFile(filePath);
            }
        });
    } catch (error) {
        console.error("Error generating og image 2", error);
        sendDiscordAlert({
            message: "Error generating og image",
            data: {
                error: String(error),
                ...(req.query || {}),
                title: title || "",
                error_message: error?.message || "",
            },
        });

        res.status(500).send({
            error: "INTERNAL_SERVER_ERROR",
            message: (error || {}).message || "Something went wrong",
        });
    }
});

// Show the base image generation page with default values
router.get(["/og-image"], function (req, res, next) {
    // if the url ends with "/" redirect
    if (req.url.endsWith("/")) {
        res.redirect(req.url.slice(0, -1));
        return;
    }

    var paramsOfThisUrl = {
        ...(req.params || {}),
    };

    var defaultParams = {
        title: "OG Image Generator",
        name: "Team Adaface",
        tags: ["Open source"],
        authorName: "Sanjana",
        profilePicture:
            "https://res.cloudinary.com/adaface/image/upload/v1692702368/sanjana_kumari.jpg",
        emoji: "✨",
        backgroundColor: "#011f8a",
        fontColor: "#ffffff",
    };
    res.render("index", {
        ...Object.assign({}, defaultParams, paramsOfThisUrl),
        og_image_server_url: process.env.OG_IMAGE_SERVER_URL + "/og-image",
    });
});

module.exports = router;
