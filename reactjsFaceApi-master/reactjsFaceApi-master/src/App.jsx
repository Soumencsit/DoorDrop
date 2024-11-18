import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // Make sure this path is correct
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');

        setModelsLoaded(true); // Update state once models are loaded
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      loadReferenceImages();
    }
  }, [modelsLoaded]);

  // Load reference images for authentication
  const loadReferenceImages = async () => {
    const labeledDescriptors = [];
    const referenceImages = ['soumen1.jpg', 'soumen2.jpg','soumen3.jpg','soumen4.jpg'];

    for (let i = 0; i < referenceImages.length; i++) {
      const imageUrl = `/references/${referenceImages[i]}`;
      const image = await faceapi.fetchImage(imageUrl);
      const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(referenceImages[i], [detections.descriptor]));
       
      } else {
        console.warn(`No face detected in image: ${referenceImages[i]}`);
      }
    }

    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    setFaceMatcher(matcher);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });
  };

  const handleFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current || !faceMatcher) return;

    // Wait until video is loaded to get valid video dimensions
    videoRef.current.addEventListener('loadedmetadata', () => {
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      videoRef.current.addEventListener('play', () => {
        setInterval(async () => {
          // Ensure model is loaded before calling detectAllFaces
          if (faceapi.nets.ssdMobilenetv1.isLoaded) {
            const detections = await faceapi
              .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            // faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

            resizedDetections.forEach((detection) => {
              const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

              if (bestMatch.distance < 0.6) {
                setIsAuthenticated(true);
                //--------------------->
              } else {
                setIsAuthenticated(false);
              }

              const { box } = detection.detection;
              const { x, y } = box;

              ctx.font = '16px Arial';
              ctx.fillStyle = 'red';
              ctx.fillText(bestMatch.toString(), x, y - 10);
            });
          } else {
            console.log('Waiting for model to load...');
          }
        }, 100); // Update detection every 100ms
      });
    });
  };

  useEffect(() => {
    if (modelsLoaded && faceMatcher) {
      startVideo();
      handleFaceDetection();
    }
  }, [modelsLoaded, faceMatcher]);

  return (
    <div className="app">
      <h1>Face Authentication System</h1>
      <div className="video-container">
        <video
          ref={videoRef}
          width="640"
          height="480"
          autoPlay
          muted
          // style={{ position: 'absolute' }}
        ></video>
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          // style={{ position: 'absolute', top: 0, left: 0 }}
        ></canvas>
      </div>

      {isAuthenticated !== null && (
        <div className="authentication-status">
          {isAuthenticated ? (
            <p style={{ color: 'green' }}>Authentication Successful</p>
          ) : (
            <p style={{ color: 'red' }}>Authentication Failed</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
