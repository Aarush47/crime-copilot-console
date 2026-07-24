import zcatalyst_sdk
from app.utils.logger import logger

from app.middleware.context import request_context

class CatalystDatabase:
    """
    Manages the Zoho Catalyst SDK initialization and Data Store connections.
    """
    def __init__(self):
        self.last_error = None

    def get_app(self):
        req = request_context.get()
        if req:
            try:
                return zcatalyst_sdk.initialize(req=req)
            except Exception as e:
                logger.error(f"Failed to initialize Catalyst SDK with req: {e}")
                self.last_error = str(e)
                return None
        else:
            try:
                return zcatalyst_sdk.initialize()
            except Exception as e:
                logger.error(f"Failed to initialize Catalyst SDK globally: {e}")
                self.last_error = str(e)
                return None

    def get_datastore(self):
        app = self.get_app()
        if app:
            return app.datastore()
        return None

    def get_zcql(self):
        app = self.get_app()
        if app:
            return app.zcql()
        return None

db = CatalystDatabase()
