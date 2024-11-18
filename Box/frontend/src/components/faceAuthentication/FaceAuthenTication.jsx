

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './FaceAuthenTication.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FaceAuthenTication() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [cameraStopped, setCameraStopped] = useState(false);
  const [matchingFace, setMatchingFace] = useState(false); // New state to track matching face message
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
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

  const loadReferenceImages = async () => {
    const labeledDescriptors = [];
    const referenceImages = ['soumen1.jpg', 'soumen2.jpg', 'soumen3.jpg', 'soumen4.jpg'];

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

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
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

            resizedDetections.forEach((detection) => {
              const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

              if (bestMatch.distance < 0.6) {
                setIsAuthenticated(true);
               
                setMatchingFace(true);


                setTimeout(() => {
                  navigate('/entercode');
                  stopVideo();
                  setCameraStopped(true); 
                }, 3000);

              } else {
                setIsAuthenticated(false);
                toast.error("Face doesn't match");
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
        }, 100);
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
      <ToastContainer />
      <h1>Running Facial Authentication</h1>
      <div className="video-container">
        {/* Video and Canvas are conditionally rendered */}
        {!cameraStopped && (
          <>
            <video
              ref={videoRef}
              width="640"
              height="480"
              autoPlay
              muted
            ></video>
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
            ></canvas>
          </>
        )}
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

      {/* Show "Matching Face" message during timeout */}
      {matchingFace && (
        <div className="matching-face-message">
          <p>Matching Face...</p>
        </div>
      )}
    </div>
  );
}

export default FaceAuthenTication;

