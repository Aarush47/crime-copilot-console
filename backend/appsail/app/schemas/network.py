from pydantic import BaseModel
from typing import List

class NodeData(BaseModel):
    id: str
    label: str
    type: str

class Node(BaseModel):
    data: NodeData

class EdgeData(BaseModel):
    source: str
    target: str
    label: str

class Edge(BaseModel):
    data: EdgeData

class NetworkResponse(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
