/* eslint-disable no-extra-parens */
/* deepscan-disable UNUSED_EXPR */

// Getting frames from a gif
const GIFEncoder = require("gif-encoder-2");
const GIFFrames = require("gif-frames");

// Command line input
const { writeFile } = require("fs").promises;
const { createInterface } = require("readline");
const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Canvas for loading and drawing images (I choose to use canvas rather then something like ffmpeg as their install guide is not really user friendly)
const { createCanvas, loadImage, Image } = require("canvas");

// Loading configuration
const { outputSize, frameRate, imageQuality } = require("../configuration/config.json");

// Self executing function to allow await in this function
(async () => {
    // Get a input path from terminal
    const staticImagePath = await ask("Provide a path to a static image which is for the first frames:\n");

    // Create a canvas to draw on, uses configuration and draw the image on the canvas
    const canvas = new createCanvas(outputSize, outputSize);
    const context = canvas.getContext("2d");
    const staticImage = await loadImage(staticImagePath);
    context.drawImage(staticImage, 0, 0, outputSize, outputSize);

    // Now we get the gif image path
    const gifImagePath = await ask("Provide a path to a gif image:\n");

    // How much times should the gif loop and check if it's a valid number
    const amountOfLoops = await ask("How much times should I loop the gif before showing the static image again:\n");
    if (!Number.isInteger(parseInt(amountOfLoops))) {
        console.error(`${amountOfLoops} is not a valid number`);
        process.exit(1);
    }

    // Setup a encoder to start drawing a gif
    const encoder = new GIFEncoder(outputSize, outputSize, "neuquant");
    encoder.setFrameRate(frameRate);
    encoder.setQuality(imageQuality);
    encoder.start();

    // Add the static image as the first frame which we drew early
    encoder.addFrame(context);

    // Get all frames of the gif image
    const frames = await GIFFrames({ url: gifImagePath, frames: "all", outputType: "jpeg", quality: imageQuality, cumulative: true });

    // Use the amount of loops value we got early to loop multiple times (or not)
    for (let i = 0; i < parseInt(amountOfLoops); i++) {
        console.log(`Starting to add loop #${i + 1} of ${parseInt(amountOfLoops)}`);

        for (const frame of frames) {
            // Creating an image that will be accepted by canvas & accessing the buffer of the frame
            const frameImage = new Image;
            frameImage.src = frame.getImage()._obj;

            // Drawing the frame on the canvas and adding it to the encoder
            context.drawImage(frameImage, 0, 0, outputSize, outputSize);
            encoder.addFrame(context);
        }
    }

    // Make a buffer of the finished product
    encoder.finish();
    const finalBuffer = encoder.out.getData();

    // Give some feedback while writing the file to the results folder
    console.log("Writing image to ./results/result.gif");
    await writeFile("./results/result.gif", finalBuffer);
    console.log("Done!");

    process.exit(0);
})();

// promise around a callback
function ask(question) {
    return new Promise((resolve, reject) => {
        readLine.question(question, (input) => resolve(input));
    });
}