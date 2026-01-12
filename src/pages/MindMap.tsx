import { useCallback, useMemo, useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Node, 
  Edge, 
  Connection,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { useConnections } from '@/hooks/useConnections';
import MindMapNode from '@/components/mindmap/MindMapNode';
import MindMapToolbar from '@/components/mindmap/MindMapToolbar';
import NodeEditModal from '@/components/mindmap/NodeEditModal';
import { motion } from 'framer-motion';

const nodeTypes = {
  mindMapNode: MindMapNode,
};

function MindMapFlow() {
  const { items, createItem, updateItem, deleteItem } = useItems('idea');
  const { connections, createConnection, deleteConnection } = useConnections();
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleEditNode = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setEditingNodeId(id);
      setEditingContent(item.content);
      setModalMode('edit');
      setModalOpen(true);
    }
  }, [items]);

  const handleDeleteNode = useCallback((id: string) => {
    deleteItem.mutate(id);
  }, [deleteItem]);

  const handleConnectNode = useCallback((id: string) => {
    // This is handled by the onConnect callback
  }, []);

  const initialNodes: Node[] = useMemo(() => 
    items.map((item, i) => ({
      id: item.id,
      type: 'mindMapNode',
      position: { 
        x: item.position_x || 150 + (i % 4) * 280, 
        y: item.position_y || 100 + Math.floor(i / 4) * 180 
      },
      data: { 
        label: item.content.slice(0, 80) + (item.content.length > 80 ? '...' : ''),
        content: item.content,
        status: item.status,
        onEdit: handleEditNode,
        onDelete: handleDeleteNode,
        onConnect: handleConnectNode,
      },
    })),
    [items, handleEditNode, handleDeleteNode, handleConnectNode]
  );

  const initialEdges: Edge[] = useMemo(() => 
    connections.map(c => ({
      id: c.id,
      source: c.source_id,
      target: c.target_id,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: 'hsl(262 83% 58% / 0.6)', 
        strokeWidth: 2,
      },
    })),
    [connections]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes and edges when data changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'hsl(262 83% 58% / 0.6)', strokeWidth: 2 } 
    }, eds));
    if (params.source && params.target) {
      createConnection.mutate({ source_id: params.source, target_id: params.target });
    }
  }, [createConnection, setEdges]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    updateItem.mutate({
      id: node.id,
      position_x: node.position.x,
      position_y: node.position.y,
    });
  }, [updateItem]);

  const handleAddNode = useCallback(() => {
    setEditingNodeId(null);
    setEditingContent('');
    setModalMode('create');
    setModalOpen(true);
  }, []);

  const handleSaveNode = useCallback((data: { content: string }) => {
    if (modalMode === 'create') {
      // Calculate position for new node
      const lastNode = nodes[nodes.length - 1];
      const newX = lastNode ? lastNode.position.x + 300 : 200;
      const newY = lastNode ? lastNode.position.y : 200;
      
      createItem.mutate({
        type: 'idea',
        content: data.content,
      });
    } else if (editingNodeId) {
      updateItem.mutate({
        id: editingNodeId,
        content: data.content,
      });
    }
  }, [modalMode, editingNodeId, nodes, createItem, updateItem]);

  const handleAutoLayout = useCallback(() => {
    const newNodes = nodes.map((node, i) => ({
      ...node,
      position: {
        x: 150 + (i % 4) * 280,
        y: 100 + Math.floor(i / 4) * 180,
      },
    }));
    setNodes(newNodes);
    
    // Save positions
    newNodes.forEach(node => {
      updateItem.mutate({
        id: node.id,
        position_x: node.position.x,
        position_y: node.position.y,
      });
    });
    
    setTimeout(() => fitView({ padding: 0.2 }), 100);
  }, [nodes, setNodes, updateItem, fitView]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 500 });
  }, [fitView]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6 border-b border-border bg-background/80 backdrop-blur-sm"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          <span className="gradient-text">🌌 Mapa Mental</span>
        </h1>
        <p className="text-muted-foreground">Conecte suas ideias visualmente • Arraste para mover • Conecte arrastando entre nós</p>
      </motion.header>
      
      <div className="flex-1 relative" style={{ minHeight: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-background"
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background 
            variant={BackgroundVariant.Dots}
            color="hsl(262 83% 58% / 0.15)" 
            gap={24}
            size={2}
          />
          <Controls 
            className="!bg-card/90 !backdrop-blur-xl !border-white/10 !rounded-xl !shadow-xl"
            showInteractive={false}
          />
        </ReactFlow>

        <MindMapToolbar
          onAddNode={handleAddNode}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitView={handleFitView}
          onAutoLayout={handleAutoLayout}
        />

        {/* Empty state */}
        {nodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-display font-semibold mb-2">Seu mapa mental está vazio</h3>
              <p className="text-muted-foreground mb-4">Clique no botão + abaixo para adicionar sua primeira ideia</p>
            </div>
          </motion.div>
        )}
      </div>

      <NodeEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNode}
        initialContent={editingContent}
        mode={modalMode}
      />
    </div>
  );
}

export default function MindMap() {
  return (
    <AppLayout>
      <ReactFlowProvider>
        <MindMapFlow />
      </ReactFlowProvider>
    </AppLayout>
  );
}
