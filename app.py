from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route('/saveImage', methods=['POST'])
def save_image():
    try:
        # Get the image data from the request
        image_data = request.json['image']
        
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data.split(',')[1])
        
        # Open image using PIL
        with Image.open(BytesIO(image_bytes)) as img:
            # Convert to RGB if image has alpha channel
            if img.mode == "RGBA":
                img = img.convert("RGB")
            
            # Save image as JPEG in local directory
            img.save("image.jpeg", "JPEG")
            
            # Preprocess the image for model input
            img = img.convert('L').resize((50, 50))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=-1)

        # Load the saved model
        loaded_model = load_model("hwnc_model.h5")

        # Make predictions on the image
        predictions = loaded_model.predict(np.expand_dims(img_array, axis=0))
        predicted_class = np.argmax(predictions)

        print(predicted_class)
        # Return the predicted number in the response
        return jsonify({'message': 'Number is ' + str(predicted_class)}), 200

    except Exception as e:
        print("Error processing image:", str(e))
        return jsonify({'error': 'Failed to process image'}), 500

if __name__ == '__main__':
    app.run(debug=True)
