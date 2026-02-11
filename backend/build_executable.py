"""
Build a standalone executable for the backend server using PyInstaller.
This creates a single executable that includes Python and all dependencies.
"""

import PyInstaller.__main__
import sys
import os

def build_server():
    """Build the backend server as a standalone executable."""
    
    # Get the directory of this script
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(backend_dir, 'src')
    server_py = os.path.join(src_dir, 'server.py')
    
    # PyInstaller arguments
    args = [
        server_py,
        '--name=fluent-backend',
        '--onefile',  # Single executable
        '--console',  # Keep console for logging
        '--clean',  # Clean PyInstaller cache
        f'--distpath={os.path.join(backend_dir, "dist")}',
        f'--workpath={os.path.join(backend_dir, "build")}',
        f'--specpath={backend_dir}',
        
        # Add data files
        f'--add-data={os.path.join(src_dir, "translate")}:translate',
        f'--add-data={os.path.join(src_dir, "storage")}:storage',
        
        # Hidden imports (modules imported dynamically)
        '--hidden-import=fastapi',
        '--hidden-import=uvicorn',
        '--hidden-import=websockets',
        '--hidden-import=mediapipe',
        '--hidden-import=cv2',
        '--hidden-import=tensorflow',
        '--hidden-import=sklearn',
        '--hidden-import=google.generativeai',
        '--hidden-import=PIL',
        '--hidden-import=numpy',
        
        # Collect all submodules
        '--collect-all=mediapipe',
        '--collect-all=google.generativeai',
        '--collect-all=tensorflow',
        
        # Icon (if available)
        # f'--icon={os.path.join(backend_dir, "icon.ico")}',
    ]
    
    print("Building backend executable...")
    print(f"Server script: {server_py}")
    print("\nThis may take several minutes...\n")
    
    PyInstaller.__main__.run(args)
    
    print("\n" + "="*60)
    print("Build complete!")
    print(f"Executable location: {os.path.join(backend_dir, 'dist', 'fluent-backend.exe')}")
    print("="*60)

if __name__ == '__main__':
    build_server()
