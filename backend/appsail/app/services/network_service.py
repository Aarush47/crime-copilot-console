from app.schemas.network import NetworkResponse, Node, Edge, NodeData, EdgeData
from app.utils.logger import logger

class NetworkService:
    @staticmethod
    async def get_network(case_id: str) -> NetworkResponse:
        logger.info(f"Generating network graph for case {case_id}")
        
        return NetworkResponse(
            nodes=[
                Node(data=NodeData(id="n1", label="Suspect A", type="person")),
                Node(data=NodeData(id="n2", label="Phone 1234567890", type="phone")),
                Node(data=NodeData(id="n3", label="Bank Acct 9999", type="account")),
            ],
            edges=[
                Edge(data=EdgeData(source="n1", target="n2", label="owns")),
                Edge(data=EdgeData(source="n1", target="n3", label="transferred to")),
            ]
        )
