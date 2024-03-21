import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import { dummyData } from "./constants";

function wrapText(context, text, x, y, lineHeight, fitWidth) {
  fitWidth = fitWidth || 0;
  const maxCharactersPerLine = 30;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }

  let words = text.split(" ");
  let line = "";
  words.forEach((word, index) => {
    const testLine = (index === 0 ? "" : line + " ") + word; // Remove leading space for the first word
    if (testLine.length > maxCharactersPerLine) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, y);
}

const App = () => {
  const canvasRef = useRef();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [captionText, setCaptionText] = useState(dummyData.caption.text);
  const [ctaText, setCtaText] = useState(dummyData.cta.text);
  const [color, setColor] = useState("#CA082F"); // Initial color

  let lastThreeColors = [];

  // Retrieve the lastThreeColors array from local storage if it exists
  if (localStorage.getItem("lastThreeColors")) {
    lastThreeColors = JSON.parse(localStorage.getItem("lastThreeColors"));
  }

  const handleChange = (e) => {
    const newColor = e.target.value;

    // Add the new color to the beginning of the array
    lastThreeColors.unshift(newColor);

    // Keep only the last three colors
    lastThreeColors = lastThreeColors.slice(0, 3);

    // Update local storage with the updated array
    localStorage.setItem("lastThreeColors", JSON.stringify(lastThreeColors));

    // Perform any other necessary actions with the new color
    setColor(newColor);
  };
  console.log(lastThreeColors);
  const handleCaptionTextChange = (event) => {
    const newText = event.target.value;
    if (newText.trim() === "") {
      // If the input value is empty, set the default value
      setCaptionText(dummyData.caption.text);
    } else {
      // Otherwise, update the caption text state
      setCaptionText(newText);
    }
  };

  const handleCTATextChange = (event) => {
    const newText = event.target.value;
    if (newText.trim() === "") {
      // If the input value is empty, set the default value
      setCtaText(dummyData.cta.text);
    } else {
      // Otherwise, update the caption text state
      setCtaText(newText);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setPreviewUrl(imageUrl); // Pass the uploaded image URL to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerInputFile = () => {
    fileInputRef.current.click();
  };

  const correctionFactors = {
    height: 15,
    width: 115,
    y: 200,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const mask = new Image();
    const designPattern = new Image();
    const stroke = new Image();

    mask.src = dummyData.urls.mask;
    designPattern.src = dummyData.urls.design_pattern;
    stroke.src = dummyData.urls.stroke;

    mask.onload = () => {
      // Set canvas size to match mask dimensions
      canvas.width = mask.width;
      canvas.height = mask.height;

      // Draw mask
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(mask, 0, 0);

      // Draw design pattern
      context.drawImage(designPattern, 0, 0, canvas.width, canvas.height);

      // Draw image scaled to fit mask dimensions
      if (previewUrl) {
        const image = new Image();
        image.src = previewUrl;

        image.onload = () => {
          const scaleFactor = Math.min(
            mask.width / image.width,
            mask.height / image.height
          );

          const scaledWidth =
            image.width * scaleFactor - correctionFactors.width;
          const scaledHeight =
            image.height * scaleFactor - correctionFactors.height;

          const x = (mask.width - scaledWidth) / 2;
          const y = (mask.height - scaledHeight) / 2 + correctionFactors.y;

          context.drawImage(image, x, y, scaledWidth, scaledHeight);

          // Draw CTA
        };
      }
      // Draw caption text
      // Draw caption text with text wrapping
      const { caption } = dummyData;
      context.font = `${caption.font_size}px Arial`;
      context.fillStyle = caption.text_color;
      context.textAlign = caption.alignment;
      context.textBaseline = "top";
      wrapText(
        context,
        captionText,
        caption.position.x,
        caption.position.y,
        60,
        800
      );

      const { cta } = dummyData;
      const ctaWidth = 270; // Width of the CTA background
      const ctaHeight = 100; // Height of the CTA background
      const ctaX = cta.position.x - ctaWidth / 2;
      const ctaY = cta.position.y - ctaHeight / 2;
      context.fillStyle = cta.background_color;
      context.fillRect(ctaX, ctaY, ctaWidth, ctaHeight);
      context.font = "35px Arial";
      context.fillStyle = cta.text_color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(ctaText, cta.position.x, cta.position.y);
    };
  }, [previewUrl, captionText, ctaText, color]);

  return (
    <div className="flex flex-row text-start justify-center">
      <div
        className="basis-1/2 text-center justify-center p-20 "
        style={{ marginTop: "-40px" }}
      >
        <canvas
          className=" border-4 h-[500px] w-[500px]"
          ref={canvasRef}
        ></canvas>

        {/* <Button onClick={handleDownloadImage} style={{marginTop:"10px"}} variant="contained"  color="success">
          {Downloading ? "Downloading..." : "Download Card as image"}
        </Button> */}
      </div>

      <div className="basis-1/2 bg-slate-100 p-8">
        <h4 className="font-bold text-center">Ad customization</h4>
        <p className="text-slate-400 text-center text-sm mb-4 font-normal">
          Customize your ad and get the templates accordingly
        </p>
        <div
          style={{ width: "97%" }}
          className="border-slate-300 ml-2 border-2 rounded mb-4 p-4"
        >
          <p className="flex text-sm text-slate-400 font-normal">
            <FontAwesomeIcon
              style={{
                width: "20px",
                height: "15px",
                color: "blue",
                padding: "3px",
                marginLeft: "-8px",
              }}
              icon={faImage}
            />
            Change the ad creative image.
            <Link
              className="text-blue-800 underline  "
              style={{ paddingLeft: "2px" }}
              onClick={triggerInputFile}
              href="#"
            >
              select file
            </Link>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </p>
        </div>
        <div className="container mb-3">
          <h2
            className="title text-sm font-normal text-slate-400"
            style={{ width: "80%" }}
          >
            Edit contents
          </h2>
        </div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "65ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            className="text-slate-300"
            label="Ad content"
            variant="outlined"
            onChange={(e) => handleCaptionTextChange(e)}
          />
          <TextField
            id="outlined-basic"
            className="text-slate-300"
            label="CTA"
            variant="outlined"
            onChange={(e) => handleCTATextChange(e)}
          />
        </Box>
        <label className="text-slate-400 text-sm font-normal p-2">
          Choose your color
        </label>
        <div className="flex flex-row p-2 gap-2">
          <input
            type="color"
            value={color}
            onChange={handleChange}
            placeholder="+"
          />
          {lastThreeColors.map((color, index) => (
            <div
              key={index}
              onClick={() => setColor(color)}
              className="rounded-full mt-1  w-5 h-5 mx-1"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
