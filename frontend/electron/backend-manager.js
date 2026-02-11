/**
 * Backend Manager for Fluent Electron App
 * Handles starting and stopping the bundled Python backend server
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

let pythonServer = null
let serverReady = false

/**
 * Find Python executable on the system
 */
function findPythonExecutable() {
    const { execSync } = require('child_process')
    
    // Try different Python commands
    const pythonCommands = ['python', 'python3', 'py']
    
    for (const cmd of pythonCommands) {
        try {
            // Check if command exists and is Python 3
            const version = execSync(`${cmd} --version`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
            if (version.includes('Python 3')) {
                console.log(`Found Python: ${cmd} (${version.trim()})`)
                return cmd
            }
        } catch (error) {
            // Command not found, try next one
            continue
        }
    }
    
    // If not found in PATH, try common Windows locations
    if (process.platform === 'win32') {
        const commonPaths = [
            'C:\\Python311\\python.exe',
            'C:\\Python310\\python.exe',
            'C:\\Python39\\python.exe',
            path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python311\\python.exe'),
            path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python310\\python.exe'),
            path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python39\\python.exe'),
        ]
        
        for (const pythonPath of commonPaths) {
            if (fs.existsSync(pythonPath)) {
                console.log(`Found Python at: ${pythonPath}`)
                return pythonPath
            }
        }
    }
    
    return null
}

/**
 * Get the path to the bundled backend executable
 */
function getBackendPath() {
    const isDev = process.env.NODE_ENV === 'development'
    
    if (isDev) {
        // Development: use Python directly
        const pythonExe = findPythonExecutable()
        
        if (!pythonExe) {
            throw new Error(
                'Python 3 not found! Please install Python 3.9-3.11 from https://www.python.org/\n\n' +
                'Make sure to check "Add Python to PATH" during installation.'
            )
        }
        
        return {
            type: 'python',
            executable: pythonExe,
            script: path.join(__dirname, '../../backend/src/server.py'),
            cwd: path.join(__dirname, '../../backend/src')
        }
    } else {
        // Production: use bundled executable
        const resourcesPath = process.resourcesPath
        const backendDir = path.join(resourcesPath, 'backend')
        
        let executable
        if (process.platform === 'win32') {
            executable = path.join(backendDir, 'fluent-backend.exe')
        } else if (process.platform === 'darwin') {
            executable = path.join(backendDir, 'fluent-backend')
        } else {
            executable = path.join(backendDir, 'fluent-backend')
        }
        
        return {
            type: 'executable',
            executable: executable,
            cwd: backendDir
        }
    }
}

/**
 * Ensure .env file exists in production
 */
function ensureEnvFile() {
    const isDev = process.env.NODE_ENV === 'development'
    
    if (!isDev) {
        const resourcesPath = process.resourcesPath
        const backendDir = path.join(resourcesPath, 'backend')
        const envPath = path.join(backendDir, '.env')
        const envExamplePath = path.join(backendDir, 'env.example')
        
        // Create .env from example if it doesn't exist
        if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envExamplePath, envPath)
            console.log('.env file created from template')
        }
        
        return envPath
    }
    
    return path.join(__dirname, '../../backend/.env')
}

/**
 * Start the Python backend server
 */
function startBackendServer() {
    return new Promise((resolve, reject) => {
        let backend
        
        try {
            backend = getBackendPath()
            ensureEnvFile()
            
            console.log('Starting backend server...')
            console.log('Backend type:', backend.type)
            console.log('Backend path:', backend.executable)
            
            // For development mode with Python, check if script exists (not the python executable)
            if (backend.type === 'python') {
                if (!fs.existsSync(backend.script)) {
                    const error = `Backend script not found: ${backend.script}`
                    console.error(error)
                    reject(new Error(error))
                    return
                }
            } else {
                // For production, check if executable exists
                if (!fs.existsSync(backend.executable)) {
                    const error = `Backend executable not found: ${backend.executable}`
                    console.error(error)
                    reject(new Error(error))
                    return
                }
            }
        } catch (error) {
            reject(error)
            return
        }
        
        // Spawn the server process
        let args = []
        if (backend.type === 'python') {
            args = [backend.script]
        }
        
        pythonServer = spawn(backend.executable, args, {
            cwd: backend.cwd,
            env: { 
                ...process.env,
                PYTHONUNBUFFERED: '1'  // Ensure real-time output
            },
            stdio: ['ignore', 'pipe', 'pipe']
        })
        
        // Handle stdout
        pythonServer.stdout.on('data', (data) => {
            const output = data.toString().trim()
            console.log(`[Backend] ${output}`)
            
            // Check if server is ready
            if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
                serverReady = true
                resolve()
            }
        })
        
        // Handle stderr
        pythonServer.stderr.on('data', (data) => {
            const error = data.toString().trim()
            console.error(`[Backend Error] ${error}`)
            
            // Some startup messages come through stderr, check for ready state
            if (error.includes('Uvicorn running on') || error.includes('Application startup complete')) {
                serverReady = true
                resolve()
            }
        })
        
        // Handle process exit
        pythonServer.on('close', (code) => {
            console.log(`Backend server exited with code ${code}`)
            pythonServer = null
            serverReady = false
        })
        
        // Handle spawn errors
        pythonServer.on('error', (error) => {
            console.error('Failed to start backend server:', error)
            reject(error)
        })
        
        // Timeout after 30 seconds if server doesn't start
        setTimeout(() => {
            if (!serverReady) {
                console.warn('Backend server startup timeout, but continuing...')
                resolve()  // Resolve anyway, the server might still be starting
            }
        }, 30000)
    })
}

/**
 * Stop the Python backend server
 */
function stopBackendServer() {
    if (pythonServer) {
        console.log('Stopping backend server...')
        
        // Try graceful shutdown first
        try {
            if (process.platform === 'win32') {
                spawn('taskkill', ['/pid', pythonServer.pid, '/f', '/t'])
            } else {
                pythonServer.kill('SIGTERM')
            }
        } catch (error) {
            console.error('Error stopping server:', error)
        }
        
        // Force kill after 5 seconds if still running
        setTimeout(() => {
            if (pythonServer) {
                pythonServer.kill('SIGKILL')
            }
        }, 5000)
        
        pythonServer = null
        serverReady = false
    }
}

/**
 * Check if the backend server is running
 */
function isServerReady() {
    return serverReady
}

/**
 * Get the backend server URL
 */
function getServerURL() {
    return 'http://127.0.0.1:8000'
}

module.exports = {
    startBackendServer,
    stopBackendServer,
    isServerReady,
    getServerURL
}
