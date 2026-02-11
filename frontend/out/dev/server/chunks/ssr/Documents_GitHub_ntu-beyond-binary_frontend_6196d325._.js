module.exports = [
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-mediapipe-face.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMediaPipeFace",
    ()=>useMediaPipeFace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function useMediaPipeFace(videoElement, enabled) {
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        blinkDetected: false,
        gazeDirection: null,
        headRotation: null,
        faceDetected: false,
        ready: false
    });
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const faceLandmarkerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastBlinkTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const frameCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Initialize MediaPipe
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        let isActive = true;
        const initializeFaceLandmarker = async ()=>{
            try {
                console.log('🔍 Initializing MediaPipe FaceLandmarker...');
                const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
                const faceLandmarker = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaceLandmarker"].createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                        delegate: 'GPU'
                    },
                    runningMode: 'VIDEO',
                    numFaces: 1,
                    minFaceDetectionConfidence: 0.5,
                    minFacePresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                    outputFaceBlendshapes: true,
                    outputFacialTransformationMatrixes: true
                });
                if (isActive) {
                    faceLandmarkerRef.current = faceLandmarker;
                    setIsReady(true);
                    setResult((prev)=>({
                            ...prev,
                            ready: true
                        }));
                    console.log('✓ MediaPipe FaceLandmarker ready');
                }
            } catch (error) {
                console.error('Failed to initialize FaceLandmarker:', error);
            }
        };
        initializeFaceLandmarker();
        return ()=>{
            isActive = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            setIsReady(false);
            setResult((prev)=>({
                    ...prev,
                    ready: false,
                    faceDetected: false,
                    blinkDetected: false,
                    gazeDirection: null,
                    headRotation: null
                }));
        };
    }, [
        enabled
    ]);
    // Process video frames
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled || !videoElement || !isReady || !faceLandmarkerRef.current) {
            console.log('📹 MediaPipe frame processing NOT starting:', {
                enabled,
                hasVideo: !!videoElement,
                isReady,
                hasFaceLandmarker: !!faceLandmarkerRef.current
            });
            return;
        }
        console.log('📹 MediaPipe frame processing STARTING', {
            videoWidth: videoElement.videoWidth,
            videoHeight: videoElement.videoHeight,
            readyState: videoElement.readyState,
            paused: videoElement.paused
        });
        let isProcessing = false;
        const processFrame = async ()=>{
            if (!faceLandmarkerRef.current || !videoElement || isProcessing) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
                return;
            }
            if (videoElement.readyState < 2) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
                return;
            }
            isProcessing = true;
            frameCountRef.current++;
            try {
                const startTimeMs = performance.now();
                const detections = faceLandmarkerRef.current.detectForVideo(videoElement, startTimeMs);
                // Log every 60 frames (~1 second)
                if (frameCountRef.current % 60 === 0) {
                    console.log('📹 MediaPipe frame', frameCountRef.current, '- Faces detected:', detections.faceLandmarks?.length || 0);
                }
                if (detections.faceLandmarks && detections.faceLandmarks.length > 0) {
                    const landmarks = detections.faceLandmarks[0];
                    const blendshapes = detections.faceBlendshapes?.[0]?.categories;
                    // BLINK DETECTION
                    let blinkDetected = false;
                    if (blendshapes) {
                        const leftEyeBlink = blendshapes.find((b)=>b.categoryName === 'eyeBlinkLeft');
                        const rightEyeBlink = blendshapes.find((b)=>b.categoryName === 'eyeBlinkRight');
                        const leftScore = leftEyeBlink?.score || 0;
                        const rightScore = rightEyeBlink?.score || 0;
                        // Log eye scores every 60 frames
                        if (frameCountRef.current % 60 === 0) {
                            console.log('👁️ Eye scores:', {
                                left: leftScore.toFixed(2),
                                right: rightScore.toFixed(2)
                            });
                        }
                        // Blink threshold: both eyes > 0.5
                        if (leftScore > 0.5 && rightScore > 0.5) {
                            const now = Date.now();
                            if (now - lastBlinkTimeRef.current > 500) {
                                blinkDetected = true;
                                lastBlinkTimeRef.current = now;
                                console.log('👁️ BLINK DETECTED!', {
                                    left: leftScore.toFixed(2),
                                    right: rightScore.toFixed(2)
                                });
                            }
                        }
                    }
                    // GAZE DIRECTION
                    const leftIris = landmarks[468];
                    const rightIris = landmarks[473];
                    const noseTip = landmarks[1];
                    let gazeDirection = null;
                    if (leftIris && rightIris && noseTip) {
                        const avgIrisX = (leftIris.x + rightIris.x) / 2;
                        const avgIrisY = (leftIris.y + rightIris.y) / 2;
                        gazeDirection = {
                            x: (avgIrisX - noseTip.x) * 10,
                            y: (avgIrisY - noseTip.y) * 10
                        };
                        // Log gaze every 60 frames
                        if (frameCountRef.current % 60 === 0) {
                            console.log('👀 Gaze:', {
                                x: gazeDirection.x.toFixed(2),
                                y: gazeDirection.y.toFixed(2)
                            });
                        }
                    }
                    // HEAD ROTATION
                    let headRotation = null;
                    if (detections.facialTransformationMatrixes && detections.facialTransformationMatrixes.length > 0) {
                        const matrix = detections.facialTransformationMatrixes[0].data;
                        const pitch = Math.asin(-matrix[6]) * (180 / Math.PI);
                        const yaw = Math.atan2(matrix[2], matrix[10]) * (180 / Math.PI);
                        const roll = Math.atan2(matrix[4], matrix[5]) * (180 / Math.PI);
                        headRotation = {
                            pitch,
                            yaw,
                            roll
                        };
                        // Log head rotation every 60 frames
                        if (frameCountRef.current % 60 === 0) {
                            const total = Math.abs(pitch) + Math.abs(yaw) + Math.abs(roll);
                            console.log('🗣️ Head:', {
                                pitch: pitch.toFixed(1),
                                yaw: yaw.toFixed(1),
                                roll: roll.toFixed(1),
                                total: total.toFixed(1)
                            });
                        }
                    }
                    setResult({
                        blinkDetected,
                        gazeDirection,
                        headRotation,
                        faceDetected: true,
                        ready: true
                    });
                } else {
                    setResult({
                        blinkDetected: false,
                        gazeDirection: null,
                        headRotation: null,
                        faceDetected: false,
                        ready: true
                    });
                }
            } catch (error) {
                console.error('Error processing frame:', error);
            }
            isProcessing = false;
            animationFrameRef.current = requestAnimationFrame(processFrame);
        };
        processFrame();
        return ()=>{
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [
        enabled,
        videoElement,
        isReady
    ]);
    return result;
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-local-speech.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocalSpeech",
    ()=>useLocalSpeech
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const SPEECH_SERVICE_URL = 'http://localhost:5050';
const RECORDING_INTERVAL = 1500 // Record 1.5 second chunks for faster response
;
function useLocalSpeech(enabled) {
    const initCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    initCountRef.current++;
    // Only log every 10th init to avoid console spam
    if (initCountRef.current % 10 === 0) {
        console.log('🎤 [LOCAL SPEECH] Hook initialized (count:', initCountRef.current, '), enabled:', enabled);
    }
    const [transcription, setTranscription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        available: false,
        recording: false,
        error: null,
        serviceUrl: SPEECH_SERVICE_URL
    });
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const recordingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isProcessingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const serviceCheckIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Check if service is available - IMMEDIATE execution
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('🎤 [LOCAL SPEECH] 🔥 Service check effect RUNNING');
        const checkService = async ()=>{
            console.log('🎤 [LOCAL SPEECH] Checking service at:', SPEECH_SERVICE_URL);
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(()=>controller.abort(), 2000);
                const response = await fetch(`${SPEECH_SERVICE_URL}/health`, {
                    method: 'GET',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (response.ok) {
                    const data = await response.json();
                    console.log('🎤 [LOCAL SPEECH] ✅ Service available:', data);
                    setStatus((prev)=>{
                        // Only update if status changed
                        if (prev.available !== true || prev.error !== null) {
                            return {
                                ...prev,
                                available: true,
                                error: null
                            };
                        }
                        return prev;
                    });
                } else {
                    throw new Error(`Service returned ${response.status}`);
                }
            } catch (err) {
                console.warn('🎤 [LOCAL SPEECH] ❌ Service not available:', err.message);
                console.warn('🎤 [LOCAL SPEECH] Make sure to run: python speech_service.py');
                setStatus((prev)=>{
                    // Only update if status changed
                    const newError = 'Service not running. Start with: python speech_service.py';
                    if (prev.available !== false || prev.error !== newError) {
                        return {
                            ...prev,
                            available: false,
                            error: newError
                        };
                    }
                    return prev;
                });
            }
        };
        // Run check immediately
        checkService();
        // Then check every 10s
        if (serviceCheckIntervalRef.current) {
            clearInterval(serviceCheckIntervalRef.current);
        }
        serviceCheckIntervalRef.current = window.setInterval(checkService, 10000);
        return ()=>{
            console.log('🎤 [LOCAL SPEECH] Cleaning up service check interval');
            if (serviceCheckIntervalRef.current) {
                clearInterval(serviceCheckIntervalRef.current);
                serviceCheckIntervalRef.current = null;
            }
        };
    }, []);
    // Start/stop recording based on enabled state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('🎤 [LOCAL SPEECH] Recording effect triggered', {
            enabled,
            available: status.available
        });
        if (!enabled || !status.available) {
            console.log('🎤 [LOCAL SPEECH] Not starting recording - enabled:', enabled, 'available:', status.available);
            stopRecording();
            return;
        }
        console.log('🎤 [LOCAL SPEECH] ✅ Starting local speech recognition...');
        startRecording();
        return ()=>{
            console.log('🎤 [LOCAL SPEECH] Cleanup - stopping local speech recognition');
            stopRecording();
        };
    }, [
        enabled,
        status.available
    ]);
    const startRecording = async ()=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            // Use webm format for better compatibility
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav';
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType,
                audioBitsPerSecond: 16000 // Lower quality for faster processing
            });
            mediaRecorderRef.current.ondataavailable = (event)=>{
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = async ()=>{
                if (audioChunksRef.current.length === 0) return;
                if (isProcessingRef.current) return;
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mimeType
                });
                audioChunksRef.current = [];
                // Only process if blob has reasonable size (some audio was captured)
                if (audioBlob.size > 1000) {
                    await sendAudioToService(audioBlob);
                }
                // Restart recording if still enabled
                if (enabled && status.available && mediaRecorderRef.current) {
                    audioChunksRef.current = [];
                    mediaRecorderRef.current.start();
                    // Stop and process after interval
                    if (recordingIntervalRef.current) {
                        clearTimeout(recordingIntervalRef.current);
                    }
                    recordingIntervalRef.current = window.setTimeout(()=>{
                        if (mediaRecorderRef.current?.state === 'recording') {
                            mediaRecorderRef.current.stop();
                        }
                    }, RECORDING_INTERVAL);
                }
            };
            // Start recording
            mediaRecorderRef.current.start();
            setStatus((prev)=>({
                    ...prev,
                    recording: true
                }));
            console.log('🎤 Recording started with format:', mimeType);
            // Stop after interval to process
            recordingIntervalRef.current = window.setTimeout(()=>{
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
            }, RECORDING_INTERVAL);
        } catch (err) {
            console.error('🎤 Failed to start recording:', err);
            setStatus((prev)=>({
                    ...prev,
                    recording: false,
                    error: err.message
                }));
        }
    };
    const stopRecording = ()=>{
        console.log('🎤 [LOCAL SPEECH] Stopping recording...');
        if (recordingIntervalRef.current) {
            clearTimeout(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
        }
        if (mediaRecorderRef.current) {
            try {
                if (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused') {
                    console.log('🎤 [LOCAL SPEECH] Stopping MediaRecorder');
                    mediaRecorderRef.current.stop();
                }
                // Stop all tracks
                if (mediaRecorderRef.current.stream) {
                    console.log('🎤 [LOCAL SPEECH] Stopping audio tracks');
                    mediaRecorderRef.current.stream.getTracks().forEach((track)=>{
                        track.stop();
                        console.log('🎤 [LOCAL SPEECH] Stopped track:', track.kind);
                    });
                }
            } catch (err) {
                console.warn('🎤 [LOCAL SPEECH] Error stopping recording:', err);
            }
            mediaRecorderRef.current = null;
        }
        audioChunksRef.current = [];
        isProcessingRef.current = false;
        setStatus((prev)=>({
                ...prev,
                recording: false
            }));
        console.log('🎤 [LOCAL SPEECH] Recording fully stopped');
    };
    const sendAudioToService = async (audioBlob)=>{
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        try {
            console.log('🎤 Sending audio to service...', audioBlob.size, 'bytes');
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.webm');
            const response = await fetch(`${SPEECH_SERVICE_URL}/transcribe`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(10000) // 10s timeout
            });
            if (!response.ok) {
                throw new Error(`Service returned ${response.status}`);
            }
            const result = await response.json();
            if (result.text && result.text.trim().length > 0) {
                console.log('🎤 Transcription received:', result.text);
                setTranscription({
                    text: result.text,
                    confidence: result.confidence || 0.8,
                    timestamp: Date.now()
                });
            } else {
                console.log('🎤 No speech detected in chunk');
            }
        } catch (err) {
            console.error('🎤 Failed to transcribe:', err.message);
            setStatus((prev)=>({
                    ...prev,
                    error: err.message
                }));
        } finally{
            isProcessingRef.current = false;
        }
    };
    // Memoize return value to prevent unnecessary re-renders
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            transcription,
            status
        }), [
        transcription,
        status
    ]);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-passive-sensing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePassiveSensing",
    ()=>usePassiveSensing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$mediapipe$2d$face$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-mediapipe-face.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$local$2d$speech$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-local-speech.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function usePassiveSensing(enabled, options = {}) {
    const voiceVolumeThreshold = options.voiceVolumeThreshold ?? 10;
    const voiceConsecutiveFrames = options.voiceConsecutiveFrames ?? 2;
    const disableGaze = options.disableGaze ?? false;
    const disableVoiceVolume = options.disableVoiceVolume ?? false;
    const suppressVoiceWhileSpeaking = options.suppressVoiceWhileSpeaking ?? false;
    const allowedInputTypes = options.allowedInputTypes ?? null;
    const [detectedInput, setDetectedInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transcription, setTranscription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [audioLevel, setAudioLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [videoElement, setVideoElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [audioReady, setAudioReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [videoReady, setVideoReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [speechAvailable, setSpeechAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [speechActive, setSpeechActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [speechError, setSpeechError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastTranscript, setLastTranscript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [lastSpeechEvent, setLastSpeechEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const [speechEventCounts, setSpeechEventCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recognitionActiveRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const speechRestartTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const detectionLockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const headPitchHistoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lastNodTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastPitchRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastPitchDirRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Reset detection lock when enabled changes (but DON'T clear detectedInput state)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (enabled) {
            console.log('🔓 Resetting detection lock (detectionLockRef only)');
            detectionLockRef.current = false;
        // DON'T reset setDetectedInput here - it clears valid detections!
        }
    }, [
        enabled
    ]);
    // Callback ref for video element
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
        if (node) {
            console.log('📹 Video element mounted');
            setVideoElement(node);
            if (streamRef.current) {
                node.srcObject = streamRef.current;
                node.play().catch(()=>{
                // Autoplay can fail until user gesture; keep stream attached.
                });
            }
        }
    }, []);
    // MediaPipe face detection
    const faceDetection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$mediapipe$2d$face$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMediaPipeFace"])(videoElement, enabled);
    // Local speech recognition (Whisper-based) - memoize to prevent re-renders
    const shouldEnableLocalSpeech = enabled && !disableVoiceVolume && (!allowedInputTypes || allowedInputTypes.includes('voice'));
    const localSpeech = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$local$2d$speech$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalSpeech"])(shouldEnableLocalSpeech);
    // Update transcription from local speech - use timestamp to avoid re-render loops
    const lastTranscriptionTimestampRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (localSpeech.transcription) {
            // Only process if this is a NEW transcription
            if (localSpeech.transcription.timestamp !== lastTranscriptionTimestampRef.current) {
                lastTranscriptionTimestampRef.current = localSpeech.transcription.timestamp;
                console.log('🎤 Local speech transcription:', localSpeech.transcription.text);
                setLastTranscript(localSpeech.transcription.text);
                setTranscription(localSpeech.transcription);
                // Detect voice input from transcription
                if (!detectionLockRef.current && localSpeech.transcription.text.trim().length > 0) {
                    console.log('🎤 Voice detected via local transcription');
                    detectionLockRef.current = true;
                    setDetectedInput({
                        type: 'voice',
                        confidence: localSpeech.transcription.confidence,
                        data: {
                            text: localSpeech.transcription.text
                        }
                    });
                }
            }
        }
    }, [
        localSpeech.transcription?.timestamp
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('🎤 usePassiveSensing effect triggered', {
            enabled,
            suppressVoiceWhileSpeaking,
            allowedInputTypes,
            disableVoiceVolume,
            localSpeechAvailable: localSpeech.status.available,
            localSpeechRecording: localSpeech.status.recording
        });
        if (!enabled) {
            console.log('🎤 Hook is disabled, not starting');
            return;
        }
        let animationFrameId;
        let stream = null;
        // AUDIO DETECTION + LIVE TRANSCRIPTION
        const setupAudio = async ()=>{
            try {
                console.log('🎤 Requesting audio access...');
                const audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                audioContextRef.current = new AudioContext();
                analyserRef.current = audioContextRef.current.createAnalyser();
                const source = audioContextRef.current.createMediaStreamSource(audioStream);
                source.connect(analyserRef.current);
                analyserRef.current.fftSize = 2048;
                analyserRef.current.smoothingTimeConstant = 0.8;
                console.log('✓ Audio detection ready, analyser:', analyserRef.current);
                setAudioReady(true);
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (SpeechRecognition) {
                    console.log('🎤 Speech Recognition API available');
                    setSpeechAvailable(true);
                    if (!recognitionRef.current) {
                        console.log('🎤 Creating new SpeechRecognition instance');
                        recognitionRef.current = new SpeechRecognition();
                        recognitionRef.current.continuous = true;
                        recognitionRef.current.interimResults = true;
                        recognitionRef.current.lang = 'en-US';
                        console.log('🎤 SpeechRecognition configured:', {
                            continuous: recognitionRef.current.continuous,
                            interimResults: recognitionRef.current.interimResults,
                            lang: recognitionRef.current.lang
                        });
                    } else {
                        console.log('🎤 Reusing existing SpeechRecognition instance');
                    }
                    const bumpEvent = (name)=>{
                        console.log(`🎤 Speech event: ${name}`);
                        setLastSpeechEvent(name);
                        setSpeechEventCounts((prev)=>({
                                ...prev,
                                [name]: (prev[name] || 0) + 1
                            }));
                    };
                    recognitionRef.current.onstart = ()=>{
                        console.log('🎤 STARTED - Recognition is now listening');
                        setSpeechActive(true);
                        bumpEvent('start');
                    };
                    recognitionRef.current.onaudiostart = ()=>{
                        console.log('🎤 AUDIO START - User agent has started to capture audio');
                        bumpEvent('audio_start');
                    };
                    recognitionRef.current.onsoundstart = ()=>{
                        console.log('🎤 SOUND START - Any sound (including speech) has been detected');
                        bumpEvent('sound_start');
                    };
                    recognitionRef.current.onspeechstart = ()=>{
                        console.log('🎤 SPEECH START - Speech recognized by speech detection');
                        bumpEvent('speech_start');
                    };
                    recognitionRef.current.onspeechend = ()=>{
                        console.log('🎤 SPEECH END - Speech has stopped being detected');
                        bumpEvent('speech_end');
                    };
                    recognitionRef.current.onaudioend = ()=>{
                        console.log('🎤 AUDIO END - User agent has finished capturing audio');
                        bumpEvent('audio_end');
                    };
                    recognitionRef.current.onnomatch = ()=>{
                        console.log('🎤 NO MATCH - Speech was detected but no recognition result');
                        bumpEvent('no_match');
                    };
                    recognitionRef.current.onresult = (event)=>{
                        const last = event.results.length - 1;
                        const text = event.results[last][0].transcript;
                        const confidence = event.results[last][0].confidence;
                        const isFinal = event.results[last].isFinal;
                        console.log('🎤 RESULT:', {
                            text,
                            confidence,
                            isFinal,
                            resultCount: event.results.length,
                            suppressVoiceWhileSpeaking,
                            isTTSSpeaking: window.speechSynthesis.speaking,
                            allowedInputTypes,
                            detectionLocked: detectionLockRef.current
                        });
                        bumpEvent('result');
                        setLastTranscript(text.trim());
                        if (suppressVoiceWhileSpeaking && window.speechSynthesis.speaking) {
                            console.log('🎤 BLOCKED: TTS is speaking, ignoring transcription');
                            return;
                        }
                        if (allowedInputTypes && !allowedInputTypes.includes('voice')) {
                            console.log('🎤 BLOCKED: voice not in allowedInputTypes:', allowedInputTypes);
                            return;
                        }
                        console.log('🎤 Setting transcription state:', text.trim());
                        setTranscription({
                            text: text.trim(),
                            timestamp: Date.now(),
                            confidence: confidence || 0.8
                        });
                        if (!detectionLockRef.current && text.trim().length > 0) {
                            console.log('🎤 Voice detected via transcription, setting detectedInput');
                            detectionLockRef.current = true;
                            setDetectedInput({
                                type: 'voice',
                                confidence: confidence || 0.8,
                                data: {
                                    text
                                }
                            });
                        } else if (detectionLockRef.current) {
                            console.log('🎤 Detection lock is active, not setting detectedInput');
                        }
                    };
                    recognitionRef.current.onerror = (event)=>{
                        console.log('🎤 ERROR:', {
                            error: event.error,
                            message: event.message,
                            willRestart: event.error === 'aborted'
                        });
                        bumpEvent('error');
                        // Silently ignore network and no-speech errors
                        if (event.error === 'network' || event.error === 'no-speech') {
                            console.log('🎤 Ignoring network/no-speech error');
                            return;
                        }
                        setSpeechError(event.error || 'unknown');
                        if (event.error === 'aborted') {
                            console.log('🎤 Scheduling restart after abort');
                            scheduleSpeechRestart();
                        }
                    };
                    recognitionRef.current.onend = ()=>{
                        console.log('🎤 END - Recognition has stopped', {
                            wasActive: recognitionActiveRef.current,
                            enabled,
                            willRestart: enabled
                        });
                        bumpEvent('end');
                        recognitionActiveRef.current = false;
                        setSpeechActive(false);
                        if (!enabled) {
                            console.log('🎤 Not enabled, not restarting');
                            return;
                        }
                        console.log('🎤 Scheduling restart');
                        scheduleSpeechRestart();
                    };
                    console.log('🎤 All event handlers attached, calling startSpeechRecognition()');
                    startSpeechRecognition();
                } else {
                    console.warn('⚠️ Speech Recognition API not available');
                    setSpeechAvailable(false);
                }
            } catch (err) {
                console.warn('Audio access denied:', err);
                setAudioReady(false);
            }
        };
        // VIDEO DETECTION
        const setupVideo = async ()=>{
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                streamRef.current = stream;
                if (videoElement) {
                    videoElement.srcObject = stream;
                    await videoElement.play();
                    console.log('✓ Video detection ready, element:', videoElement.videoWidth, 'x', videoElement.videoHeight);
                    setVideoReady(true);
                }
            } catch (err) {
                console.warn('Video access denied:', err);
                setVideoReady(false);
            }
        };
        // KEYBOARD / SWITCH
        const handleKeyPress = (e)=>{
            if (detectionLockRef.current) return;
            if (allowedInputTypes && !allowedInputTypes.includes('switch')) return;
            console.log('🎹 Keyboard/Switch detected:', e.key);
            detectionLockRef.current = true;
            setDetectedInput({
                type: 'switch',
                confidence: 1.0,
                data: {
                    key: e.key
                }
            });
        };
        // MOUSE MOVEMENT
        let mousePositions = [];
        const handleMouseMove = (e)=>{
            if (detectionLockRef.current) return;
            if (allowedInputTypes && !allowedInputTypes.includes('motion')) return;
            const now = Date.now();
            mousePositions.push({
                x: e.clientX,
                y: e.clientY,
                time: now
            });
            if (mousePositions.length > 10) mousePositions.shift();
            if (mousePositions.length >= 5) {
                const recentPositions = mousePositions.slice(-5);
                const timeSpan = recentPositions[4].time - recentPositions[0].time;
                if (timeSpan > 0) {
                    const totalDistance = recentPositions.reduce((sum, pos, i)=>{
                        if (i === 0) return 0;
                        const prev = recentPositions[i - 1];
                        const dx = pos.x - prev.x;
                        const dy = pos.y - prev.y;
                        return sum + Math.sqrt(dx * dx + dy * dy);
                    }, 0);
                    const velocity = totalDistance / (timeSpan / 1000);
                    if (velocity > 50) {
                        console.log('🖱️ Mouse motion detected, velocity:', velocity.toFixed(0), 'px/sec');
                        detectionLockRef.current = true;
                        setDetectedInput({
                            type: 'motion',
                            confidence: 0.9,
                            data: {
                                source: 'mouse',
                                velocity
                            }
                        });
                    }
                }
            }
        };
        // TOUCH
        const handleTouchStart = (e)=>{
            if (detectionLockRef.current) return;
            if (allowedInputTypes && !allowedInputTypes.includes('motion')) return;
            console.log('👆 Touch detected');
            detectionLockRef.current = true;
            setDetectedInput({
                type: 'motion',
                confidence: 1.0,
                data: {
                    source: 'touch'
                }
            });
        };
        // GAMEPAD
        const checkGamepads = ()=>{
            const gamepads = navigator.getGamepads();
            for (const gamepad of gamepads){
                if (gamepad && !detectionLockRef.current) {
                    for(let i = 0; i < gamepad.buttons.length; i++){
                        if (gamepad.buttons[i].pressed) {
                            if (allowedInputTypes && !allowedInputTypes.includes('switch')) return;
                            console.log('🎮 Gamepad button detected:', i);
                            detectionLockRef.current = true;
                            setDetectedInput({
                                type: 'switch',
                                confidence: 1.0,
                                data: {
                                    source: 'gamepad',
                                    button: i
                                }
                            });
                            return;
                        }
                    }
                }
            }
        };
        // AUDIO LEVEL MONITORING
        const voiceDetectionCountRef = {
            current: 0
        } // Use an object so it persists across calls
        ;
        const monitorAudio = ()=>{
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b)=>a + b) / dataArray.length;
            setAudioLevel(average);
            // Debug: Log audio level periodically
            if (Math.random() < 0.1) {
                console.log('🔊 Audio level:', average.toFixed(1));
            }
            // Audio detection via volume
            if (!disableVoiceVolume && (!suppressVoiceWhileSpeaking || !window.speechSynthesis.speaking) && average > voiceVolumeThreshold) {
                if (allowedInputTypes && !allowedInputTypes.includes('voice')) {
                    return;
                }
                voiceDetectionCountRef.current++;
                if (voiceDetectionCountRef.current >= voiceConsecutiveFrames && !detectionLockRef.current) {
                    console.log('🎤 Voice detected via volume, level:', average.toFixed(1), 'Setting detection lock and state...');
                    detectionLockRef.current = true;
                    const detection = {
                        type: 'voice',
                        confidence: Math.min(average / 50, 1.0),
                        data: {
                            volume: average
                        }
                    };
                    console.log('🎤 Calling setDetectedInput with:', detection);
                    setDetectedInput(detection);
                }
            } else {
                voiceDetectionCountRef.current = 0;
            }
        };
        const monitor = ()=>{
            monitorAudio();
            checkGamepads();
            animationFrameId = requestAnimationFrame(monitor);
        };
        console.log('🔍 Protocol Omega: Starting omni-listener...');
        setupAudio();
        setupVideo();
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart);
        monitor();
        return ()=>{
            console.log('🛑 Protocol Omega: Stopping omni-listener');
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            if (stream) stream.getTracks().forEach((track)=>track.stop());
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track)=>track.stop());
                streamRef.current = null;
            }
            if (audioContextRef.current) audioContextRef.current.close();
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch  {}
                recognitionActiveRef.current = false;
                setSpeechActive(false);
            }
            if (speechRestartTimerRef.current) {
                clearTimeout(speechRestartTimerRef.current);
                speechRestartTimerRef.current = null;
            }
        };
    }, [
        enabled,
        videoElement
    ]);
    // MEDIAPIPE FACE DETECTION
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled || detectionLockRef.current) return;
        console.log('👁️ Checking face detection...', {
            enabled,
            locked: detectionLockRef.current,
            hasBlinkDetection: !!faceDetection.blinkDetected,
            hasHeadRotation: !!faceDetection.headRotation,
            hasGazeDirection: !!faceDetection.gazeDirection
        });
        // Blink detection
        if (faceDetection.blinkDetected) {
            if (allowedInputTypes && !allowedInputTypes.includes('blink')) return;
            console.log('👁️ BLINK DETECTED via MediaPipe!');
            detectionLockRef.current = true;
            setDetectedInput({
                type: 'blink',
                confidence: 1.0,
                data: {
                    source: 'mediapipe'
                }
            });
            return;
        }
        // Head rotation detection
        if (faceDetection.headRotation) {
            if (allowedInputTypes && !allowedInputTypes.includes('head')) {
                return;
            }
            const { pitch, yaw, roll } = faceDetection.headRotation;
            const totalRotation = Math.abs(pitch) + Math.abs(yaw) + Math.abs(roll);
            // Simple nod detector: detect pitch swing with direction changes.
            const now = Date.now();
            const history = headPitchHistoryRef.current;
            history.push({
                t: now,
                pitch
            });
            while(history.length > 0 && now - history[0].t > 900){
                history.shift();
            }
            if (now - lastNodTimeRef.current < 800) {
                return;
            }
            if (history.length >= 6) {
                let minPitch = history[0].pitch;
                let maxPitch = history[0].pitch;
                let signChanges = 0;
                let lastDir = lastPitchDirRef.current;
                let prevPitch = lastPitchRef.current;
                for (const h of history){
                    if (h.pitch < minPitch) minPitch = h.pitch;
                    if (h.pitch > maxPitch) maxPitch = h.pitch;
                    if (prevPitch !== null) {
                        const delta = h.pitch - prevPitch;
                        const dir = delta > 0.2 ? 1 : delta < -0.2 ? -1 : 0;
                        if (dir !== 0 && lastDir !== 0 && dir !== lastDir) {
                            signChanges++;
                        }
                        if (dir !== 0) lastDir = dir;
                    }
                    prevPitch = h.pitch;
                }
                const swing = maxPitch - minPitch;
                if (swing >= 14 && signChanges >= 2) {
                    console.log('HEAD NOD DETECTED', {
                        minPitch: minPitch.toFixed(1),
                        maxPitch: maxPitch.toFixed(1),
                        swing: swing.toFixed(1),
                        signChanges
                    });
                    lastNodTimeRef.current = now;
                    detectionLockRef.current = true;
                    headPitchHistoryRef.current = [];
                    lastPitchRef.current = null;
                    lastPitchDirRef.current = 0;
                    setDetectedInput({
                        type: 'head',
                        confidence: 0.95,
                        data: {
                            pitch,
                            yaw,
                            roll,
                            nod: true
                        }
                    });
                    return;
                }
            }
            lastPitchRef.current = pitch;
            // Very sensitive threshold for onboarding: >5 degrees
            if (totalRotation > 3) {
                console.log('🗣️ HEAD MOTION DETECTED!', {
                    pitch: pitch.toFixed(1),
                    yaw: yaw.toFixed(1),
                    roll: roll.toFixed(1),
                    total: totalRotation.toFixed(1)
                });
                detectionLockRef.current = true;
                setDetectedInput({
                    type: 'head',
                    confidence: 0.9,
                    data: {
                        pitch,
                        yaw,
                        roll
                    }
                });
                return;
            }
        }
        // Gaze detection - more sensitive for onboarding
        if (!disableGaze && faceDetection.gazeDirection) {
            if (allowedInputTypes && !allowedInputTypes.includes('gaze')) return;
            const { x, y } = faceDetection.gazeDirection;
            const gazeDistance = Math.sqrt(x * x + y * y);
            if (gazeDistance > 0.5) {
                console.log('👀 GAZE DETECTED!', {
                    x: x.toFixed(2),
                    y: y.toFixed(2),
                    distance: gazeDistance.toFixed(2)
                });
                detectionLockRef.current = true;
                setDetectedInput({
                    type: 'gaze',
                    confidence: 0.85,
                    data: {
                        x,
                        y
                    }
                });
            }
        }
    }, [
        enabled,
        faceDetection
    ]);
    // Auto-clear transcription
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!transcription) return;
        const timer = setTimeout(()=>setTranscription(null), 3000);
        return ()=>clearTimeout(timer);
    }, [
        transcription
    ]);
    // Removed old throttled logging - now done at return statement
    const startSpeechRecognition = ()=>{
        console.log('🎤 startSpeechRecognition() called', {
            hasRecognition: !!recognitionRef.current,
            isActive: recognitionActiveRef.current,
            enabled,
            isTTSSpeaking: window.speechSynthesis.speaking,
            speechSynthesisPending: window.speechSynthesis.pending
        });
        if (!recognitionRef.current) {
            console.log('🎤 ABORT: No recognition ref');
            return;
        }
        if (recognitionActiveRef.current) {
            console.log('🎤 ABORT: Already active');
            return;
        }
        try {
            console.log('🎤 Calling recognition.start()...');
            recognitionRef.current.start();
            recognitionActiveRef.current = true;
            console.log('✓ Live transcription ready - recognition.start() succeeded');
            setSpeechActive(true);
            setSpeechError(null);
        } catch (err) {
            console.error('🎤 FAILED to start speech recognition:', err.message, err);
            setSpeechError('start_failed');
        }
    };
    const scheduleSpeechRestart = ()=>{
        console.log('🎤 scheduleSpeechRestart() called', {
            hasRecognition: !!recognitionRef.current,
            enabled,
            hasExistingTimer: !!speechRestartTimerRef.current
        });
        if (!recognitionRef.current || !enabled) {
            console.log('🎤 ABORT restart: no recognition or not enabled');
            return;
        }
        if (speechRestartTimerRef.current) {
            console.log('🎤 ABORT restart: timer already scheduled');
            return;
        }
        console.log('🎤 Scheduling restart in 800ms...');
        speechRestartTimerRef.current = window.setTimeout(()=>{
            console.log('🎤 Restart timer fired');
            speechRestartTimerRef.current = null;
            startSpeechRecognition();
        }, 800);
    };
    const status = {
        audioReady,
        videoReady,
        speechAvailable,
        speechActive,
        speechError,
        mediaPipeReady: faceDetection.ready,
        faceDetected: faceDetection.faceDetected,
        detectionLocked: detectionLockRef.current,
        audioLevel,
        lastTranscript,
        lastSpeechEvent,
        speechEventCounts,
        localSpeechAvailable: localSpeech.status.available,
        localSpeechRecording: localSpeech.status.recording,
        localSpeechError: localSpeech.status.error
    };
    // Periodic detailed logging (every 2s)
    if (Math.random() < 0.03) {
        console.log('🔄 usePassiveSensing STATE:', {
            enabled,
            hasDetectedInput: !!detectedInput,
            detectedInputType: detectedInput?.type,
            hasTranscription: !!transcription,
            transcriptionText: transcription?.text,
            audioLevel: Math.round(audioLevel),
            speechStatus: {
                available: speechAvailable,
                active: speechActive,
                error: speechError,
                lastEvent: lastSpeechEvent,
                lastTranscript,
                isTTSSpeaking: window.speechSynthesis.speaking
            }
        });
    }
    return {
        detectedInput,
        transcription,
        audioLevel,
        videoRef,
        faceData: faceDetection,
        requestSpeechStart: startSpeechRecognition,
        status
    };
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BeaconScreen",
    ()=>BeaconScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-passive-sensing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/hand.js [app-ssr] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-ssr] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/smile.js [app-ssr] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/move.js [app-ssr] (ecmascript) <export default as Move>");
