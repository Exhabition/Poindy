/* eslint-disable no-extra-parens */
/* deepscan-disable UNUSED_EXPR */

// Getting frames from a gif
const GIFEncoder = require("gif-encoder-2");
const GIFFrames = require("gif-frames");

// Outputting result
const { writeFile } = require("fs").promises;

// Canvas for loading and drawing images (I choose to use canvas rather then something like ffmpeg as their install guide is not really user friendly)
const { Canvas, loadImage, Image } = require("skia-canvas");

// Self executing function to allow await in this function
module.exports = async (settings) => {
    const staticImagePath = settings.static;
    const gifImagePath = settings.dynamic;
    const amountOfLoops = settings.loops || 1;
    const saveLocation = settings.save;
    const outputSize = settings.pixels || 256;
    const frameRate = settings.frameRate || 12;
    const imageQuality = settings.quality || 100;

    console.log(settings);
    console.log(typeof outputSize);

    // Create a canvas to draw on, uses configuration and draw the image on the canvas
    const canvas = new Canvas(outputSize, outputSize);
    const context = canvas.getContext("2d");
    const staticImage = await loadImage(staticImagePath).catch(console.error);
    context.drawImage(staticImage, 0, 0, outputSize, outputSize);

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
    console.log(`Writing image to ${saveLocation}/Poindy-${Date.now()}.gif`);
    await writeFile(`${saveLocation}/Poindy-${Date.now()}.gif`, finalBuffer);
    console.log("Done!");
};