import sys
import os

# Catalyst Dependency Bundling: Add bundled library folder to python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))

import uvicorn

if __name__ == "__main__":
    # Catalyst AppSail injects port dynamically
    try:
        port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT") or os.environ.get("X_ZOHO_CATALYST_APP_PORT") or os.environ.get("PORT") or "9000"
        port = int(port_str)
    except Exception:
        port = 9000
    
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