'use client';
;
;
;
;
function BeaconScreen({ onInputDetected }) {
    const [audioPlayed, setAudioPlayed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeoutCounter, setTimeoutCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [autoScanStarted, setAutoScanStarted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { detectedInput, transcription, audioLevel, videoRef, faceData, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePassiveSensing"])(true, {
        voiceVolumeThreshold: 25,
        voiceConsecutiveFrames: 3,
        suppressVoiceWhileSpeaking: true
    });
    const scanIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-play welcome audio (ONCE)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (audioPlayed) return;
        const speak = ()=>{
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance('I am listening. Make any sound, move your head, or press any switch to start.');
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
            setAudioPlayed(true);
        };
        const timer = setTimeout(speak, 500);
        return ()=>clearTimeout(timer);
    }, [
        audioPlayed
    ]);
    // Counter for timeout
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (detectedInput) return;
        const interval = setInterval(()=>{
            setTimeoutCounter((prev)=>prev + 1);
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        detectedInput
    ]);
    // Repeat reminder every 15 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (detectedInput || autoScanStarted || timeoutCounter === 0) return;
        if (timeoutCounter % 15 === 0) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance('Still listening. Make any sound or movement to begin.');
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, [
        timeoutCounter,
        detectedInput,
        autoScanStarted
    ]);
    // Auto-scan mode after 30 seconds (ONCE)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (timeoutCounter >= 30 && !detectedInput && !autoScanStarted) {
            setAutoScanStarted(true);
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance('Entering auto-scan mode. Press any key or make a sound when you hear Setup.');
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
            utterance.onend = ()=>{
                let scanIndex = 0;
                const options = [
                    'Setup',
                    'Exit'
                ];
                scanIntervalRef.current = setInterval(()=>{
                    const scanUtterance = new SpeechSynthesisUtterance(options[scanIndex]);
                    scanUtterance.rate = 0.9;
                    window.speechSynthesis.speak(scanUtterance);
                    scanIndex = (scanIndex + 1) % options.length;
                }, 2000);
            };
        }
    }, [
        timeoutCounter,
        detectedInput,
        autoScanStarted
    ]);
    // Cleanup scan interval when input detected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (detectedInput && scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
            window.speechSynthesis.cancel();
        }
    }, [
        detectedInput
    ]);
    // Handle detected input - for onboarding, accept ANY detection (no confidence threshold)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log('🚨 BeaconScreen detectedInput changed:', detectedInput);
        if (detectedInput) {
            console.log('🚨 Calling onInputDetected with type:', detectedInput.type, 'confidence:', detectedInput.confidence);
            onInputDetected(detectedInput.type);
        }
    }, [
        detectedInput,
        onInputDetected
    ]);
    // CRITICAL: Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            window.speechSynthesis.cancel();
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current);
            }
        };
    }, []);
    // Draw waveform visualization - ACCESSIBLE: Yellow on Black
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const draw = ()=>{
            // Black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const barCount = 50;
            const barWidth = canvas.width / barCount;
            const normalizedLevel = Math.min(audioLevel / 100, 1);
            for(let i = 0; i < barCount; i++){
                const phase = i / barCount * Math.PI * 2;
                const amplitude = Math.sin(phase + Date.now() / 200) * 0.5 + 0.5;
                const height = amplitude * normalizedLevel * canvas.height * 0.8;
                // ACCESSIBLE: Solid yellow, no gradients
                ctx.fillStyle = '#FFFF00';
                const x = i * barWidth;
                const y = (canvas.height - height) / 2;
                ctx.fillRect(x, y, barWidth - 2, height);
            }
        };
        draw();
    }, [
        audioLevel
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black flex flex-col items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                className: "hidden",
                playsInline: true,
                muted: true
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-32 h-32 rounded-full bg-white animate-pulse",
                        style: {
                            animationDuration: '3s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 158,
                        columnNumber: 17
                    }, this),
                    detectedInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center",
                        children: [
                            detectedInput.type === 'voice' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 163,
                                columnNumber: 60
                            }, this),
                            detectedInput.type === 'motion' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 164,
                                columnNumber: 61
                            }, this),
                            detectedInput.type === 'switch' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 165,
                                columnNumber: 61
                            }, this),
                            detectedInput.type === 'blink' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 166,
                                columnNumber: 60
                            }, this),
                            detectedInput.type === 'gaze' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 167,
                                columnNumber: 59
                            }, this),
                            detectedInput.type === 'head' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 168,
                                columnNumber: 59
                            }, this),
                            detectedInput.type === 'sign' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 169,
                                columnNumber: 59
                            }, this),
                            detectedInput.type === 'facial' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 170,
                                columnNumber: 61
                            }, this),
                            detectedInput.type === 'sip-puff' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
                                className: "h-16 w-16 text-black animate-bounce"
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                                lineNumber: 171,
                                columnNumber: 63
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 162,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 157,
                columnNumber: 13
            }, this),
            faceData?.gazeDirection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-lg transition-transform duration-100",
                    style: {
                        transform: `translate(calc(-50% + ${faceData.gazeDirection.x * 100}px), calc(-50% + ${faceData.gazeDirection.y * 100}px))`
                    }
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                    lineNumber: 179,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 178,
                columnNumber: 17
            }, this),
            faceData?.headRotation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-8 left-8 bg-black/80 text-white p-4 rounded-lg font-mono text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Pitch: ",
                            faceData.headRotation.pitch.toFixed(1),
                            "°"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 191,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Yaw: ",
                            faceData.headRotation.yaw.toFixed(1),
                            "°"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 192,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Roll: ",
                            faceData.headRotation.roll.toFixed(1),
                            "°"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 193,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 font-bold",
                        children: [
                            "Total: ",
                            (Math.abs(faceData.headRotation.pitch) + Math.abs(faceData.headRotation.yaw) + Math.abs(faceData.headRotation.roll)).toFixed(1),
                            "°"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 194,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 190,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                    ref: canvasRef,
                    width: 600,
                    height: 100,
                    className: "rounded-lg border-2 border-white/20"
                }, void 0, false, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                    lineNumber: 201,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 200,
                columnNumber: 13
            }, this),
            transcription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl px-8 py-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white text-2xl font-bold text-center",
                        children: [
                            '"',
                            transcription.text,
                            '"'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 211,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/60 text-sm text-center mt-2",
                        children: [
                            "Confidence: ",
                            (transcription.confidence * 100).toFixed(0),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 214,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 210,
                columnNumber: 17
            }, this),
            autoScanStarted && !detectedInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-16 text-white text-2xl font-black",
                children: "Auto-Scan Mode Active"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 221,
                columnNumber: 17
            }, this),
            !transcription && !detectedInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white/60 text-lg font-medium text-center max-w-xl",
                children: autoScanStarted ? 'Press any key when you hear "Setup"' : 'Listening for voice, motion, keyboard, or any input...'
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 227,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-72",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-bold mb-2",
                        children: "System Status"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 236,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Mic: ",
                            status.audioReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 237,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Camera: ",
                            status.videoReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 238,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech API: ",
                            status.speechAvailable ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 239,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Active: ",
                            status.speechActive ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 240,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Error: ",
                            status.speechError ?? 'none'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 241,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "MediaPipe: ",
                            status.mediaPipeReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 242,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Face Detected: ",
                            status.faceDetected ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 243,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Detection Lock: ",
                            status.detectionLocked ? 'LOCKED' : 'OPEN'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 244,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Audio Level: ",
                            Math.round(status.audioLevel)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 245,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Last Transcript: ",
                            status.lastTranscript || '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 246,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Event: ",
                            status.lastSpeechEvent
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                        lineNumber: 247,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 235,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sr-only",
                role: "status",
                "aria-live": "polite",
                children: [
                    detectedInput ? `${detectedInput.type} input detected` : autoScanStarted ? 'Auto-scan mode active. Press any key when you hear Setup.' : 'Waiting for input. Make any sound or movement to begin.',
                    transcription && ` Heard: ${transcription.text}`
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
                lineNumber: 250,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx",
        lineNumber: 154,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LockOnScreen",
    ()=>LockOnScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-passive-sensing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function LockOnScreen({ detectedInput, onConfirmed, onTimeout }) {
    const [confirmed, setConfirmed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listenForConfirm, setListenForConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sensingEnabled, setSensingEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmCount, setConfirmCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [timeoutCounter, setTimeoutCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const requiredConfirmations = 3;
    // Re-enable passive sensing for confirmation ONLY after initial delay
    const { detectedInput: confirmInput, videoRef, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePassiveSensing"])(sensingEnabled && !confirmed, {
        disableGaze: detectedInput === 'head',
        disableVoiceVolume: true,
        suppressVoiceWhileSpeaking: true,
        allowedInputTypes: [
            detectedInput
        ] // Only allow the specific detected input
    });
    const messages = {
        voice: {
            initial: 'I heard a voice. Speak 3 times to confirm.',
            confirm: 'Speak now.',
            detected: 'Voice confirmed!'
        },
        motion: {
            initial: 'I see movement. Move 3 times to confirm.',
            confirm: 'Move your mouse again.',
            detected: 'Motion confirmed!'
        },
        switch: {
            initial: 'Switch detected. Press 3 times to confirm.',
            confirm: 'Press your switch.',
            detected: 'Switch confirmed!'
        },
        blink: {
            initial: 'I saw a blink. Blink 3 times to confirm.',
            confirm: 'Blink deliberately.',
            detected: 'Blink confirmed!'
        },
        gaze: {
            initial: 'Eye gaze detected. Look away and back 3 times.',
            confirm: 'Look away and back.',
            detected: 'Eye gaze confirmed!'
        },
        head: {
            initial: 'Head movement detected. Nod 3 times to confirm.',
            confirm: 'Nod your head.',
            detected: 'Head motion confirmed!'
        },
        sign: {
            initial: 'Sign language detected. Repeat 3 times to confirm.',
            confirm: 'Repeat your gesture.',
            detected: 'Sign language confirmed!'
        },
        facial: {
            initial: 'Facial expression detected. Make it 3 times to confirm.',
            confirm: 'Make the expression.',
            detected: 'Facial expression confirmed!'
        },
        'sip-puff': {
            initial: 'Sip or puff detected. Do it 3 times to confirm.',
            confirm: 'Sip or puff.',
            detected: 'Sip-puff confirmed!'
        },
        none: {
            initial: 'Waiting for input...',
            confirm: 'Please try again.',
            detected: 'Input confirmed!'
        }
    };
    const message = messages[detectedInput] || messages.none;
    // Auto-play audio (ONCE)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message.initial);
        utterance.rate = 0.9;
        // Wait for TTS to finish, then enable listening
        utterance.onend = ()=>{
            console.log('🎯 TTS finished, enabling listening');
            setTimeout(()=>{
                window.speechSynthesis.cancel(); // Ensure fully cancelled
                setListenForConfirm(true);
                setSensingEnabled(true);
                console.log('🎯 Lock-on: Ready for confirmation input');
            }, 200);
        };
        window.speechSynthesis.speak(utterance);
    }, []); // Empty deps - only run once
    // Timeout counter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (confirmed || !listenForConfirm) return;
        const interval = setInterval(()=>{
            setTimeoutCounter((prev)=>{
                if (prev + 1 >= 30) {
                    console.log('⏰ Confirmation timeout');
                    if (onTimeout) onTimeout();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        confirmed,
        listenForConfirm,
        onTimeout
    ]);
    // Listen for confirmation via passive sensing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!listenForConfirm || confirmed || !confirmInput) return;
        // Check if the same input type was detected again
        if (confirmInput.type === detectedInput) {
            const newCount = confirmCount + 1;
            console.log(`✓ Confirmation ${newCount}/${requiredConfirmations}:`, confirmInput.type);
            setConfirmCount(newCount);
            // Visual/audio feedback
            const beep = new SpeechSynthesisUtterance(`${newCount}`);
            beep.rate = 1.2;
            beep.volume = 0.8;
            window.speechSynthesis.speak(beep);
            if (newCount >= requiredConfirmations) {
                confirmInputAction();
            } else {
                // Reset sensing to allow next detection
                setSensingEnabled(false);
                setTimeout(()=>setSensingEnabled(true), 500);
            }
        }
    }, [
        confirmInput,
        listenForConfirm,
        confirmed,
        detectedInput,
        confirmCount
    ]);
    // Listen for confirmation input (fallback for non-passive inputs)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!listenForConfirm || confirmed) return;
        let clickCount = 0;
        let clickTimer;
        const handleConfirm = (e)=>{
            if (detectedInput === 'switch' && (e.key === ' ' || e.key === 'Enter')) {
                const newCount = confirmCount + 1;
                setConfirmCount(newCount);
                console.log(`✓ Switch confirmation ${newCount}/${requiredConfirmations}`);
                if (newCount >= requiredConfirmations) {
                    confirmInputAction();
                }
            }
        };
        const handleClick = ()=>{
            if (detectedInput === 'motion') {
                clickCount++;
                console.log(`🖱️ Motion confirmation ${clickCount}/${requiredConfirmations}`);
                setConfirmCount(clickCount);
                if (clickCount >= requiredConfirmations) {
                    confirmInputAction();
                }
                clearTimeout(clickTimer);
                clickTimer = setTimeout(()=>{
                    clickCount = 0;
                }, 2000);
            }
        };
        window.addEventListener('keydown', handleConfirm);
        window.addEventListener('click', handleClick);
        return ()=>{
            window.removeEventListener('keydown', handleConfirm);
            window.removeEventListener('click', handleClick);
            clearTimeout(clickTimer);
        };
    }, [
        listenForConfirm,
        confirmed,
        detectedInput,
        confirmCount
    ]);
    const confirmInputAction = ()=>{
        if (confirmed) return;
        setConfirmed(true);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message.detected);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        setTimeout(()=>{
            onConfirmed();
        }, 1500);
    };
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            window.speechSynthesis.cancel();
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                className: "hidden",
                playsInline: true,
                muted: true
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                lineNumber: 219,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl text-center space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-6xl font-black transition-all duration-500 ${confirmed ? 'scale-125 text-green-400' : ''}`,
                        children: confirmed ? '✓' : '?'
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 222,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-black",
                        children: confirmed ? message.detected : message.initial
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 226,
                        columnNumber: 17
                    }, this),
                    !confirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl text-gray-400",
                                children: message.confirm
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                                lineNumber: 232,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center gap-4 mt-8",
                                children: [
                                    ...Array(requiredConfirmations)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-2xl font-black transition-all ${i < confirmCount ? 'bg-green-500 scale-110' : 'bg-white/20'}`,
                                        children: i < confirmCount ? '✓' : i + 1
                                    }, i, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                                        lineNumber: 239,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                                lineNumber: 237,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-4",
                                children: [
                                    "Time remaining: ",
                                    30 - timeoutCounter,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                                lineNumber: 251,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true),
                    !confirmed && listenForConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>{
                            const newCount = confirmCount + 1;
                            setConfirmCount(newCount);
                            if (newCount >= requiredConfirmations) {
                                confirmInputAction();
                            }
                        },
                        className: "mt-8 text-xl px-8 py-6 font-bold border-4 border-white bg-green-600 hover:bg-green-700 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                        children: [
                            "Count (",
                            confirmCount,
                            "/",
                            requiredConfirmations,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 259,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                lineNumber: 221,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sr-only",
                role: "status",
                "aria-live": "polite",
                children: confirmed ? message.detected : message.initial
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                lineNumber: 274,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-bold mb-2",
                        children: "System Status"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 280,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Mic: ",
                            status.audioReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 281,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Camera: ",
                            status.videoReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 282,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 font-bold",
                        children: "Web Speech API"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 283,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Available: ",
                            status.speechAvailable ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 284,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Active: ",
                            status.speechActive ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 285,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Error: ",
                            status.speechError ?? 'none'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 286,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 font-bold",
                        children: "Local Speech (Whisper)"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 287,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: status.localSpeechAvailable ? 'text-green-400' : 'text-red-400',
                        children: [
                            "Service: ",
                            status.localSpeechAvailable ? 'READY ✓' : 'NOT RUNNING ✗'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 288,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Recording: ",
                            status.localSpeechRecording ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 291,
                        columnNumber: 17
                    }, this),
                    status.localSpeechError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-yellow-400 text-xs mt-1",
                        children: status.localSpeechError
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 293,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 font-bold",
                        children: "Detection"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 297,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "MediaPipe: ",
                            status.mediaPipeReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 298,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Face: ",
                            status.faceDetected ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 299,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Lock: ",
                            status.detectionLocked ? 'LOCKED' : 'OPEN'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 300,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Audio Level: ",
                            Math.round(status.audioLevel)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 301,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 font-bold",
                        children: "Transcript"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 302,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white break-words",
                        children: status.lastTranscript || '—'
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                        lineNumber: 303,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
                lineNumber: 279,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx",
        lineNumber: 217,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputExplorer",
    ()=>InputExplorer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/use-passive-sensing.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-ssr] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/hand.js [app-ssr] (ecmascript) <export default as Hand>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-ssr] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/smile.js [app-ssr] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/move.js [app-ssr] (ecmascript) <export default as Move>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
