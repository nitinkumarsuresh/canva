import React, { useState, useEffect } from 'react';
import './index.css'; // Import Tailwind CSS styles

class CanvasEditor {
  constructor(canvas, templateData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.templateData = templateData;
    this.image = new Image();
    this.image.onload = () => this.draw();
    this.image.src = templateData.urls.mask;
  }

  draw() {
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;

    // Draw background color
    this.ctx.fillStyle = this.templateData.cta.background_color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw design pattern
    const pattern = new Image();
    pattern.src = this.templateData.urls.design_pattern;
    this.ctx.drawImage(pattern, 0, 0, this.canvas.width, this.canvas.height);

    // Draw image mask
    this.ctx.drawImage(this.image, this.templateData.image_mask.x, this.templateData.image_mask.y, this.templateData.image_mask.width, this.templateData.image_mask.height);

    // Draw mask stroke
    const stroke = new Image();
    stroke.src = this.templateData.urls.stroke;
    this.ctx.drawImage(stroke, 0, 0, this.canvas.width, this.canvas.height);

    // Draw caption text
    const caption = this.templateData.caption;
    this.ctx.fillStyle = caption.text_color;
    this.ctx.font = `${caption.font_size}px Arial`;
    this.wrapText(caption.text, caption.position.x, caption.position.y, caption.max_characters_per_line, caption.font_size, caption.alignment);

    // Draw CTA
    const cta = this.templateData.cta;
    const ctaWidth = this.ctx.measureText(cta.text).width;
    const ctaHeight = cta.font_size + 24; // Padding
    this.ctx.fillStyle = cta.background_color;
    this.roundRect(cta.position.x, cta.position.y, ctaWidth + 48, ctaHeight, 10);
    this.ctx.fillStyle = cta.text_color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = `${cta.font_size}px Arial`;
    this.ctx.fillText(cta.text, cta.position.x + ctaWidth / 2 + 24, cta.position.y + ctaHeight / 2);
  }

  wrapText(text, x, y, maxWidth, fontSize, alignment) {
    const words = text.split(' ');
    let line = '';
    let lineHeight = fontSize * 1.2; // Adjust line height as per requirement
    let yPos = y;
    this.ctx.textAlign = alignment;

    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      let metrics = this.ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        this.ctx.fillText(line, x, yPos);
        line = words[i] + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, yPos);
  }

  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

const App = () => {
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [captionText, setCaptionText] = useState("1 & 2 BHK Luxury Apartments at just Rs.34.97 Lakhs");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const canvas = document.getElementById('editorCanvas');
    const editor = new CanvasEditor(canvas, {
      caption: {
        text: captionText,
        position: { x: 50, y: 50 },
        max_characters_per_line: 31,
        font_size: 44,
        alignment: "left",
        text_color: "#FFFFFF"
      },
      cta: {
        text: ctaText,
        position: { x: 190, y: 320 },
        text_color: "#FFFFFF",
        background_color: "#000000"
      },
      image_mask: {
        x: 56,
        y: 442,
        width: 970,
        height: 600
      },
      urls: {
        mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png?random=" + Math.random(),
        stroke: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png?random=" + Math.random(),
        design_pattern: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png?random=" + Math.random()
      }
    });

    return () => {
      editor.clear();
    };
  }, [captionText, ctaText]);

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex w-full">
        <div className="w-3/4 p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <canvas id="editorCanvas" className="w-full border border-gray-500" style={{ backgroundColor: backgroundColor }} />
          </div>
        </div>
        <div className="w-1/4 p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <label className="block mb-2">
              Background Color:
              <input type="color" value={backgroundColor} onChange={handleBackgroundColorChange} />
            </label>
            <label className="block mb-2">
              Caption Text:
              <input type="text" value={captionText} onChange={(e) => setCaptionText(e.target.value)} />
            </label>
            <label className="block mb-2">
              CTA Text:
              <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
            </label>
            <label className="block mb-2">
              Upload Image:
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {imageFile && (
            <div className="mt-4">
              <img src={imageFile} alt="Uploaded" className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
