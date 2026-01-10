import { useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { useConnections } from '@/hooks/useConnections';
import { getItemTypeConfig } from '@/types';

export default function MindMap() {
  const { items } = useItems('idea');
  const { connections, createConnection } = useConnections();

  const initialNodes: Node[] = useMemo(() => 
    items.map((item, i) => ({
      id: item.id,
      position: { x: item.position_x || 150 + (i % 3) * 250, y: item.position_y || 100 + Math.floor(i / 3) * 150 },
      data: { label: item.content.slice(0, 50) + (item.content.length > 50 ? '...' : '') },
      style: { background: 'hsl(262 83% 58% / 0.2)', border: '1px solid hsl(262 83% 58% / 0.5)', borderRadius: '12px', padding: '12px', color: 'hsl(210 40% 98%)' },
    })),
    [items]
  );

  const initialEdges: Edge[] = useMemo(() => 
    connections.map(c => ({
      id: c.id,
      source: c.source_id,
      target: c.target_id,
      style: { stroke: 'hsl(262 83% 58% / 0.5)' },
    })),
    [connections]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, style: { stroke: 'hsl(262 83% 58% / 0.5)' } }, eds));
    if (params.source && params.target) {
      createConnection.mutate({ source_id: params.source, target_id: params.target });
    }
  }, [createConnection]);

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col">
        <header className="p-4 md:p-6 border-b border-border">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">🌌 Mapa Mental</h1>
          <p className="text-muted-foreground">Conecte suas ideias visualmente</p>
        </header>
        <div className="flex-1" style={{ minHeight: 400 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-background"
          >
            <Controls className="!bg-card !border-border" />
            <Background color="hsl(217 33% 17%)" gap={20} />
          </ReactFlow>
        </div>
      </div>
    </AppLayout>
  );
}