'use client';
;
;
;
;
;
function InputExplorer({ primaryInput, detectedInputs: initialInputs, onComplete }) {
    const [detectedInputs, setDetectedInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialInputs);
    const [testedInputs, setTestedInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialInputs);
    const [currentlyTesting, setCurrentlyTesting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [skipCount, setSkipCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [confirmCount, setConfirmCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sensingEnabled, setSensingEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [timeoutCounter, setTimeoutCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [voiceChallenge, setVoiceChallenge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [voiceChallengeStart, setVoiceChallengeStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [voiceChallengeExpires, setVoiceChallengeExpires] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [voiceSessionStart, setVoiceSessionStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const requiredConfirmations = 3;
    const { detectedInput, transcription, videoRef, status, requestSpeechStart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$use$2d$passive$2d$sensing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePassiveSensing"])(sensingEnabled && !!currentlyTesting, {
        disableVoiceVolume: currentlyTesting !== 'voice',
        disableGaze: currentlyTesting === 'head',
        disableVoiceVolume: primaryInput === 'voice',
        allowedInputTypes: currentlyTesting === 'head' ? [
            'head'
        ] : undefined
    });
    // All possible inputs to test
    const allInputTypes = [
        'voice',
        'head',
        'blink',
        'gaze',
        'switch',
        'motion',
        'sign',
        'facial',
        'sip-puff'
    ];
    // Inputs we haven't tested yet
    const untested = allInputTypes.filter((input)=>!testedInputs.includes(input));
    const inputIcons = {
        voice: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 45,
            columnNumber: 16
        }, this),
        motion: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 46,
            columnNumber: 17
        }, this),
        switch: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 47,
            columnNumber: 17
        }, this),
        blink: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 48,
            columnNumber: 16
        }, this),
        gaze: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 49,
            columnNumber: 15
        }, this),
        head: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 50,
            columnNumber: 15
        }, this),
        sign: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Hand$3e$__["Hand"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 51,
            columnNumber: 15
        }, this),
        facial: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 52,
            columnNumber: 17
        }, this),
        'sip-puff': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 53,
            columnNumber: 21
        }, this),
        none: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
            className: "h-12 w-12"
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 54,
            columnNumber: 15
        }, this)
    };
    const inputPrompts = {
        voice: 'Voice check: say the word shown on screen. Get 3 correct in a row.',
        head: 'Can you move your head? Nod 3 times.',
        blink: 'Can you blink deliberately? Blink 3 times.',
        gaze: 'Can you move your eyes? Look away and back 3 times.',
        switch: 'Can you use a keyboard or switch? Press any key 3 times.',
        motion: 'Can you use a mouse or touch? Click anywhere 3 times.',
        sign: 'Can you make hand gestures? Make a gesture 3 times.',
        facial: 'Can you make facial expressions? Smile or frown 3 times.',
        'sip-puff': 'Can you use sip-puff controls? Use them 3 times.',
        none: ''
    };
    const skipPrompt = primaryInput === 'voice' ? 'Say "skip" 3 times to skip' : primaryInput === 'head' ? 'Nod 3 times to skip' : primaryInput === 'blink' ? 'Blink 3 times to skip' : primaryInput === 'switch' ? 'Press any key 3 times to skip' : 'Use your primary input 3 times to skip';
    // Auto-start testing next input
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!currentlyTesting && untested.length > 0) {
            const nextInput = untested[0];
            setCurrentlyTesting(nextInput);
            setConfirmCount(0);
            setSkipCount(0);
            setTimeoutCounter(0);
            setSensingEnabled(false);
            setTimeout(()=>setSensingEnabled(true), 50);
            setVoiceChallenge(null);
            setVoiceChallengeStart(0);
            setVoiceChallengeExpires(0);
            setVoiceSessionStart(Date.now());
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Let's try ${nextInput}. ${inputPrompts[nextInput]} Or ${skipPrompt}.`);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else if (untested.length === 0 && currentlyTesting === null) {
            // All done!
            onComplete(detectedInputs);
        }
    }, [
        currentlyTesting,
        untested.length,
        detectedInputs,
        onComplete
    ]);
    // Watchdog: if we ever get stuck on the "Analyzing inputs..." screen, advance.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentlyTesting !== null) return;
        const timer = setTimeout(()=>{
            if (untested.length > 0) {
                setCurrentlyTesting(untested[0]);
            } else {
                onComplete(detectedInputs);
            }
        }, 1500);
        return ()=>clearTimeout(timer);
    }, [
        currentlyTesting,
        untested.length,
        onComplete,
        detectedInputs
    ]);
    // Timeout counter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!currentlyTesting) return;
        const interval = setInterval(()=>{
            setTimeoutCounter((prev)=>{
                if (prev + 1 >= 30) {
                    console.log('⏰ Timeout - skipping', currentlyTesting);
                    handleSkip();
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
        currentlyTesting
    ]);
    const pickVoiceChallenge = ()=>{
        const categories = [
            {
                category: 'color',
                words: [
                    'red',
                    'blue',
                    'green',
                    'yellow',
                    'orange',
                    'purple'
                ]
            },
            {
                category: 'shape',
                words: [
                    'circle',
                    'square',
                    'triangle',
                    'star',
                    'heart'
                ]
            },
            {
                category: 'fruit',
                words: [
                    'apple',
                    'banana',
                    'orange',
                    'grape',
                    'pear'
                ]
            }
        ];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const word = cat.words[Math.floor(Math.random() * cat.words.length)];
        setVoiceChallenge({
            category: cat.category,
            word
        });
        const now = Date.now();
        setVoiceChallengeStart(now);
        setVoiceChallengeExpires(now + 10000);
    };
    // Voice challenge lifecycle
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentlyTesting !== 'voice') return;
        if (!voiceChallenge) {
            pickVoiceChallenge();
            return;
        }
        const timer = setInterval(()=>{
            const now = Date.now();
            if (now >= voiceChallengeExpires) {
                pickVoiceChallenge();
            }
        }, 500);
        return ()=>clearInterval(timer);
    }, [
        currentlyTesting,
        voiceChallenge,
        voiceChallengeExpires
    ]);
    // Listen for new input detection
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!detectedInput || !currentlyTesting) return;
        if (currentlyTesting === 'voice') return;
        // Testing for this specific input
        if (detectedInput.type === currentlyTesting) {
            const newCount = confirmCount + 1;
            console.log(`✓ ${currentlyTesting} confirmation ${newCount}/${requiredConfirmations}`);
            setConfirmCount(newCount);
            const beep = new SpeechSynthesisUtterance(`${newCount}`);
            beep.rate = 1.2;
            window.speechSynthesis.speak(beep);
            if (newCount >= requiredConfirmations) {
                handleConfirm(currentlyTesting);
            } else {
                // Reset sensing
                setSensingEnabled(false);
                setTimeout(()=>setSensingEnabled(true), 500);
            }
        } else if (detectedInput.type === primaryInput && primaryInput !== 'voice') {
            const newCount = skipCount + 1;
            console.log(`⏭️ Skip count ${newCount}/${requiredConfirmations}`);
            setSkipCount(newCount);
            const beep = new SpeechSynthesisUtterance(`skip ${newCount}`);
            beep.rate = 1.2;
            window.speechSynthesis.speak(beep);
            if (newCount >= requiredConfirmations) {
                handleSkip();
            } else {
                // Reset sensing
                setSensingEnabled(false);
                setTimeout(()=>setSensingEnabled(true), 500);
            }
        }
    }, [
        detectedInput,
        currentlyTesting,
        confirmCount,
        skipCount,
        primaryInput
    ]);
    // Voice skip via transcription (all tests)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (primaryInput !== 'voice' || !transcription || !currentlyTesting) return;
        const text = transcription.text.toLowerCase();
        if (!text.includes('skip')) return;
        const newCount = skipCount + 1;
        setSkipCount(newCount);
        const beep = new SpeechSynthesisUtterance(`skip ${newCount}`);
        beep.rate = 1.2;
        window.speechSynthesis.speak(beep);
        if (newCount >= requiredConfirmations) {
            handleSkip();
        }
    }, [
        primaryInput,
        transcription,
        currentlyTesting,
        skipCount
    ]);
    // Voice verification via transcription
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentlyTesting !== 'voice' || !transcription) return;
        const text = transcription.text.toLowerCase();
        if (voiceChallenge && text.includes(voiceChallenge.word)) {
            const newCount = confirmCount + 1;
            setConfirmCount(newCount);
            const beep = new SpeechSynthesisUtterance(`${newCount}`);
            beep.rate = 1.2;
            window.speechSynthesis.speak(beep);
            if (newCount >= requiredConfirmations) {
                handleConfirm('voice');
            } else {
                pickVoiceChallenge();
            }
        }
    }, [
        currentlyTesting,
        transcription,
        voiceChallenge,
        confirmCount,
        skipCount,
        primaryInput
    ]);
    const handleConfirm = (inputType)=>{
        console.log('✓ Confirmed:', inputType);
        setDetectedInputs((prev)=>[
                ...prev,
                inputType
            ]);
        setTestedInputs((prev)=>prev.includes(inputType) ? prev : [
                ...prev,
                inputType
            ]);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Great! ${inputType} confirmed.`);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        setTimeout(()=>{
            setCurrentlyTesting(null);
            setConfirmCount(0);
            setSkipCount(0);
        }, 1500);
    };
    const handleSkip = ()=>{
        console.log('⏭️ Skipped:', currentlyTesting);
        if (currentlyTesting) {
            setTestedInputs((prev)=>prev.includes(currentlyTesting) ? prev : [
                    ...prev,
                    currentlyTesting
                ]);
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Skipped.');
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        setTimeout(()=>{
            setCurrentlyTesting(null);
            setConfirmCount(0);
            setSkipCount(0);
        }, 800);
    };
    // Cleanup
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            window.speechSynthesis.cancel();
        };
    }, []);
    if (!currentlyTesting) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-6xl mb-4 animate-pulse",
                        children: "✓"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 296,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-black",
                        children: "Analyzing inputs..."
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 297,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                lineNumber: 295,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
            lineNumber: 294,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                ref: videoRef,
                className: "hidden",
                playsInline: true,
                muted: true
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                lineNumber: 305,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-3xl text-center space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-32 h-32 bg-white/10 rounded-full flex items-center justify-center",
                            children: inputIcons[currentlyTesting]
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                            lineNumber: 310,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 309,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-black",
                        children: inputPrompts[currentlyTesting]
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 316,
                        columnNumber: 17
                    }, this),
                    currentlyTesting === 'voice' && voiceChallenge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white text-black rounded-2xl px-8 py-6 inline-flex flex-col items-center gap-2 border-4 border-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-semibold uppercase tracking-wide",
                                children: [
                                    "Say the ",
                                    voiceChallenge.category
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 322,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-4xl font-black",
                                children: voiceChallenge.word
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 325,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-600",
                                children: [
                                    Math.max(0, Math.ceil((voiceChallengeExpires - Date.now()) / 1000)),
                                    "s remaining"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 328,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 321,
                        columnNumber: 21
                    }, this),
                    currentlyTesting === 'voice' && (!status.speechActive || status.speechError) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>requestSpeechStart?.(),
                        className: "mt-4 px-6 py-3 bg-white text-black font-bold rounded-lg border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                        children: "Enable Voice Recognition"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 335,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 mb-2",
                                        children: "Try it:"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                        lineNumber: 347,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center gap-4",
                                        children: [
                                            ...Array(requiredConfirmations)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-lg font-black transition-all ${i < confirmCount ? 'bg-green-500 scale-110' : 'bg-white/20'}`,
                                                children: i < confirmCount ? '✓' : i + 1
                                            }, i, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                                lineNumber: 350,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                        lineNumber: 348,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 346,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 mb-2",
                                        children: skipPrompt
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                        lineNumber: 364,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center gap-4",
                                        children: [
                                            ...Array(requiredConfirmations)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-12 h-12 rounded-full border-4 border-gray-500 flex items-center justify-center text-lg font-black transition-all ${i < skipCount ? 'bg-gray-600 scale-110' : 'bg-white/10'}`,
                                                children: i < skipCount ? '⏭' : i + 1
                                            }, i, false, {
                                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                                lineNumber: 367,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                        lineNumber: 365,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 363,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 344,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: [
                            "Auto-skip in ",
                            30 - timeoutCounter,
                            "s"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 381,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-8 border-t border-white/20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 mb-4",
                                children: [
                                    "Testing ",
                                    detectedInputs.length + 1,
                                    " of ",
                                    allInputTypes.length,
                                    " inputs"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 387,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center gap-2 flex-wrap",
                                children: allInputTypes.map((input)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `px-3 py-1 rounded-full text-xs font-bold ${detectedInputs.includes(input) ? 'bg-green-500 text-white' : input === currentlyTesting ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'}`,
                                        children: input
                                    }, input, false, {
                                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                        lineNumber: 392,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 390,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 386,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 justify-center pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>{
                                    const newCount = confirmCount + 1;
                                    setConfirmCount(newCount);
                                    if (newCount >= requiredConfirmations) {
                                        handleConfirm(currentlyTesting);
                                    }
                                },
                                className: "text-lg px-6 py-4 font-bold border-4 border-white bg-green-600 hover:bg-green-700",
                                children: [
                                    "Yes (",
                                    confirmCount,
                                    "/",
                                    requiredConfirmations,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 410,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>{
                                    const newCount = skipCount + 1;
                                    setSkipCount(newCount);
                                    if (newCount >= requiredConfirmations) {
                                        handleSkip();
                                    }
                                },
                                className: "text-lg px-6 py-4 font-bold border-4 border-white bg-gray-600 hover:bg-gray-700",
                                children: [
                                    "Skip (",
                                    skipCount,
                                    "/",
                                    requiredConfirmations,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                                lineNumber: 422,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 409,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                lineNumber: 307,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-72",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-bold mb-2",
                        children: "System Status"
                    }, void 0, false, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 439,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Mic: ",
                            status.audioReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 440,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Camera: ",
                            status.videoReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 441,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech API: ",
                            status.speechAvailable ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 442,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Active: ",
                            status.speechActive ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 443,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Error: ",
                            status.speechError ?? 'none'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 444,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "MediaPipe: ",
                            status.mediaPipeReady ? 'READY' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 445,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Face Detected: ",
                            status.faceDetected ? 'YES' : 'NO'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 446,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Detection Lock: ",
                            status.detectionLocked ? 'LOCKED' : 'OPEN'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 447,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Audio Level: ",
                            Math.round(status.audioLevel)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 448,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Last Transcript: ",
                            status.lastTranscript || '—'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 449,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            "Speech Event: ",
                            status.lastSpeechEvent
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                        lineNumber: 450,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
                lineNumber: 438,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx",
        lineNumber: 304,
        columnNumber: 9
    }, this);
}
}),
"[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$beacon$2d$screen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/beacon-screen.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$lock$2d$on$2d$screen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/lock-on-screen.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$input$2d$explorer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/components/onboarding/input-explorer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/GitHub/ntu-beyond-binary/frontend/lib/fluent-context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function OnboardingPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { updateSetting } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$lib$2f$fluent$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFluentContext"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('beacon');
    const [detectedInputType, setDetectedInputType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const [allDetectedInputs, setAllDetectedInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [profileName, setProfileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const handleInputDetected = (type)=>{
        console.log('🎯 OnboardingPage.handleInputDetected called with type:', type);
        setDetectedInputType(type);
        setAllDetectedInputs([
            type
        ]);
        setStep('lock-on');
    };
    const handleLockOnConfirmed = ()=>{
        console.log('Lock-on confirmed, exploring other inputs');
        setStep('explore');
    };
    const handleLockOnTimeout = ()=>{
        console.log('Lock-on timeout, returning to beacon');
        setStep('beacon');
        setDetectedInputType('none');
    };
    const handleExplorationComplete = (allInputs)=>{
        console.log('Exploration complete:', allInputs);
        setAllDetectedInputs(allInputs);
        setStep('name');
    };
    const handleProfileNameSubmit = ()=>{
        if (!profileName.trim() || allDetectedInputs.length === 0) return;
        // Default settings based on inputs
        updateSetting('dwellTime', 1000);
        updateSetting('tremorFilter', 0);
        // Create profile object
        const profile = {
            name: profileName.trim(),
            primaryInput: detectedInputType,
            availableInputs: allDetectedInputs,
            lastUsed: new Date().toISOString(),
            calibration: {
                primaryInput: detectedInputType,
                availableInputs: allDetectedInputs,
                precision: 'medium',
                tremorDetected: false,
                dwellTime: 1000,
                rangeOfMotion: 100,
                preferredSpeed: 'medium'
            }
        };
        // Save to profiles list
        const existingProfiles = JSON.parse(localStorage.getItem('fluent-user-profiles') || '[]');
        existingProfiles.push(profile);
        localStorage.setItem('fluent-user-profiles', JSON.stringify(existingProfiles));
        // Mark onboarding as complete
        localStorage.setItem('fluent-onboarding-complete', 'true');
        localStorage.setItem('fluent-current-profile', profileName.trim());
        localStorage.setItem('fluent-primary-input', detectedInputType);
        localStorage.setItem('fluent-available-inputs', JSON.stringify(allDetectedInputs));
        localStorage.setItem('fluent-calibration', JSON.stringify(profile.calibration));
        setStep('complete');
        // Redirect to dashboard after showing success
        setTimeout(()=>{
            router.push('/');
        }, 3000);
    };
    const handleSkipOnboarding = ()=>{
        // Set minimal defaults
        updateSetting('dwellTime', 1000);
        updateSetting('tremorFilter', 0);
        // Create default profile
        const defaultProfile = {
            name: 'Guest',
            primaryInput: 'type',
            availableInputs: [
                'type',
                'voice'
            ],
            lastUsed: new Date().toISOString(),
            calibration: {
                primaryInput: 'type',
                availableInputs: [
                    'type',
                    'voice'
                ],
                precision: 'medium',
                tremorDetected: false,
                dwellTime: 1000,
                rangeOfMotion: 100,
                preferredSpeed: 'medium'
            }
        };
        // Save minimal profile
        const existingProfiles = JSON.parse(localStorage.getItem('fluent-user-profiles') || '[]');
        existingProfiles.push(defaultProfile);
        localStorage.setItem('fluent-user-profiles', JSON.stringify(existingProfiles));
        // Mark onboarding as skipped/complete
        localStorage.setItem('fluent-onboarding-complete', 'true');
        localStorage.setItem('fluent-current-profile', 'Guest');
        localStorage.setItem('fluent-primary-input', 'type');
        localStorage.setItem('fluent-available-inputs', JSON.stringify([
            'type',
            'voice'
        ]));
        localStorage.setItem('fluent-calibration', JSON.stringify(defaultProfile.calibration));
        // Redirect to dashboard
        router.push('/');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            step !== 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleSkipOnboarding,
                className: "fixed top-6 left-6 z-50 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all",
                "aria-label": "Skip onboarding",
                children: "Skip Onboarding →"
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 131,
                columnNumber: 17
            }, this),
            step === 'beacon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$beacon$2d$screen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BeaconScreen"], {
                onInputDetected: handleInputDetected
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 140,
                columnNumber: 35
            }, this),
            step === 'lock-on' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$lock$2d$on$2d$screen$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LockOnScreen"], {
                detectedInput: detectedInputType,
                onConfirmed: handleLockOnConfirmed,
                onTimeout: handleLockOnTimeout
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 143,
                columnNumber: 17
            }, this),
            step === 'explore' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$components$2f$onboarding$2f$input$2d$explorer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InputExplorer"], {
                primaryInput: detectedInputType,
                detectedInputs: allDetectedInputs,
                onComplete: handleExplorationComplete
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 151,
                columnNumber: 17
            }, this),
            step === 'name' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-black mb-4 text-center",
                            children: "What's your name?"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 161,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-6 text-center",
                            children: "This helps us save your settings"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 162,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: profileName,
                            onChange: (e)=>setProfileName(e.target.value),
                            onKeyDown: (e)=>e.key === 'Enter' && handleProfileNameSubmit(),
                            placeholder: "Enter your name",
                            className: "w-full px-4 py-3 border-4 border-black rounded-lg text-lg font-bold mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400",
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 164,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleProfileNameSubmit,
                            disabled: !profileName.trim(),
                            className: "w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-black py-3 px-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:cursor-not-allowed",
                            children: "Continue"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 174,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                    lineNumber: 160,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 159,
                columnNumber: 17
            }, this),
            step === 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-9xl mb-8 animate-bounce",
                            children: "✓"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 188,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-6xl font-black text-white mb-4",
                            children: [
                                "Welcome, ",
                                profileName,
                                "!"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 189,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xl text-white/80 font-bold",
                            children: "Your profile is ready"
                        }, void 0, false, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 190,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-white/60 mt-4",
                            children: [
                                "Primary Input: ",
                                detectedInputType
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 191,
                            columnNumber: 25
                        }, this),
                        allDetectedInputs.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$GitHub$2f$ntu$2d$beyond$2d$binary$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-white/60",
                            children: [
                                "Also available: ",
                                allDetectedInputs.filter((i)=>i !== detectedInputType).join(', ')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                            lineNumber: 195,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                    lineNumber: 187,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/GitHub/ntu-beyond-binary/frontend/app/onboarding/page.tsx",
                lineNumber: 186,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=Documents_GitHub_ntu-beyond-binary_frontend_6196d325._.js.map