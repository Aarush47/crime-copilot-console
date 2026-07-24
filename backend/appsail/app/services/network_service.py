from app.schemas.network import NetworkResponse, Node, Edge, NodeData, EdgeData
from app.utils.logger import logger

class NetworkService:
    @staticmethod
    async def get_network(case_id: str) -> NetworkResponse:
        logger.info(f"Generating network graph for case {case_id}")
        
        try:
            from app.database.repositories.network_repository import NetworkRepository
            graph_data = await NetworkRepository.get_network_for_case(case_id)
            
            # If no data found, return an empty graph instead of failing
            if not graph_data["nodes"]:
                return NetworkResponse(nodes=[], edges=[])
                
            nodes = [Node(data=NodeData(**n["data"])) for n in graph_data["nodes"]]
            edges = [Edge(data=EdgeData(**e["data"])) for e in graph_data["edges"]]
            
            return NetworkResponse(nodes=nodes, edges=edges)
        except Exception as e:
            logger.error(f"Error in get_network: {e}")
            return NetworkResponse(nodes=[], edges=[])
